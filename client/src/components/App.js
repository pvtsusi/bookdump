import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Books from './Books';

import * as Actions from '../actions';
import openSocket from 'socket.io-client';

import { kickback } from '../actions';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = openSocket('http://localhost:5000');
    this.socket.on(Actions.KICKBACK, data => {
      console.log(data);
      kickback(data);
    });
  }

  componentDidMount() {
    // Accessible because we 'connected'
    this.props.doPoke({ socket: this.socket });
  }

  render() {
    return (
      <ConnectedRouter history={this.props.history} >
        <Switch>
          <Route exact path="/" component={Books} />
        </Switch>
      </ConnectedRouter>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default connect(state => state, { doPoke: Actions.doPoke })(App);