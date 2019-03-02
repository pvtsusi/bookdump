import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import {localStorageMiddleware, promiseMiddleware} from './middleware';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

const middleware = applyMiddleware(routerMiddleware(history), promiseMiddleware, localStorageMiddleware);

export default function configureStore(preloadedState) {
  return createStore(createRootReducer(history), preloadedState, compose(middleware));
}
