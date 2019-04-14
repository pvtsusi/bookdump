import React from 'react';
import Paper from '@material-ui/core/Paper/Paper';
import Grid from '@material-ui/core/Grid/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import {withStyles, MuiThemeProvider} from '@material-ui/core';
import themes from '../themes';
import ReservedIcon from '@material-ui/icons/HowToVote'
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import Zoom from '@material-ui/core/Zoom/Zoom';


const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    justifyContent: 'flex-start',
    [theme.breakpoints.down('xs')]: {
      position: 'absolute',
      top: 0
    }
  },
  message: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap'
  },
  reserved: {
    color: 'green'
  }
});

const mapStateToProps = ({ session }) => ({
  userName: session.user && session.user.name
});

class ReservedBanner extends React.Component {
  constructor(props){
    super(props);
    this.classes = props.classes;
  }

  render() {
    if (!this.props.reserver) {
      return null;
    }
    const reserver = this.props.reserver === this.props.userName ? 'you' : this.props.reserver;
    const reserved = `Reserved for ${reserver}`;
    return (
      <Grid container spacing={0} className={this.classes.root} alignItems="center" justify="center">
        <Zoom in>
          <Paper className={this.classes.message}>
            <ReservedIcon className={this.classes.reserved} />
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
}

ReservedBanner.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, () => ({}))(ReservedBanner));
