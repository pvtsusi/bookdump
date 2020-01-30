import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import * as PropTypes from 'prop-types';
import React from 'react';

const styles = (theme) => ({
  progress: {
    margin: theme.spacing(2),
    color: '#2a2a2a'
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
