import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSnackbar } from '../reducers/snackbar';
import themes from '../themes';

const useStyles = makeStyles(theme => ({
  message: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  }
}));

export default function MessageSnackbar({open, snackbarKey, message, onClose}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const shown = useSelector(state => state.snackbar);

  const onCloseCallback = useCallback(() => {
    onClose && onClose();
    dispatch(clearSnackbar(snackbarKey));
  }, [onClose, snackbarKey, dispatch]);

  return (
    <MuiThemeProvider theme={themes.narrow}>
      <Snackbar
        open={open || !!shown[snackbarKey]}
        onClose={onCloseCallback}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <SnackbarContent
          message={message || shown[snackbarKey]}
          className={classes.message}/>
      </Snackbar>
    </MuiThemeProvider>
  );
}
