import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import Books from './Books';


class App extends React.Component {
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

export default connect(() => ({}), () => ({}))(App);