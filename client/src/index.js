import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { sessionService } from 'redux-react-session';
import WebSocketManager from './components/WebSocketManager';
import configureStore from './configureStore';
import routes from './routes';
import * as serviceWorker from './serviceWorker';

const { initSessionService } = sessionService;

const store = configureStore();

initSessionService(store);

ReactDOM.render((
  <Provider store={store}>
    <WebSocketManager/>
    <BrowserRouter>
      {renderRoutes(routes)}
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
