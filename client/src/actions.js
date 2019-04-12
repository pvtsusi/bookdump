import { sessionService } from 'redux-react-session';
import agent from './agent';
import {getBooks} from './reducers/books';

export const POKE = 'poke';
export const KICKBACK = 'kickback';

export const poke = () => ({
  type: POKE
});

export const kickback = data => {
  return {
    type: KICKBACK,
    data
  };
};

export const doPoke = options => async dispatch => {
  dispatch(poke());

  const { socket } = options;
  delete options.socket;

  // Error handling...
  socket.emit(POKE, options);
};

export const login = (loginName, loginPass, history, onSuccess) => async dispatch => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await agent.Session.login(loginName, loginPass);
    const { token, name, admin } = response;
    await sessionService.saveSession({ token });
    await sessionService.saveUser({ name, admin });
    if (admin && history) {
      history.push('/');
    } else {
      dispatch({type: 'LOGGED_IN'});
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (err.status === 401) {
      dispatch({type: 'LOGIN_ERROR', field: 'pass', message: 'Invalid password'});
    } else {
      dispatch({type: 'LOGIN_ERROR', field: 'pass', message: 'Failed to log in'});
    }
  } finally {
    dispatch({type: 'LOADED'});
  }
};

export const logout = () => async dispatch => {
  await agent.Session.forget();
  await sessionService.deleteUser();
  await sessionService.deleteSession();
  getBooks()(dispatch);
  dispatch({type: 'LOGGED_OUT'});
};