import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import books from './books';

export default (history) => combineReducers({
  router: connectRouter(history),
  books
});