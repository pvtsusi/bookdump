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
const webToken = require('jsonwebtoken');
const jwt = require('koa-jwt');

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
  'APP_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} environment variable is not set`);
    process.exit(1);
  }
}
const { ADMIN_NAME, ADMIN_PASS, APP_SECRET } = process.env;

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
  console.log('Socket connection started!');
  socket.on('poke', _poke);
  createBroadcast = (book) => socket.broadcast.emit('kickback', book);
};

app.use(jwt({ secret: APP_SECRET, passthrough: true }));

router.get('/api/books', list)
  .get('/api/book/:isbn', view)
  .patch('/api/book/:isbn', edit)
  .post('/api/book', create)
  .get('/api/search/:isbn', search)
  .post('/api/login', login)
  .all('*', async (ctx) => {
    await send(ctx, 'client/build/index.html');
});

app.use(router.routes());

async function list (ctx) {
  ctx.body = await db(retrieveBooks);
}

async function view (ctx) {
  ctx.body = await db(retrieveBook, ctx.params.isbn);
}

async function edit (ctx) {
  if (!(ctx.state.user && ctx.state.user.admin)) {
    ctx.status = 401;
    ctx.body = {message: 'Unauthorized'};
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
    ctx.body = 'Unauthorized';
  }
}

function signAdminToken () {
  return new Promise((resolve, reject) => {
    webToken.sign({admin: true}, APP_SECRET, {expiresIn: ADMIN_TOKEN_EXPIRATION}, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

function upload (stream, name, mimeType) {
  const params = {Bucket: 'bookdump', ACL: 'public-read'};
  const s3 = new AWS.S3({params, region: 'eu-north-1'});
  return s3.upload({Body: stream, Key: name, ContentType: mimeType}).promise();
}


function db (dbFunction, arg) {
  return selectDb().then(() => dbFunction(arg));
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

function retrieveBooks () {
  return new Promise((resolve, reject) => {
    redis.keys(`${BOOK_PREFIX}*`, (error, keys) => {
      if (error) {
        return reject({message: error});
      }
      redis.mget(keys, (error, books) => {
        if (error) {
          return reject({message: error})
        }
        resolve(books.map(JSON.parse));
      });
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
