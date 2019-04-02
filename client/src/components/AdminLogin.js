import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import {createMuiTheme, withStyles, MuiThemeProvider} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography/Typography";
import { login } from '../actions';


const styles = theme => ({
  textField: {
    width: '80%'
  }
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: [
      'PT Sans Narrow',
      'Arial',
      'Helvetica',
      'sans-serif'
    ].join(',')
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ login }, dispatch);


class AdminLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      pass: ''
    };
    this.onChangeName = event => this.setState({...this.state, name: event.target.value});
    this.onChangePass = event => this.setState({...this.state, pass: event.target.value});
    this.onSubmit = event => {
      event.preventDefault();
      const { name, pass } = this.state;
      this.props.login(name, pass, this.props.history);
    };
  }

  render () {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <form onSubmit={this.onSubmit} noValidate autoComplete="off">
          <Grid container spacing={16}>
            <Grid item sm={12}>
              <Typography component="h5" variant="h5">
                Log in as admin
              </Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                id="name-input"
                label="Name"
                onChange={this.onChangeName}
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                id="password-input"
                label="Password"
                onChange={this.onChangePass}
                className={classes.textField}
                type="password"
                margin="normal"
                variant="outlined"
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

export default withStyles(styles)(connect(() => ({}), mapDispatchToProps)(AdminLogin));
