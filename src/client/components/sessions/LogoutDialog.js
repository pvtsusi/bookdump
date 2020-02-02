import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelLogout, logout } from '../../reducers/user';
import Button from '../Button';

const useStyles = makeStyles(theme => ({
  actions: {
    paddingRight: theme.spacing(2)
  },
  content: {
    color: theme.palette.text.primary
  }
}));

export default function LogoutDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggingOut = useSelector(state => state.user.loggingOut);
  const admin = useSelector(state => state.session.authenticated && state.session.user && state.session.user.admin);

  return (
    <Dialog
      open={loggingOut}
      onClose={() => dispatch(cancelLogout())}>
      <DialogTitle>
        Are you sure you want to sign out?
      </DialogTitle>
      {!admin &&
      <DialogContent>
        <DialogContentText classes={{ root: classes.content }}>
          If you sign out, I will forget you and all about you.
        </DialogContentText>
      </DialogContent>
      }
      <DialogActions className={classes.actions}>
        <Button id="cancel-logout-button" onClick={() => dispatch(cancelLogout())}>
          Never mind
        </Button>
        <Button id="logout-button" variant="contained" color="secondary" onClick={() => dispatch(logout(admin))}>
          Yes, do that
        </Button>
      </DialogActions>
    </Dialog>
  );
}