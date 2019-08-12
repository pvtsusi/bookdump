import cors from '@koa/cors';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import fs from 'fs';
import http from 'http';
import jwt from 'jsonwebtoken';
import Koa from 'koa';
import AsyncBusboy from 'koa-async-busboy';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
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
import {
  db,
  retrieveBook,
  retrieveBooks,
  storeBook,
  reserveBook,
  declineBook,
  forgetUser,
  deleteByReserver } from './db.js';
import searchFromAll from './library.js';
import { PATCH_BOOK, ADD_BOOK, HIDE_BOOK } from './client/src/reducers/sharedActions.mjs';

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
const { ADMIN_NAME, ADMIN_PASS, APP_SECRET, NAME_SECRET } = process.env;

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
  ctx.body = await db(retrieveBooks, sha, admin);
}

async function view(ctx) {
  ctx.body = await db(retrieveBook, ctx.params.isbn);
}

async function edit(ctx) {
  if (!(ctx.state.user && ctx.state.user.admin)) {
    ctx.status = 403;
    ctx.body = { message: 'Forbidden' };
    return;
  }
  const book = await db(retrieveBook, ctx.params.isbn);
  const patch = ctx.request.body;
  const patched = { ...book, ...patch };
  await db(storeBook, patched);
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
    promises.push(db(storeBook, book));
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

async function resizeAndUpload(fileStream, fileName, mimeType) {
  const resizer = sharp();
  const promises = [];
  for (const dim of [540, 270, 80, 40]) {
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
    const books = await forgetUser(sha);
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
  await reserveBook(ctx.params.isbn, ctx.state.user.name, ctx.state.user.sha);
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
  const book = await declineBook(ctx.params.isbn, ctx.state.user.name, ctx.state.user.sha, ctx.state.user.admin);
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
  await deleteByReserver(ctx.params.sha);
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

function resizedName(fileName, sizeSuffix) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  return `${base}_${sizeSuffix}${ext}`;
}

function upload(name, mimeType, resolve, reject) {
  const pass = new stream.PassThrough();
  const params = { Bucket: 'bookdump', ACL: 'public-read' };
  const s3 = new AWS.S3({ params, region: 'eu-north-1' });
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