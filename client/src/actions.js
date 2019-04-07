import { sessionService } from 'redux-react-session';
import agent from './agent';

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

export const login = (loginName, loginPass, history) => async dispatch => {
  dispatch({ type: 'LOADING' });
  try {
    const response = await agent.Session.login(loginName, loginPass);
    const { token, name, admin } = response;
    await sessionService.saveSession({ token });
    await sessionService.saveUser({ name, admin });
    history.push('/');
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