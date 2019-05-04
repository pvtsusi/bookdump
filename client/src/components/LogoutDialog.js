import { MuiThemeProvider, withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CANCEL_LOGOUT, logout } from '../reducers/user';
import themes from '../themes';
import Button from './Button';

const styles = theme => ({
  actions: {
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ user, session }) => ({
  loggingOut: user.loggingOut,
  admin: session.authenticated && session.user && session.user.admin
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelLoggingOut: () => dispatch => dispatch({ type: CANCEL_LOGOUT }),
      logout
    }, dispatch
  );


class LogoutDialog extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <Dialog
        open={this.props.loggingOut}
        onClose={this.props.cancelLoggingOut}>
        <MuiThemeProvider theme={themes.narrow}>
          <DialogTitle>
            Are you sure you want to sign out?
          </DialogTitle>
          {!this.props.admin &&
          <DialogContent>
            <DialogContentText>
              If you sign out, I will forget you and all about you.
            </DialogContentText>
          </DialogContent>
          }
          <DialogActions className={this.classes.actions}>
            <Button onClick={this.props.cancelLoggingOut}>
              Never mind
            </Button>
            <Button variant="contained" color="secondary" onClick={() => this.props.logout(this.props.admin)}>
              Yes, do that
            </Button>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LogoutDialog));
