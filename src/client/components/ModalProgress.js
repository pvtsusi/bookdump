import { makeStyles } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade/Fade';
import Grid from '@material-ui/core/Grid/Grid';
import React from 'react';
import Progress from './Progress';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 10
  },
  container: {
    zIndex: theme.zIndex.modal + 20,
    minHeight: '100vh',
    position: 'fixed'
  }
}));

export default function ModalProgress(props) {
  const classes = useStyles();

  if (props.show) {
    return (
      <React.Fragment>
        <Fade in style={{ transitionDelay: props.show ? '600ms' : '0ms' }} unmountOnExit>
          <Backdrop open={props.show} classes={{ root: classes.backdrop }}/>
        </Fade>
        <Fade in style={{ transitionDelay: props.show ? '500ms' : '0ms' }} unmountOnExit>
          <Grid container spacing={0} alignItems="center" justify="center"
                classes={{ root: classes.container }}>
            <Grid item xs={3}>
              <Progress/>
            </Grid>
          </Grid>
        </Fade>
      </React.Fragment>
    );
  }
  return null;
}
