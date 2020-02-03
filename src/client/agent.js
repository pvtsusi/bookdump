class ResponseError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ResponseError';
    this.status = status;
    this.message = this.statusText = message;
  }
}

const resBody = async res => {
  if (!res.ok) {
    throw new ResponseError(res.statusText, res.status);
  }
  return await res.json();
};

async function reqOpts(method, body = null) {
  const jsonBody = body ? { body: JSON.stringify(body) } : {};
  return {
    method,
    ...jsonBody,
    headers: {
      'Content-Type': 'application/json',
    }
  };
}

const requests = {
  get: url => reqOpts('GET').then(opts => fetch(url, opts)).then(resBody),
  post: (url, body) => reqOpts('POST', body).then(opts => fetch(url, opts)).then(resBody),
  patch: (url, body) => reqOpts('PATCH', body).then(opts => fetch(url, opts)).then(resBody),
  delete: (url) => reqOpts('DELETE').then(opts => fetch(url, opts)).then(resBody),
};

const Books = {
  all: () => requests.get('/api/books'),
  update: (isbn, field, value) => requests.patch(`/api/book/${isbn}`, { [field]: value }),
  reserve: (isbn) => requests.post(`/api/book/${isbn}/reserve`, {}),
  decline: (isbn) => requests.post(`/api/book/${isbn}/decline`, {}),
  delete: (reserver) => requests.delete(`/api/user/${reserver}/books`)
};

const Session = {
  login: (name, pass) => requests.post('/api/login', { name, pass }),
  forget: () => requests.post('/api/forget', {})
};

export default {
  Books,
  Session
};
