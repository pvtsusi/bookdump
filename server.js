const express = require('express');
const cors = require('cors');
const redis = require('redis').createClient();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 5000;
const REDIS_DB = 1;
const BOOKS_HASH = 'books';

const db = (cmd, ...args) => redis.select(REDIS_DB, (err) => {
  if (err) {
    throw err;
  }
  cmd.apply(redis, args)
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/books', (req, res) => {
  db(redis.hvals, BOOKS_HASH, (error, books) => {
    if (error) {
      return res.send({error});
    }
    res.send(books.map(JSON.parse));
  });
});

app.post('/book', (req, res) => {
  const book = req.body;
  db(redis.hset, BOOKS_HASH, book.isbn, JSON.stringify(book), (error) => {
    if (error) {
      return res.send({ error });
    }
    res.send({msg: 'ok'});
  });
});
