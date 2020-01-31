import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import React from 'react';

const styles = (theme) => ({
  progress: {
    margin: theme.spacing(2),
    color: theme.palette.text.primary
  }
});

function Progress(props) {
  const { classes } = props;
  return (
    <Grid container spacing={0} alignItems="center" justify="center">
      <CircularProgress className={classes.progress} disableShrink/>
    </Grid>
  );
}

Progress.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Progress);
