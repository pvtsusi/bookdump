import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { sessionService } from 'redux-react-session';
import App from './components/App';
import WebSocketManager from './components/WebSocketManager';
import configureStore from './configureStore';
import * as serviceWorker from './serviceWorker';

const { initSessionService } = sessionService;

const store = configureStore();

initSessionService(store);

ReactDOM.render((
  <Provider store={store}>
    <WebSocketManager/>
    <App/>
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
