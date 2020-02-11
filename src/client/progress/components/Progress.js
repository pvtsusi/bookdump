import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
    color: theme.palette.text.primary
  }
}));

export default function Progress() {
  const classes = useStyles();
  return (
    <Grid container spacing={0} alignItems="center" justify="center">
      <CircularProgress className={classes.progress} disableShrink/>
    </Grid>
  );
}
