import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import Progress from './Progress';
import Grid from '@material-ui/core/Grid/Grid';
import Fade from '@material-ui/core/Fade/Fade';

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 10
  },
  container: {
    zIndex: theme.zIndex.modal + 20,
    minHeight: '100vh',
    position: 'fixed'
  }
});

class ModalProgress extends React.Component {
  constructor(props){
    super(props);
    this.classes = props.classes;
  }

  render () {
    if (this.props.show) {
      return (
        <React.Fragment>
          <Fade in style={{transitionDelay: this.props.show ? '600ms' : '0ms'}} unmountOnExit>
            <Backdrop open={this.props.show} className={this.classes.backdrop}/>
          </Fade>
          <Fade in style={{transitionDelay: this.props.show ? '500ms' : '0ms'}} unmountOnExit>
            <Grid container spacing={0} alignItems="center" justify="center" className={this.classes.container}>
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
}

ModalProgress.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ModalProgress);