import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { sessionReducer } from 'redux-react-session';
import books from './books';
import socket from './socket';
import progress from './progress';
import user from './user';
import error from './error';

export default (history) => combineReducers({
  router: connectRouter(history),
  books,
  socket,
  progress,
  user,
  error,
  session: sessionReducer
});