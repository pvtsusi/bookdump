import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import common from './common';
import books from './books';

export default (history) => combineReducers({
  router: connectRouter(history),
  common,
  books
});