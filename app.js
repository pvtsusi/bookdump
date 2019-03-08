const Koa = require('koa');
const cors = require('@koa/cors');
const onerror = require('koa-onerror');
const router = require('koa-router')();
const json = require('koa-json');
const redis = require('redis').createClient();

const REDIS_DB = 1;
const BOOKS_HASH = 'books';

const app = new Koa();
onerror(app);
app.use(json());
app.use(cors());

router.get('/books', list)
  .post('/book', create);

app.use(router.routes());

async function list(ctx) {
  ctx.body = await db(retrieveBooks);
}

async function create(ctx) {
  ctx.redirect('/');
}

function db(dbFunction) {
  return selectDb().then(dbFunction);
}

function selectDb() {
  return new Promise((resolve, reject) => {
    redis.select(REDIS_DB, (error) => {
      if (error) {
        return reject({message: error});
      }
      resolve();
    });
  });
}

function retrieveBooks() {
  return new Promise((resolve, reject) => {
    redis.hvals(BOOKS_HASH, (error, books) => {
      if (error) {
        return reject({message: error});
      }
      resolve(books.map(JSON.parse));
    });
  });
}

module.exports = app;
