import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelLogin, clearErrors, login, setError } from '..';
import Button from '../../components/Button';

const useStyles = makeStyles(theme => ({
  actions: {
    paddingRight: theme.spacing(2)
  }
}));

export default function LoginDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggingIn = useSelector(state => state.user.loggingIn);
  const errors = useSelector(state => state.user.errors);
  const loading = useSelector(state => state.progress.loading);
  const [name, setName] = useState('');

  const onChange = useCallback(event => {
    dispatch(clearErrors());
    setName(event.target.value);
  }, [dispatch]);

  const onSubmit = useCallback(event => {
    event.preventDefault();
    if (!name) {
      dispatch(setError('name', 'Don\'t leave this empty'));
    }
    dispatch(login(name, null, props.onSuccess));
  }, [dispatch, name, props.onSuccess]);

  return (
    <Dialog
      disableBackdropClick
      open={loggingIn}
      onClose={() => dispatch(cancelLogin())}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
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
            onChange={onChange}
            helperText={errors && errors.name}
            disabled={loading}
            className={classes.textField}
            margin="none"
            autoComplete="name"
            fullWidth
            autoFocus/>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button id="cancel-login" onClick={() => dispatch(cancelLogin())}>
            Never mind
          </Button>
          <Button type="submit" disabled={loading}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
