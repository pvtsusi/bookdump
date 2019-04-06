const resBody = async res => await res.json();
const reqBody = (method, body) => ({method, body: JSON.stringify(body), headers: {'Content-Type': 'application/json'}});

const requests = {
  get: url => fetch(url).then(resBody),
  post: (url, body) => fetch(url, reqBody('POST', body)).then(resBody),
  patch: (url, body) => fetch(url, reqBody('PATCH', body)).then(resBody)
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
