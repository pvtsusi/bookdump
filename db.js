import fs from 'fs';
import path from 'path';
import Redis from 'redis';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REDIS_DB = 1;
const BOOK_PREFIX = 'isbn:';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = Redis.createClient(redisUrl);
const selectedDb = selectDb();

function selectDb() {
  return new Promise((resolve, reject) => {
    redis.select(REDIS_DB, (error) => {
      if (error) {
        return reject({ message: error });
      }
      resolve();
    });
  });
}

const loadScript = (script) => selectedDb.then(() =>
  new Promise((resolve, reject) => {
    redis.script('load', script, (error, digest) => {
      if (error) {
        return reject({ message: error });
      }
      resolve(digest);
    });
  }));

const scripts = {
  getAll: null,
  reserve: null,
  decline: null,
  forget: null,
  delete: null
};
for (const scriptName of Object.keys(scripts)) {
  const script = fs.readFileSync(`${__dirname}/redis/${scriptName}.lua`).toString();
  scripts[scriptName] = loadScript(script);
}

export default {
  retrieveBooks: (sha, allNames) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
        scripts.getAll.then(digest => {
          redis.evalsha(digest, 2, sha || '', (!!allNames).toString(), (error, books) => {
            if (error) {
              return reject({ message: error });
            }
            resolve(books.map(JSON.parse));
          });
        }).catch(error => {
          reject({ message: error });
        });
      }
    )),

  retrieveBook: (isbn) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
      redis.get(`${BOOK_PREFIX}${isbn}`, (error, book) => {
        if (error) {
          return reject({ message: error, status: 404 });
        }
        resolve(JSON.parse(book));
      });
    })),

  storeBook: (book) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
      redis.set(`${BOOK_PREFIX}${book.isbn}`, JSON.stringify(book), (error) => {
        if (error) {
          return reject({ message: error });
        }
        resolve();
      });
    })),

  reserveBook: (isbn, name, sha) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
      scripts.reserve.then(digest => {
        redis.evalsha(digest, 3, isbn, sha, name, (error) => {
          if (error) {
            return reject({ message: error });
          }
          resolve();
        });
      }).catch(error => {
        reject({ message: error });
      });
    })),

  declineBook: (isbn, name, sha, override) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
      scripts.decline.then(digest => {
        redis.evalsha(digest, 4, isbn, sha, name, (!!override).toString(), (error, book) => {
          if (error) {
            return reject({ message: error });
          }
          resolve(JSON.parse(book));
        });
      }).catch(error => {
        reject({ message: error });
      });
    })),

  forgetUser: (sha) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
      scripts.forget.then(digest => {
        redis.evalsha(digest, 1, sha, (error, books) => {
          if (error) {
            return reject({ message: error });
          }
          resolve(books.map(JSON.parse));
        });
      }).catch(error => {
        reject({ message: error });
      });
    })),

  deleteByReserver: (sha) => selectedDb.then(() =>
    new Promise((resolve, reject) => {
      scripts.delete.then(digest => {
        redis.evalsha(digest, 1, sha, (error) => {
          if (error) {
            return reject({ message: error });
          }
          resolve();
        });
      }).catch(error => {
        reject({ message: error });
      });
    }))
};

