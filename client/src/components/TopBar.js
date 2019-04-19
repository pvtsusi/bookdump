import AppBar from '@material-ui/core/AppBar';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';
import React from 'react';
import 'typeface-pt-sans-narrow';
import themes from '../themes';
import Logo from './Logo';
import SessionPopover from './SessionPopover';

const styles = {
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
};

class TopBar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar color="default">
          <Toolbar>
            <Logo/>
            <MuiThemeProvider theme={themes.narrow}>
              <Typography className={classes.title} variant="h4" color="inherit">
                Bookdump
              </Typography>
            </MuiThemeProvider>
            <SessionPopover/>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TopBar);