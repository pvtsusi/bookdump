const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const onerror = require('koa-onerror');
const router = require('koa-router')();
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const redis = require('redis').createClient();

const PORT = 5000;
const REDIS_DB = 1;
const BOOKS_HASH = 'books';

const app = new Koa();
onerror(app);
app.use(json({}));
app.use(cors());
app.use(bodyParser({detectJSON: () => true}));

const socketService = socket => {

  const _poke = async data => {
    socket.emit('kickback', 'yow!');
  };
  console.log('Socket connection started!');
  socket.on('poke', _poke);

  router.get('/books', list)
    .post('/book', create);

  app.use(router.routes());

  async function list (ctx) {
    ctx.body = await db(retrieveBooks);
  }

  async function create (ctx) {
    const book = ctx.request.body;
    db(storeBook, book);
    socket.broadcast.emit('kickback', book);
    ctx.redirect('/');
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
      redis.hvals(BOOKS_HASH, (error, books) => {
        if (error) {
          return reject({message: error});
        }
        resolve(books.map(JSON.parse));
      });
    });
  }

  function storeBook (book) {
    return new Promise((resolve, reject) => {
      redis.hset(BOOKS_HASH, book.isbn, JSON.stringify(book), (error) => {
        if (error) {
          return reject({message: error});
        }
      })
    });
  }
};

const server = http.createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', socketService);

server.listen(PORT);
server.on('listening', () => console.log(`Listening on port ${PORT}`));
