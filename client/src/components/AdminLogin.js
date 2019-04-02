import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {createMuiTheme, withStyles, MuiThemeProvider} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography/Typography";


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


class AdminLogin extends React.Component {
  constructor(props) {
    super(props)
  }

  render () {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <form noValidate autoComplete="off">
          <Grid container spacing={20}>
            <Grid item sm={12}>
              <Typography component="h5" variant="h5">
                Log in as admin
              </Typography>
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                id="name-input"
                label="Name"
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                id="password-input"
                label="Password"
                className={classes.textField}
                type="password"
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
      </MuiThemeProvider>
    );
  }
}

AdminLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminLogin);
