import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/PermIdentity';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startLoggingOut } from '..';
import Button from '../../components/Button';
import LogoutDialog from './LogoutDialog';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  },
  message: {
    marginBottom: theme.spacing(1)
  }
}));

export default function SessionPopover() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const signedInUser = useSelector(state => state.session.user && state.session.user.name);
  const admin = useSelector(state => state.session.user && state.session.user.admin);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = useCallback(event => {
    setAnchorEl(event.target);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const logOut = useCallback(() => {
    setAnchorEl(null);
    dispatch(startLoggingOut());
  }, [dispatch]);

  if (!signedInUser) {
    return null;
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={handleOpen}
        aria-owns={anchorEl ? 'session-popover' : undefined}
        aria-haspopup="true">
        <PersonIcon fontSize="large"/>
      </IconButton>
      <Popover
        id="session-popover"
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}>
        <Grid className={classes.root} container>
          <Grid item xs={12} className={classes.message}>
            <Typography variant="body1">
              You are signed in as {signedInUser} {admin && '(admin)'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button id='start-logging-out-button' fullWidth variant="outlined" onClick={logOut}>
              Sign out
            </Button>
          </Grid>
        </Grid>
      </Popover>
      <LogoutDialog/>
    </React.Fragment>
  );
}
