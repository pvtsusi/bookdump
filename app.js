const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const onerror = require('koa-onerror');
const router = require('koa-router')();
const json = require('koa-json');
const staticFiles = require('koa-static');
const rp = require('request-promise-native');
const send = require('koa-send');
const AWS = require('aws-sdk');
const fs = require('fs');
const AsyncBusboy = require('koa-async-busboy');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = require('redis').createClient(redisUrl);

const PORT = process.env.PORT || 5000;
const REDIS_DB = 1;
const BOOK_PREFIX = 'isbn:';
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

const scripts = {
  getAll: null,
  reserve: null
};
const selectedDb = selectDb();
for (const scriptName of Object.keys(scripts)) {
  const script = fs.readFileSync(`${__dirname}/redis/${scriptName}.lua`).toString();
  scripts[scriptName] = db(loadScript, script);
}

const app = new Koa();
onerror(app);
app.use(json({}));
app.use(cors());
app.use(bodyParser());
app.use(staticFiles(`${__dirname}/client/build`));

let createBroadcast;

const socketService = socket => {
  const _poke = async data => {
    socket.emit('kickback', 'yow!');
  };
  socket.on('poke', _poke);
  createBroadcast = (book) => socket.broadcast.emit('kickback', book);

  socket.on('validate_session', async data => {
    try {
      await verifyToken(data.token);
      socket.emit('session_validated', {valid: true});
    } catch (err) {
      socket.emit('session_validated', {valid: false});
    }
  });
};

app.use(async (ctx, next) => {
  const token = parseToken(ctx);
  if (token) {
    try {
      ctx.state.user = await verifyToken(token);
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
  .post('/api/book/:isbn/reserve', reserve)
  .all('*', async (ctx) => {
    await send(ctx, 'client/build/index.html');
});

app.use(router.routes());

async function list (ctx) {
  const name = ctx.state.user && ctx.state.user.name;
  const sha = name ? userSha(name) : null;
  const admin = ctx.state.user && ctx.state.user.admin;
  ctx.body = await db(retrieveBooks, sha, admin);
}

async function view (ctx) {
  ctx.body = await db(retrieveBook, ctx.params.isbn);
}

async function edit (ctx) {
  if (!(ctx.state.user && ctx.state.user.admin)) {
    ctx.status = 403;
    ctx.body = {message: 'Forbidden'};
    return;
  }
  const book = await db(retrieveBook, ctx.params.isbn);
  const patch = ctx.request.body;
  const patched = {...book, ...patch};
  await db(storeBook, patched);
  ctx.set('Content-Location', `/api/book/${patched.isbn}`);
  ctx.status = 200;
  ctx.body = {message: 'Ok'};
}

async function search (ctx) {
  ctx.body = await searchFromAll(ctx.params.isbn);
}

async function create (ctx) {
  const busboy = new AsyncBusboy({
    headers: ctx.req.headers
  });
  let fileName, book;
  const promises = [];
  await busboy
    .onFile((fieldName, fileStream, filename, _, mimeType) => {
      if (fieldName === 'cover') {
        fileName = `${Math.round(Math.random() * 10000000)}_${filename}`;
        promises.push(upload(fileStream, fileName, mimeType));
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
      book.cover = `https://s3.eu-north-1.amazonaws.com/bookdump/${fileName}`
    }
    promises.push(db(storeBook, book));
    await Promise.all(promises);
    ctx.status = 201;
    ctx.set('Content-Location', `/book/${book.isbn}`);
    ctx.body = book
  } else {
    ctx.status = 400;
    ctx.body = {message: 'No book metadata'};
  }
}

async function login (ctx) {
  const { name, pass } = ctx.request.body;
  if (name === ADMIN_NAME && pass === ADMIN_PASS) {
    const token = await signAdminToken();
    ctx.status = 200;
    ctx.body = { token, name, admin: true };
  } else {
    ctx.status = 401;
    ctx.body = {message: 'Unauthorized'};
  }
}

async function reserve (ctx) {
  if (!(ctx.state.user && ctx.state.user.name)) {
    ctx.status = 401;
    ctx.body = {message: 'User not recognized'};
    ctx.set('WWW-Authenticate', 'Bearer');
    return;
  }
  if (!ctx.params.isbn) {
    ctx.status = 400;
    ctx.body = {message: 'No ISBN given'};
    return;
  }
  await reserveBook(ctx.params.isbn, ctx.state.user.name);
  ctx.status = 200;
  ctx.body = {name: ctx.state.user.name};
}

function userSha(name) {
  return crypto.createHash('sha1')
    .update(NAME_SECRET, 'utf8')
    .update(name, 'utf8')
    .digest('hex');
}

function signAdminToken () {
  return new Promise((resolve, reject) => {
    jwt.sign({admin: true, name: ADMIN_NAME}, APP_SECRET, {expiresIn: ADMIN_TOKEN_EXPIRATION}, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

function verifyToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, APP_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

function upload (stream, name, mimeType) {
  const params = {Bucket: 'bookdump', ACL: 'public-read'};
  const s3 = new AWS.S3({params, region: 'eu-north-1'});
  return s3.upload({Body: stream, Key: name, ContentType: mimeType}).promise();
}

function db (dbFunction, ...args) {
  return selectedDb.then(() => dbFunction(...args));
}

function selectDb () {
  return new Promise((resolve, reject) => {
    redis.select(REDIS_DB, (error) => {
      if (error) {
        return reject({message: error});
      }
      resolve();
    });
  });
}

function loadScript (script) {
  return new Promise((resolve, reject) => {
    redis.script('load', script, (error, digest) => {
      if (error) {
        return reject({message: error});
      }
      resolve(digest);
    });
  });
}

function retrieveBooks (sha, allNames) {
  return new Promise((resolve, reject) => {
    scripts.getAll.then(digest => {
      redis.evalsha(digest, 2, sha || '', (!!allNames).toString(), (error, books) => {
        if (error) {
          return reject({message: error});
        }
        resolve(books.map(JSON.parse));
      })
    }).catch(error => {
      reject({message: error});
    });
  });
}

function retrieveBook (isbn) {
  return new Promise((resolve, reject) => {
    redis.get(`${BOOK_PREFIX}${isbn}`, (error, book) => {
      if (error) {
        return reject({message: error, status: 404})
      }
      resolve(JSON.parse(book))
    });
  });
}

function storeBook (book) {
  return new Promise((resolve, reject) => {
    redis.set(`${BOOK_PREFIX}${book.isbn}`, JSON.stringify(book), (error) => {
      if (error) {
        return reject({message: error});
      }
      resolve()
    })
  });
}

function normalizeAuthor (book) {
  const match = book.author.match(/^([^,]+), *(.+)$/);
  if (match) {
    book.author = `${match[2]} ${match[1]}`;
  }
  return book;
}

function reserveBook (isbn, name) {
  const sha = userSha(name);
  return new Promise((resolve, reject) => {
    scripts.reserve.then(digest => {
      redis.evalsha(digest, 3, isbn, sha, name, (error) => {
        if (error) {
          return reject({message: error});
        }
        resolve();
      })
    }).catch(error => {
      reject({message: error});
    });
  });
}


async function searchFromAll (isbn) {
  return await Promise.all([findFinna(isbn), findOpenLibrary(isbn)]).then((allFound) => {
    return allFound.flat().filter(book => book.title && book.author).map(normalizeAuthor);
  });
}

function findFinna (isbn) {
  const opts = {
    uri: 'https://api.finna.fi/api/v1/search',
    qs: {
      lookfor: `cleanIsbn:${isbn}`,
      type: 'AllFields',
      field: ['languages', 'nonPresenterAuthors', 'title'],
      sort: 'relevance,id asc',
      page: 1,
      limit: 20,
      prettyPrint: 'true',
      lng: 'en'
    },
    headers: {
      Accept: 'application/json'
    },
    json: true
  };
  return rp(opts).then(results => {
    if (!results.records) {
      return [];
    }
    return results.records.map(record => ({
      language: record.languages && record.languages.length ? record.languages[0] : null,
      author: (record.nonPresenterAuthors &&
        record.nonPresenterAuthors.find(author =>
          (author.role && author.role.startsWith('kirjoittaja') || !author.role)) ||
        {name: null}).name,
      title: record.title
    }));
  }).catch((error) => {
    console.log(`Failed retrieval from Finna: ${error}`);
    return [];
  });
}

function findOpenLibrary (isbn) {
  const opts = {
    uri: 'https://openlibrary.org/api/books',
    qs: {
      bibkeys: `ISBN:${isbn}`,
      format: 'json',
      jscmd: 'details'
    },
    headers: {
      Accept: 'application/json'
    },
    json: true
  };
  return rp(opts).then(results => {
    if (!Object.values(results).length) {
      return [];
    }
    return Object.values(results).map(record => record.details).map(record => ({
      language: record.languages && record.languages.length ? record.languages[0].key.substr(11) : null,
      author: record.authors && record.authors.length ? record.authors[0].name : null,
      title: record.title
    }));
  });
}


const server = http.createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', socketService);

server.listen(PORT);
server.on('listening', () => console.log(`Listening on port ${PORT}`));
