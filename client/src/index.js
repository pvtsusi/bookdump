import App from './components/App';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import { sessionService } from 'redux-react-session';
import configureStore, { history } from './configureStore';

import * as serviceWorker from './serviceWorker';

const store = configureStore();

sessionService.initSessionService(store);

ReactDOM.render((
  <Provider store={store}>
    <App history={history} />
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
