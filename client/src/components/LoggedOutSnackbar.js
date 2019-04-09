import React from 'react';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import themes from '../themes';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';


const styles = {
  message: {
    justifyContent: 'center'
  }
};

const mapStateToProps = ({ user }) => ({
  loggedOut: user.loggedOut
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmLoggedOut: () => dispatch => dispatch({ type: 'CONFIRM_LOGGED_OUT' })
    }, dispatch
  );


class LoggedOutSnackbar extends React.Component {
  constructor(props){
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <MuiThemeProvider theme={themes.narrow}>
        <Snackbar
          open={this.props.loggedOut}
          onClose={this.props.confirmLoggedOut}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <SnackbarContent message="You have been logged out." className={this.classes.message} />
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

LoggedOutSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoggedOutSnackbar));
