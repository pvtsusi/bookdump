import React from 'react';
import { connect } from 'react-redux';
import {MuiThemeProvider, withStyles} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import themes from '../themes';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import Button from './Button';
import {bindActionCreators} from 'redux';
import {logout} from '../actions';

const styles = theme => ({
  actions: {
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ user }) => ({
  loggingOut: user.loggingOut
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelLoggingOut: () => dispatch => dispatch({type: 'CANCEL_LOGOUT'}),
      logout
    }, dispatch
  );


class LogoutDialog extends React.Component {
  constructor (props) {
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
          <DialogContent>
            <DialogContentText>
              If you sign out, I will forget you and all about you.
            </DialogContentText>
          </DialogContent>
          <DialogActions className={this.classes.actions}>
            <Button onClick={this.props.cancelLoggingOut}>
              Never mind
            </Button>
            <Button variant="contained" color="secondary" onClick={this.props.logout}>
              Yes, do that
            </Button>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LogoutDialog));
