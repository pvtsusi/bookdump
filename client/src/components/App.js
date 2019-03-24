import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Books from './Books';

import * as Actions from '../actions';
import openSocket from 'socket.io-client';

import { kickback } from '../actions';

import CssBaseline from '@material-ui/core/CssBaseline';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    width: '100%',
    maxWidth: 500,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = openSocket('/');
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
      <React.Fragment>
        <CssBaseline />
        <Typography variant="body1">
          <ConnectedRouter history={this.props.history} >
            <Switch>
              <Route exact path="/" component={Books} />
            </Switch>
          </ConnectedRouter>
        </Typography>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default withStyles(styles)(connect(state => state, { doPoke: Actions.doPoke })(App));