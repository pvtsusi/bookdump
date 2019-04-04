import superagent from 'superagent';

const responseBody = res => res.body;

const requests = {
  get: url => superagent.get(url).then(responseBody),
  post: (url, body) => superagent.post(url, body).then(responseBody),
  patch: (url, body) => superagent.patch(url, body).then(responseBody)
};

const Books = {
  all: () => requests.get('/api/books'),
  update: (isbn, field, value) => requests.patch(`/api/book/${isbn}`, {[field]: value})
};

const Session = {
  login: (name, pass) => requests.post('/api/login', {name, pass})
};

export default {
  Books,
  Session
};
