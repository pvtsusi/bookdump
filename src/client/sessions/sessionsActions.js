import { sessionService } from 'redux-react-session';
import agent from '../agent';
import { getBooks } from '../books';
import { LOADED, LOADING } from '../reducers/progress';
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
export const startLoggingIn = () => dispatch => dispatch({ type: LOG_IN });
export const login = (loginName, loginPass, onSuccess) => async dispatch => {
  dispatch({ type: LOADING });
  try {
    const response = await agent.Session.login(loginName, loginPass);
    const { token, name, sha, admin } = response;
    await saveSession({ token });
    await saveUser({ name, admin, sha });
    dispatch({ type: LOGGED_IN });
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
export const cancelLogin = () => dispatch => dispatch({ type: CANCEL_LOGIN });
export const startLoggingOut = () => dispatch => dispatch({ type: LOG_OUT });
export const logout = (admin) => async dispatch => {
  dispatch({ type: LOADING });
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
    dispatch({ type: LOADED });
  }
};
export const cancelLogout = () => dispatch => dispatch({ type: CANCEL_LOGOUT });
export const loggedOut = () => dispatch => dispatch({ type: LOGGED_OUT });
export const setError = (field, message) => dispatch => dispatch({ type: LOGIN_ERROR, field, message });
export const clearErrors = () => dispatch => dispatch({ type: CLEAR_LOGIN_ERROR });