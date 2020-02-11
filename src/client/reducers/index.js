import { combineReducers } from 'redux';
import { sessionReducer as reduxReactSession } from 'redux-react-session';
import books from '../books/booksReducer';
import progress from '../progress/progressReducer';
import socket from '../socket/socketReducer';
import snackbar from './snackbar';
import sessions from '../sessions/sessionsReducer';

export default () => combineReducers({
  books,
  socket,
  progress,
  user: sessions,
  snackbar,
  session: reduxReactSession
});