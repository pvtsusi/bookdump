import React from 'react';
import {bindActionCreators} from 'redux';
import IconButton from '@material-ui/core/IconButton/IconButton';
import PersonIcon from '@material-ui/icons/PermIdentity';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography/Typography';
import Popover from '@material-ui/core/Popover/Popover';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import themes from '../themes';
import PropTypes from 'prop-types';
import Button from './Button';
import Grid from '@material-ui/core/Grid/Grid';
import LogoutDialog from './LogoutDialog';


const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit
  },
  message: {
    marginBottom: theme.spacing.unit
  }
});

const mapStateToProps = ({ session }) => ({
  signedIn: session.user && session.user.name,
  userName: session.user.name
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    startLoggingOut: () => dispatch => dispatch({type: 'LOG_OUT'})
  }, dispatch);

class SessionPopover extends React.Component {
  constructor (props) {
    super(props);
    this.classes = this.props.classes;
    this.state = {
      anchorEl: null
    };
  }

  handleOpen = (event) =>
    this.setState({anchorEl: event.target});

  handleClose = () =>
    this.setState({anchorEl: null});

  startLoggingOut = () => {
    this.handleClose();
    this.props.startLoggingOut();
  };

  render () {
    if (!this.props.signedIn) {
      return null
    }
    return (
      <React.Fragment>
        <IconButton
          onClick={this.handleOpen}
          aria-owns={this.state.anchorEl ? 'session-popover' : undefined}
          aria-haspopup="true">
          <PersonIcon fontSize="large"/>
        </IconButton>
        <Popover
          id="session-popover"
          open={!!this.state.anchorEl}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}>
          <MuiThemeProvider theme={themes.normal}>
            <Grid className={this.classes.root} container>
              <Grid item xs={12} className={this.classes.message}>
                <Typography variant="body1">
                You are signed in as {this.props.userName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="outlined" onClick={this.startLoggingOut}>
                  Sign out
                </Button>
              </Grid>
            </Grid>
          </MuiThemeProvider>
        </Popover>
        <LogoutDialog/>
      </React.Fragment>
    );
  }
}

SessionPopover.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SessionPopover));