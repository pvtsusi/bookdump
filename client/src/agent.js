import superagent from 'superagent';

const API_ROOT = 'http://localhost:5000';

const responseBody = res => res.body;

const requests = {
  get: url =>
    superagent.get(`${API_ROOT}${url}`).then(responseBody)
};

const Books = {
  all: () =>
    requests.get(`/books`)
};

export default {
  Books
};
