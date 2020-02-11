import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { sessionReducer as reduxReactSession } from 'redux-react-session';
import thunk from 'redux-thunk';
import books from './books/booksReducer';
import progress from './progress/progressReducer';
import sessions from './sessions/sessionsReducer';
import snackbar from './snackbar/snackbarReducer';
import socket from './socket/socketReducer';

const middleware = applyMiddleware(thunk);

const createRootReducer = () => combineReducers({
  books,
  socket,
  progress,
  user: sessions,
  snackbar,
  session: reduxReactSession
});

export default function configureStore(preloadedState) {
  return createStore(createRootReducer(), preloadedState, compose(middleware));
}
