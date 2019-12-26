import cors from '@koa/cors';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import fs from 'fs';
import http from 'http';
import https from 'https';
import jwt from 'jsonwebtoken';
import Koa from 'koa';
import AsyncBusboy from 'koa-async-busboy';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import basicAuth from 'koa-basic-auth';
import mount from 'koa-mount';
import onerror from 'koa-onerror';
import Router from 'koa-router';
import send from 'koa-send';
import koaSslify from 'koa-sslify';
import staticFiles from 'koa-static';
import path from 'path';
import sharp from 'sharp';
import socketIo from 'socket.io';
import stream from 'stream';
import { fileURLToPath } from 'url';
import db from './db.js';
import searchFromAll from './library.js';
import { PATCH_BOOK, ADD_BOOK, HIDE_BOOK } from './client/src/reducers/sharedActions.mjs';
import resizedName from './client/src/cover.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const sslify = koaSslify.default;
const resolver = koaSslify.xForwardedProtoResolver;

const PORT = process.env.PORT || 5000;
const ADMIN_TOKEN_EXPIRATION = '1h';

const envOverride = `${__dirname}/.env`;
if (fs.existsSync(envOverride)) {
  const rows = fs.readFileSync(envOverride).toString().split('\n');
  rows.forEach(row => {
    const [key, val] = row.split('=', 2);
    if (key && val && key.trim() && val.trim()) {
      process.env[key] = val;
    }
  });
}

const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'BUCKET',
  'BUCKET_REGION',
  'ADMIN_NAME',
  'ADMIN_PASS',
  'APP_SECRET',
  'NAME_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} environment variable is not set`);
    process.exit(1);
  }
}
const { BUCKET, BUCKET_REGION, ADMIN_NAME, ADMIN_PASS, APP_SECRET, NAME_SECRET } = process.env;

const app = new Koa();
onerror(app);
if (process.env.NODE_ENV === 'production') {
  app.use(sslify({ resolver }));
}
app.use(json({}));
app.use(cors());
app.use(bodyParser());
app.use(staticFiles(`${__dirname}/client/build`));

app.use(async (ctx, next) => {
  const token = parseToken(ctx);
  if (token) {
    try {
      ctx.state.user = await verifyToken(token);
      ctx.state.user.sha = userSha(ctx.state.user.name, token, ctx.state.user.admin);
    } catch (err) {
      ctx.state.authError = err;
      if (err.name === 'TokenExpiredError') {
        ctx.state.expired = true;
        ctx.set('Token-Expired', 'true');
      }
    }
  }
  return next();
});

function parseToken(ctx) {
  const auth = ctx.header && ctx.header.authorization || '';
  if (!auth.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  return auth.substr('bearer '.length);
}

app.use(mount('/api/test', basicAuth({ name: ADMIN_NAME, pass: ADMIN_PASS })));
app.use(mount('/api/migrate', basicAuth({ name: ADMIN_NAME, pass: ADMIN_PASS })));

router.get('/api/books', list)
  .get('/api/book/:isbn', view)
  .patch('/api/book/:isbn', edit)
  .post('/api/book', create)
  .get('/api/search/:isbn', search)
  .post('/api/login', login)
  .post('/api/forget', forget)
  .post('/api/book/:isbn/reserve', reserve)
  .post('/api/book/:isbn/decline', decline)
  .delete('/api/user/:sha/books', deleteBooks)
  .get('/api/test', test)
  .get('/api/migrate', migrate)
  .all('*', async (ctx) => {
    await send(ctx, 'client/build/index.html');
  });

app.use(router.routes());

const server = http.createServer(app.callback());
const io = socketIo(server);

function socketService(socket) {
  socket.on('validate_session', async data => {
    try {
      await verifyToken(data.token);
      socket.emit('session_validated', { valid: true });
    } catch (err) {
      socket.emit('session_validated', { valid: false });
    }
  });
}

io.on('connection', socketService);

async function list(ctx) {
  const sha = ctx.state.user && ctx.state.user.sha;
  const admin = ctx.state.user && ctx.state.user.admin;
  ctx.body = await db.retrieveBooks(sha, admin);
}

async function view(ctx) {
  ctx.body = await db.retrieveBook(ctx.params.isbn);
}

async function edit(ctx) {
  if (!(ctx.state.user && ctx.state.user.admin)) {
    ctx.status = 403;
    ctx.body = { message: 'Forbidden' };
    return;
  }
  const book = await db.retrieveBook(ctx.params.isbn);
  const patch = ctx.request.body;
  const patched = { ...book, ...patch };
  await db.storeBook(patched);
  io.emit('dispatch', { type: PATCH_BOOK, isbn: book.isbn, patch });
  ctx.set('Content-Location', `/api/book/${patched.isbn}`);
  ctx.status = 200;
  ctx.body = { message: 'Ok' };
}

async function search(ctx) {
  ctx.body = await searchFromAll(ctx.params.isbn);
}

async function create(ctx) {
  const busboy = new AsyncBusboy({
    headers: ctx.req.headers
  });
  let fileName, book;
  let promises = [];
  await busboy
    .onFile((fieldName, fileStream, filename, _, mimeType) => {
      if (fieldName === 'cover') {
        fileName = `${Math.round(Math.random() * 10000000)}_${filename}`;
        const uploads = resizeAndUpload(fileStream, fileName, mimeType);
        promises = promises.concat(uploads);
      }
    })
    .onField((fieldName, val) => {
      if (fieldName === 'metadata') {
        book = JSON.parse(val);
      }
    })
    .pipe(ctx.req);
  if (book) {
    if (fileName) {
      book.cover = `https://s3.eu-north-1.amazonaws.com/bookdump/${fileName}`;
    }
    promises.push(db.storeBook(book));
    await Promise.all(promises);
    io.emit('dispatch', { type: ADD_BOOK, book });
    ctx.status = 201;
    ctx.set('Content-Location', `/book/${book.isbn}`);
    ctx.body = book;
  } else {
    ctx.status = 400;
    ctx.body = { message: 'No book metadata' };
  }
}

async function test(ctx) {
  ctx.status = 200;
  ctx.body = { message: 'Ok' };
}

async function migrate(ctx) {
  const sha = ctx.state.user && ctx.state.user.sha;
  const admin = ctx.state.user && ctx.state.user.admin;
  const books = await db.retrieveBooks(sha, admin);

  for (const book of books) {
    const originUrl = resizedName(book.cover, 540);
    const baseName = book.cover.substring(book.cover.lastIndexOf('/') + 1);
    const inputStream = await download(originUrl);
    await resizeAndUpload(inputStream, baseName, 'image/png', [810, 120]);
  }

  ctx.status = 200;
  ctx.body = { message: 'Ok' };
}

function download(url) {
  return new Promise(resolve => https.get(url, res => resolve(res)));
}

async function resizeAndUpload(fileStream, fileName, mimeType, dims = [810, 540, 270, 120, 80, 40]) {
  const resizer = sharp();
  const promises = [];
  for (const dim of dims) {
    promises.push(new Promise((resolve, reject) =>
      resizer.clone().resize(dim, dim, { fit: sharp.fit.inside })
        .pipe(upload(resizedName(fileName, `${dim}`), mimeType, resolve, reject))));
  }
  fileStream.pipe(resizer);
  return promises;
}

async function login(ctx) {
  const { name, pass } = ctx.request.body;
  if (name === ADMIN_NAME && pass === ADMIN_PASS) {
    const adminToken = await signToken(name, true);
    ctx.status = 200;
    ctx.body = { token: adminToken, name, admin: true, sha: userSha(name, adminToken, true) };
  } else if (name && !pass) {
    const token = await signToken(name);
    ctx.body = { token, name, sha: userSha(name, token) };
  } else {
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized' };
  }
}

async function forget(ctx) {
  const sha = ctx.state.user && ctx.state.user.sha;
  if (sha) {
    const books = await db.forgetUser(sha);
    for (const book of books) {
      io.emit('dispatch', { type: ADD_BOOK, book, origin: sha });
    }
    ctx.status = 200;
    ctx.body = { message: 'Ok' };
  } else {
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized' };
  }
}

async function reserve(ctx) {
  if (!(ctx.state.user && ctx.state.user.name)) {
    ctx.status = 401;
    ctx.body = { message: 'User not recognized' };
    ctx.set('WWW-Authenticate', 'Bearer');
    return;
  }
  if (!ctx.params.isbn) {
    ctx.status = 400;
    ctx.body = { message: 'No ISBN given' };
    return;
  }
  await db.reserveBook(ctx.params.isbn, ctx.state.user.name, ctx.state.user.sha);
  io.emit('dispatch', { type: HIDE_BOOK, isbn: ctx.params.isbn, origin: ctx.state.user.sha });
  ctx.status = 200;
  ctx.body = { name: ctx.state.user.name };
}

async function decline(ctx) {
  if (!(ctx.state.user && ctx.state.user.name)) {
    ctx.status = 401;
    ctx.body = { message: 'User not recognized' };
    ctx.set('WWW-Authenticate', 'Bearer');
    return;
  }
  if (!ctx.params.isbn) {
    ctx.status = 400;
    ctx.body = { message: 'No ISBN given' };
    return;
  }
  const book = await db.declineBook(ctx.params.isbn, ctx.state.user.name, ctx.state.user.sha, ctx.state.user.admin);
  io.emit('dispatch', { type: ADD_BOOK, book, origin: ctx.state.user.sha });
  ctx.status = 200;
  ctx.body = { message: 'Ok' };
}


async function deleteBooks(ctx) {
  if (!(ctx.state.user && ctx.state.user.admin)) {
    ctx.status = 403;
    ctx.body = { message: 'Forbidden' };
    return;
  }
  if (!ctx.params.sha) {
    ctx.status = 400;
    ctx.body = { message: 'No reserver SHA given' };
    return;
  }
  await db.deleteByReserver(ctx.params.sha);
  ctx.status = 200;
  ctx.body = { message: 'Ok' };
}


function userSha(name, token, admin) {
  const input = admin ? name : `${token}:${name}`;
  return crypto.createHash('sha1')
    .update(NAME_SECRET, 'utf8')
    .update(input, 'utf8')
    .digest('hex');
}

function signToken(name, admin) {
  const payload = admin ? { admin: true, name: name } : { name: name };
  const options = admin ? { expiresIn: ADMIN_TOKEN_EXPIRATION } : {};
  return new Promise((resolve, reject) => {
    jwt.sign(payload, APP_SECRET, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, APP_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

function upload(name, mimeType, resolve, reject) {
  const pass = new stream.PassThrough();
  const params = { Bucket: BUCKET, ACL: 'public-read' };
  const s3 = new AWS.S3({ params, region: BUCKET_REGION });
  s3.upload({ Body: pass, Key: name, ContentType: mimeType }, (err, result) => {
    if (err) {
      return reject(err);
    }
    resolve(result);
  });
  return pass;
}

server.listen(PORT);
server.on('listening', () => console.log(`Listening on port ${PORT}`));
