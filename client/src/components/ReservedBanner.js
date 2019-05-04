import { MuiThemeProvider, withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import Paper from '@material-ui/core/Paper/Paper';
import Typography from '@material-ui/core/Typography/Typography';
import Zoom from '@material-ui/core/Zoom/Zoom';
import ReservedIcon from '@material-ui/icons/HowToVote';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FINISH_RESERVATION } from '../reducers/books';
import themes from '../themes';

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

const mapStateToProps = ({ session, books }) => ({
  userName: session.user && session.user.name,
  reservations: books.reservations
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      transitioned: (isbn) => dispatch => dispatch({ type: FINISH_RESERVATION, isbn: isbn })
    }, dispatch
  );

class ReservedBanner extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  render() {
    const reserver = this.props.reserver === this.props.userName ? 'you' : this.props.reserver;
    const reserved = `Reserved for ${reserver}`;
    const doTransition = this.props.reservations[this.props.isbn] !== 'exists';
    return (
      <Grid container spacing={0} className={this.classes.root} alignItems="center" justify="center">
        <Zoom
          in={!!this.props.reserver}
          timeout={doTransition ? 500 : 0}
          onEntered={() => doTransition && this.props.transitioned(this.props.isbn)}
          onExited={() => doTransition && this.props.transitioned(this.props.isbn)}>
          <Paper className={this.classes.message}>
            <ReservedIcon className={this.classes.reserved}/>
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
  reserver: PropTypes.string
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ReservedBanner));
