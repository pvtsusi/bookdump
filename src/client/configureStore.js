import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';

const middleware = applyMiddleware(thunk);

export default function configureStore(preloadedState) {
  return createStore(createRootReducer(), preloadedState, compose(middleware));
}
