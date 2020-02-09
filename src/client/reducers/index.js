import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import books from '../books/booksReducer';
import progress from './progress';
import socket from './socket';
import snackbar from './snackbar';
import user from './user';

export default () => combineReducers({
  books,
  socket,
  progress,
  user,
  snackbar,
  session: sessionReducer
});