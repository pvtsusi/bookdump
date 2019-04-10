import { sessionService } from 'redux-react-session';

async function sessionToken() {
  try {
    const session = await sessionService.loadSession();
    return session.token;
  } catch {
    return null;
  }
}

class ResponseError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.statusText = message;
  }
}

const resBody = async res => {
  if (!res.ok) {
    throw new ResponseError(res.statusText, res.status);
  }
  return await res.json();
};

async function reqOpts(method, body = null) {
  const token = await sessionToken();
  const auth = token ? {Authorization: `Bearer ${token}`} : {};
  const jsonBody = body ? {body: JSON.stringify(body)} : {}
  return {
    method,
    ...jsonBody,
    headers: {
      'Content-Type': 'application/json',
      ...auth
    }
  };
}

const requests = {
  get: url => reqOpts('GET').then(opts => fetch(url, opts)).then(resBody),
  post: (url, body) => reqOpts('POST', body).then(opts => fetch(url, opts)).then(resBody),
  patch: (url, body) => reqOpts('PATCH', body).then(opts => fetch(url, opts)).then(resBody)
};

const Books = {
  all: () => requests.get('/api/books'),
  update: (isbn, field, value) => requests.patch(`/api/book/${isbn}`, {[field]: value}),
  reserve: (isbn) => requests.post(`/api/book/${isbn}/reserve`, {}),
  decline: (isbn) => requests.post(`/api/book/${isbn}/decline`, {})
};

const Session = {
  login: (name, pass) => requests.post('/api/login', {name, pass})
};

export default {
  Books,
  Session
};
