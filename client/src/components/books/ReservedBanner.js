import { makeStyles, MuiThemeProvider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import Zoom from '@material-ui/core/Zoom/Zoom';
import ReservedIcon from '@material-ui/icons/HowToVote';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FINISH_RESERVATION } from '../../reducers/books';
import themes from '../../themes';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      top: 0
    }
  },
  message: {
    padding: theme.spacing(1),
    display: 'flex',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.background.default
  },
  reserved: {
    color: 'green'
  }
}));

export default function ReservedBanner(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userName = useSelector(state => state.session.user && state.session.user.name);
  const reservations = useSelector(state => state.books.reservations);

  const reserver = props.reserver === userName ? 'you' : props.reserver;
  const reserved = `Reserved for ${reserver}`;
  const doTransition = reservations[props.isbn] !== 'exists';

  return (
    <Grid container spacing={0} className={classes.root} alignItems="center" justify="center">
      <Zoom
        in={!!props.reserver}
        timeout={doTransition ? 500 : 0}
        onEntered={() => doTransition && dispatch({ type: FINISH_RESERVATION, isbn: props.isbn })}
        onExited={() => doTransition && dispatch({ type: FINISH_RESERVATION, isbn: props.isbn })}>
        <Paper className={classes.message} elevation={3}>
          <ReservedIcon className={classes.reserved}/>
          <MuiThemeProvider theme={themes.narrow}>
            <Typography variant="body1" component="h5">
              {reserved}
            </Typography>
          </MuiThemeProvider>
        </Paper>
      </Zoom>
    </Grid>
  );
}
