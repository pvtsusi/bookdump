import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import books from './books';
import error from './error';
import progress from './progress';
import socket from './socket';
import user from './user';

export default (history) => combineReducers({
  router: connectRouter(history),
  books,
  socket,
  progress,
  user,
  error,
  session: sessionReducer
});