import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  progress: {
    margin: theme.spacing.unit * 2,
    color: '#2a2a2a',
  }
});

function Progress(props) {
  const { classes } = props;
  return (
    <Grid container spacing={0} alignItems="center" justify="center">
      <CircularProgress className={classes.progress} />
    </Grid>
  );
}

Progress.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Progress);
