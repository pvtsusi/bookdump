import React from 'react';

import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Logo from './Logo';
import 'typeface-pt-sans-narrow';

const styles = {
  root: {
    flexGrow: 1,
  },
  title: {

  }
};

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

function TopBar(props) {
  const {classes} = props;

  return (
    <div className={classes.root}>
      <AppBar color="default">
        <Toolbar>
          <Logo/>
          <MuiThemeProvider theme={theme}>
            <Typography variant="h4" color="inherit">
              Bookdump
            </Typography>
          </MuiThemeProvider>
        </Toolbar>
      </AppBar>
    </div>
  );
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);