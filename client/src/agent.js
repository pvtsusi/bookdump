import superagent from 'superagent';

const responseBody = res => res.body;

const requests = {
  get: url =>
    superagent.get(url).then(responseBody)
};

const Books = {
  all: () =>
    requests.get('/api/books')
};

export default {
  Books
};
