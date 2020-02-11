import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { AdminNavigation } from '../admin';
import Logo from './Logo';
import SessionPopover from './sessions/SessionPopover';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}));

export default function TopBar() {
  const classes = useStyles();
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
