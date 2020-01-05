import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

const middleware = applyMiddleware(thunk);

export default function configureStore(preloadedState) {
  return createStore(createRootReducer(history), preloadedState, compose(middleware));
}
