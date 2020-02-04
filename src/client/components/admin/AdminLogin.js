import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login, setError } from '../../reducers/user';
import Button from '../Button';

const useStyles = makeStyles(() => ({
  textField: {
    width: '80%'
  },
  hiddenSubmit: {
    visibility: 'hidden',
    width: 0,
    height: 0,
    overflow: 'none'
  }
}));

export default function AdminLogin() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const errors = useSelector(state => state.user.errors);
  const loading = useSelector(state => state.progress.loading);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');

  const onChangeName = useCallback(event => {
    dispatch(clearErrors());
    setName(event.target.value);
  }, [dispatch]);

  const onChangePass = useCallback(event => {
    dispatch(clearErrors());
    setPass(event.target.value);
  }, [dispatch]);

  const onSubmit = useCallback(event => {
    event.preventDefault();
    if (!name) {
      dispatch(setError('name', 'Name cannot be empty'));
    }
    if (!pass) {
      dispatch(setError('pass', 'Password cannot be empty'));
    }
    dispatch(login(name, pass));
  }, [dispatch, name, pass]);

  return (
    <form onSubmit={onSubmit} noValidate autoComplete="off">
      <Grid container spacing={2}>
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
            onChange={onChangeName}
            className={classes.textField}
            margin="normal"
            variant="outlined"
            helperText={errors && errors.name}
            disabled={loading}
            autoFocus
            autoComplete="username"/>
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextField
            error={!!(errors && errors.pass)}
            id="admin-password-input"
            label="Password"
            onChange={onChangePass}
            className={classes.textField}
            type="password"
            margin="normal"
            variant="outlined"
            helperText={errors && errors.pass}
            disabled={loading}
            autoComplete="current-password"/>
        </Grid>
        <Grid item sm={11} xs={10}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth>
            Log in
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
