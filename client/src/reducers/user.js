import { sessionService } from 'redux-react-session';
import agent from '../agent';
import { getBooks } from './books';
import { SHOW_ERROR } from './error';
import { LOADED, LOADING } from './progress';

const { saveSession, saveUser, deleteUser, deleteSession } = sessionService;

export const LOG_IN = 'LOG_IN';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const CLEAR_LOGIN_ERROR = 'CLEAR_LOGIN_ERROR';
export const CONFIRM_LOGGED_OUT = 'CONFIRM_LOGGED_OUT';
export const CANCEL_LOGOUT = 'CANCEL_LOGOUT';
export const LOG_OUT = 'LOG_OUT';
export const LOGGED_OUT = 'LOGGED_OUT';
export const CANCEL_LOGIN = 'CANCEL_LOGIN';
const LOGGED_IN = 'LOGGED_IN';

const initialState = {
  errors: {},
  loggingOut: false,
  loggedOut: false,
  loggingIn: false,
  onSuccess: null,
  isbn: null
};

export default (state = initialState, action) => {
  const { field, message } = action;
  switch (action.type) {
    case LOG_IN:
      return { ...state, loggingIn: true };
    case LOGIN_ERROR:
      const newErrors = { ...state.errors, [field]: message };
      return { ...state, errors: newErrors };
    case CLEAR_LOGIN_ERROR:
      return { ...state, errors: {} };
    case LOG_OUT:
      return { ...state, loggingOut: true };
    case CANCEL_LOGOUT:
      return { ...state, loggingOut: false };
    case LOGGED_OUT:
      return { ...state, loggingOut: false, loggedOut: true };
    case CONFIRM_LOGGED_OUT:
      return { ...state, loggedOut: false };
    case CANCEL_LOGIN:
      return { ...state, loggingIn: false };
    case LOGGED_IN:
      return { ...state, loggingIn: false };
    default:
      return state;
  }
}

export const login = (loginName, loginPass, history, onSuccess) => async dispatch => {
  dispatch({ type: LOADING });
  try {
    const response = await agent.Session.login(loginName, loginPass);
    const { token, name, sha, admin } = response;
    await saveSession({ token });
    await saveUser({ name, admin, sha });
    if (admin && history) {
      history.push('/');
    } else {
      dispatch({ type: LOGGED_IN });
    }
    if (onSuccess) {
      onSuccess();
    }
  } catch (err) {
    if (err.status === 401) {
      dispatch({ type: LOGIN_ERROR, field: 'pass', message: 'Invalid password' });
    } else {
      dispatch({ type: LOGIN_ERROR, field: 'pass', message: 'Failed to log in' });
    }
  } finally {
    dispatch({ type: LOADED });
  }
};

export const logout = (admin) => async dispatch => {
  dispatch({ type: LOADING });
  try {
    if (!admin) {
      await agent.Session.forget();
    }
    await deleteUser();
    await deleteSession();
    getBooks()(dispatch);
    dispatch({ type: LOGGED_OUT });
  } catch (err) {
    dispatch({ type: SHOW_ERROR, error: err.statusText });
  } finally {
    dispatch({ type: LOADED });
  }
};
