const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const onerror = require('koa-onerror');
const router = require('koa-router')();
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const rp = require('request-promise-native');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const redis = require('redis').createClient(redisUrl);

const PORT = process.env.PORT || 5000;
const REDIS_DB = 1;
const BOOK_PREFIX = 'isbn:';

const app = new Koa();
onerror(app);
app.use(json({}));
app.use(cors());
app.use(bodyParser({detectJSON: () => true}));

let createBroadcast;

const socketService = socket => {
  const _poke = async data => {
    socket.emit('kickback', 'yow!');
  };
  console.log('Socket connection started!');
  socket.on('poke', _poke);
  createBroadcast = (book) => socket.broadcast.emit('kickback', book);
};

router.get('/books', list)
  .get('/book/:isbn', view)
  .post('/book', create);

app.use(router.routes());

async function list (ctx) {
  ctx.body = await db(retrieveBooks);
}

async function view (ctx) {
  ctx.body = await db(retrieveBook, ctx.params.isbn);
}

async function create (ctx) {
  const book = ctx.request.body;
  db(storeBook, book);
  if (createBroadcast) {
    createBroadcast(book);
  }
  ctx.status = 201;
  ctx.set('Location', `/book/${book.isbn}`);
  ctx.body = book
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
    return results.records.map(record => ({
      language: record.languages && record.languages.length ? record.languages[0] : null,
      author: (record.nonPresenterAuthors &&
        record.nonPresenterAuthors.find(author => author.role.startsWith('kirjoittaja')) ||
        {name: null}).name,
      title: record.title
    }));
  });
}


const server = http.createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', socketService);

server.listen(PORT);
server.on('listening', () => console.log(`Listening on port ${PORT}`));
