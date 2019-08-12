import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import AdminIcon from '@material-ui/icons/Assignment';
import HomeIcon from '@material-ui/icons/Home';
import { push } from 'connected-react-router';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const styles = theme => ({
  actions: {
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ session, router }) => ({
  path: router.location.pathname,
  admin: session.authenticated && session.user && session.user.admin
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    goToAdmin: () => () => dispatch(push('/admin')),
    goToHome: () => () => dispatch(push('/'))
  }, dispatch);

class AdminNavigation extends React.Component {
  render() {
    if (!this.props.admin) {
      return null;
    }
    if (this.props.path === '/admin') {
      return (
        <IconButton onClick={this.props.goToHome}>
          <HomeIcon fontSize="large"/>
        </IconButton>
      );
    } else {
      return (
        <IconButton onClick={this.props.goToAdmin}>
          <AdminIcon fontSize="large"/>
        </IconButton>
      );
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AdminNavigation));
