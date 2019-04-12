import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withStyles, MuiThemeProvider} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography/Typography";
import { login } from '../actions';
import themes from '../themes';


const styles = theme => ({
  textField: {
    width: '80%'
  }
});

const mapStateToProps = ({ user, progress }) => ({
  errors: user.errors,
  loading: progress.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    login,
    setError: (field, message) => dispatch({ type: 'LOGIN_ERROR', field, message}),
    clearErrors: () => dispatch => dispatch({ type: 'CLEAR_LOGIN_ERROR'})
  }, dispatch);


class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: ''
    };
    this.onChangeName = event => {
      this.props.clearErrors();
      this.setState({ name: event.target.value});
    };
    this.onChangePass = event => {
      this.props.clearErrors();
      this.setState({ pass: event.target.value});
    };
    this.onSubmit = event => {
      event.preventDefault();
      const { name, pass } = this.state;
      if (!name) {
        return this.props.setError('name', 'Name cannot be empty');
      }
      if (!pass) {
        return this.props.setError('pass', 'Password cannot be empty');
      }
      this.props.login(name, pass, this.props.history);
    };
  }

  render () {
    const { classes, errors } = this.props;

    return (
      <MuiThemeProvider theme={themes.narrow}>
        <form onSubmit={this.onSubmit} noValidate autoComplete="off">
          <Grid container spacing={16}>
            <Grid item sm={12}>
              <Typography component="h5" variant="h5">
                Log in as admin
              </Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                error={!!(errors && errors.name)}
                id="admin-name-input"
                label="Name"
                onChange={this.onChangeName}
                className={classes.textField}
                margin="normal"
                variant="outlined"
                helperText={errors && errors.name}
                disabled={this.props.loading}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                error={!!(errors && errors.pass)}
                id="admin-password-input"
                label="Password"
                onChange={this.onChangePass}
                className={classes.textField}
                type="password"
                margin="normal"
                variant="outlined"
                helperText={errors && errors.pass}
                disabled={this.props.loading}
              />
            </Grid>
          </Grid>
          <input type="submit" style={{display: 'none'}} />
        </form>
      </MuiThemeProvider>
    );
  }
}

AdminLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AdminLogin));
