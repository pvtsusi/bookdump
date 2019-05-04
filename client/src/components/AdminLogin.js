import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography/Typography';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CLEAR_LOGIN_ERROR, login, LOGIN_ERROR } from '../reducers/user';
import themes from '../themes';

const styles = () => ({
  textField: {
    width: '80%'
  },
  hiddenSubmit: {
    visibility: 'hidden',
    width: 0,
    height: 0,
    overflow: 'none'
  }
});

const mapStateToProps = ({ user, progress }) => ({
  errors: user.errors,
  loading: progress.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    login,
    setError: (field, message) => dispatch({ type: LOGIN_ERROR, field, message }),
    clearErrors: () => dispatch => dispatch({ type: CLEAR_LOGIN_ERROR })
  }, dispatch);

class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: ''
    };
    this.onChange = (field) => event => {
      this.props.clearErrors();
      this.setState({ [field]: event.target.value });
    };
    this.onSubmit = event => {
      event.preventDefault();
      ['Name', 'Pass'].forEach(field =>
        this.state[field.toLowerCase()] || this.props.setError(field.toLowerCase(), `${field} cannot be empty`));
      this.props.login(this.state.name, this.state.pass, this.props.history);
    };
  }

  render() {
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
                onChange={this.onChange('name')}
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
                onChange={this.onChange('pass')}
                className={classes.textField}
                type="password"
                margin="normal"
                variant="outlined"
                helperText={errors && errors.pass}
                disabled={this.props.loading}
              />
            </Grid>
          </Grid>
          <input type="submit" className={classes.hiddenSubmit}/>
        </form>
      </MuiThemeProvider>
    );
  }
}

AdminLogin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(AdminLogin));
