import { MuiThemeProvider, withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField/TextField';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CANCEL_LOGIN, CLEAR_LOGIN_ERROR, LOGIN_ERROR, login } from '../../reducers/user';
import themes from '../../themes';
import Button from '../Button';

const styles = theme => ({
  actions: {
    paddingRight: theme.spacing.unit * 2
  }
});

const mapStateToProps = ({ user }) => ({
  loggingIn: user.loggingIn,
  errors: user.errors
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelLogin: () => dispatch => dispatch({ type: CANCEL_LOGIN }),
      login: (user, onSuccess) => login(user, null, null, onSuccess),
      setError: (field, message) => dispatch({ type: LOGIN_ERROR, field, message }),
      clearErrors: () => dispatch => dispatch({ type: CLEAR_LOGIN_ERROR })
    }, dispatch
  );

class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {
      name: ''
    };

    this.onChange = event => {
      this.props.clearErrors();
      this.setState({ name: event.target.value });
    };

    this.onSubmit = (event) => {
      event.preventDefault();
      if (!this.state.name) {
        return this.props.setError('name', 'Don\'t leave this empty');
      }
      this.props.login(this.state.name, this.props.onSuccess);
    };
  }

  render() {
    const { errors } = this.props;
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
                error={!!(errors && errors.name)}
                id="name-input"
                label="Your name"
                onChange={this.onChange}
                helperText={errors && errors.name}
                className={this.classes.textField}
                margin="none"
                autoComplete="name"
                fullWidth
                autoFocus/>
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
