import { sessionService } from 'redux-react-session';

async function sessionToken() {
  try {
    const session = await sessionService.loadSession();
    return session.token;
  } catch {
    return null;
  }
}

const resBody = async res => await res.json();
async function reqBody(method, body) {
  const token = await sessionToken();
  const auth = token ? {Authorization: `Bearer ${token}`} : {};
  return {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...auth
    }
  };
}

const requests = {
  get: url => fetch(url).then(resBody),
  post: (url, body) => reqBody('POST', body).then(opts => fetch(url, opts)).then(resBody),
  patch: (url, body) => reqBody('PATCH', body).then(opts => fetch(url, opts)).then(resBody)
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
