import { sessionService } from 'redux-react-session';
import agent from '../agent';
import { declineBook, getBooks, reserveBook } from '../books';
import { startLoading, endLoading } from '../progress';
import { SHOW_SNACKBAR, SNACKBAR_ERROR, SNACKBAR_LOGGED_OUT } from '../reducers/snackbar';
import {
  CANCEL_LOGIN,
  CANCEL_LOGOUT,
  CLEAR_LOGIN_ERROR, LOG_IN,
  LOG_OUT,
  LOGGED_IN,
  LOGGED_OUT,
  LOGIN_ERROR
} from './sessionsConstants';

const { saveSession, saveUser, deleteUser, deleteSession } = sessionService;
export const startLoggingIn = (onSuccess, isbn) => dispatch => dispatch({ type: LOG_IN, onSuccess, isbn });
export const login = (loginName, loginPass, onSuccess, isbn) => async dispatch => {
  dispatch(startLoading());
  try {
    const response = await agent.Session.login(loginName, loginPass);
    const { token, name, sha, admin } = response;
    await saveSession({ token });
    await saveUser({ name, admin, sha });
    dispatch({ type: LOGGED_IN });
    if (onSuccess === 'reserve') {
      dispatch(reserveBook({isbn: isbn}));
    } else if (onSuccess === 'decline') {
      dispatch(declineBook({isbn: isbn}));
    }
  } catch (err) {
    if (err.status === 401) {
      dispatch({ type: LOGIN_ERROR, field: 'pass', message: 'Invalid password' });
    } else {
      dispatch({ type: LOGIN_ERROR, field: 'pass', message: 'Failed to log in' });
    }
  } finally {
    endLoading();
  }
};
export const cancelLogin = () => dispatch => dispatch({ type: CANCEL_LOGIN });
export const startLoggingOut = () => dispatch => dispatch({ type: LOG_OUT });
export const logout = (admin) => async dispatch => {
  startLoading();
  try {
    if (!admin) {
      await agent.Session.forget();
    }
    await deleteUser();
    await deleteSession();
    getBooks()(dispatch);
    dispatch({ type: SHOW_SNACKBAR, key: SNACKBAR_LOGGED_OUT, message: 'You have been logged out.' });
  } catch (err) {
    dispatch({ type: SHOW_SNACKBAR, key: SNACKBAR_ERROR, message: `Error: ${err.statusText}` });
  } finally {
    endLoading();
  }
};
export const cancelLogout = () => dispatch => dispatch({ type: CANCEL_LOGOUT });
export const loggedOut = () => dispatch => dispatch({ type: LOGGED_OUT });
export const setError = (field, message) => dispatch => dispatch({ type: LOGIN_ERROR, field, message });
export const clearErrors = () => dispatch => dispatch({ type: CLEAR_LOGIN_ERROR });