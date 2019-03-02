import agent from '../agent';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { push } from 'connected-react-router';
// import { store } from '../store';
import Books from './Books';

const mapStateToProps = state => ({
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo
});

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: 'APP_LOAD', payload, token }),
  onRedirect: () =>
    dispatch({ type: 'REDIRECT' })
});

class App extends React.Component {
  componentWillMount () {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }
    // this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      // store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(App);