import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import * as PropTypes from 'prop-types';
import React from 'react';
import AdminNavigation from './admin/AdminNavigation';
import Logo from './Logo';
import SessionPopover from './sessions/SessionPopover';

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
            <AdminNavigation/>
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