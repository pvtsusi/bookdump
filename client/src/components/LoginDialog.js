import React from 'react';
import { connect } from 'react-redux';
import {MuiThemeProvider, withStyles} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/es/DialogContent/DialogContent';
import themes from '../themes';
import TextField from '@material-ui/core/TextField/TextField';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogActions from '@material-ui/core/es/DialogActions/DialogActions';
import Button from './Button';
import {bindActionCreators} from 'redux';
import {login} from '../reducers/user';

const styles = theme => ({
  actions: {
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ user }) => ({
  loggingIn: user.loggingIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelLogin: () => dispatch => dispatch({ type: 'CANCEL_LOGIN' }),
      login: (user, onSuccess) => login(user, null, null, onSuccess)
    }, dispatch
  );


class LoginDialog extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: ''
    };
    this.onChange = event => this.setState({...this.state, name: event.target.value });
    this.classes = props.classes;
    this.onSubmit = (event) => {
      event.preventDefault();
      this.props.login(this.state.name, this.props.onSuccess);
    };
  }

  render() {
    return (
      <Dialog
        disableBackdropClick
        open={this.props.loggingIn}
        onClose={this.props.cancelLogin}>
        <form onSubmit={this.onSubmit} noValidate autoComplete="off">
          <MuiThemeProvider theme={themes.narrow}>
            <DialogTitle>
              Who are you?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Give me your name so that I know whom to give this to.
              </DialogContentText>
              <TextField
                error={null}
                id="name-input"
                label="Your name"
                onChange={this.onChange}
                className={this.classes.textField}
                margin="normal"
                fullWidth
                autoFocus
              />
            </DialogContent>
            <DialogActions className={this.classes.actions}>
              <Button onClick={this.props.cancelLogin}>
                Never mind
              </Button>
              <Button onClick={() => this.props.login(this.state.name, this.props.onSuccess)}>
                Submit
              </Button>
            </DialogActions>
          </MuiThemeProvider>
        </form>
      </Dialog>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoginDialog));
