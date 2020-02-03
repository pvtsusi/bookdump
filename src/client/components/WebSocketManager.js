import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import openSocket from 'socket.io-client';
import { isValidSession, sessionValidated } from '../reducers/socket';
import { loggedOut, logout } from '../reducers/user';

const mapStateToProps = ({ session }) => ({
  admin: session.authenticated && session.user && session.user.admin,
  userSha: session.user && session.user.sha
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      isValidSession,
      sessionValidated,
      loggedOut,
      dispatchActionFromServer: (action) => dispatch(action),
      logout
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