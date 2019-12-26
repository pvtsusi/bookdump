import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import openSocket from 'socket.io-client';
import { isValidSession, SESSION_VALIDATED } from '../reducers/socket';
import { LOGGED_OUT, logout } from '../reducers/user';

const mapStateToProps = ({ session }) => ({
  admin: session.authenticated && session.user && session.user.admin,
  userSha: session.user && session.user.sha
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      isValidSession,
      sessionValidated: () => dispatch({ type: SESSION_VALIDATED }),
      loggedOut: () => dispatch({ type: LOGGED_OUT }),
      dispatchActionFromServer: (action) => dispatch(action),
      logout: logout
    }, dispatch
  );

class WebSocketManager extends React.Component {
  constructor(props) {
    super(props);

    this.socket = openSocket('/');

    this.socket.on('session_validated', data => {
      if (!data.valid) {
        this.props.logout(this.props.admin);
        this.props.loggedOut();
      }
      this.props.sessionValidated();
    });

    this.socket.on('dispatch', action => {
      if (!action.origin || !this.props.userSha || action.origin !== this.props.userSha) {
        this.props.dispatchActionFromServer(action);
      }
    });
  }

  componentDidMount() {
    setInterval(() => this.props.isValidSession({ socket: this.socket }), 5000);
  }

  render() {
    return (
      <React.Fragment/>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketManager);