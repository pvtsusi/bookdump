import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import books from './books';
import progress from './progress';
import socket from './socket';
import snackbar from './snackbar';
import user from './user';

export default (history) => combineReducers({
  router: connectRouter(history),
  books,
  socket,
  progress,
  user,
  snackbar,
  session: sessionReducer
});