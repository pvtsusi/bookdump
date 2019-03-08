import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import thunk from 'redux-thunk'

export const history = createBrowserHistory();

const middleware = applyMiddleware(thunk, routerMiddleware(history));

export default function configureStore(preloadedState) {
  return createStore(createRootReducer(history), preloadedState, compose(middleware));
}
