import grey from '@material-ui/core/colors/grey';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CONFIRM_LOGGED_OUT } from '../reducers/user';
import themes from '../themes';

const styles = () => ({
  message: {
    justifyContent: 'center',
    backgroundColor: grey[50],
    color: 'black'
  }
});

const mapStateToProps = ({ user }) => ({
  loggedOut: user.loggedOut
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmLoggedOut: () => dispatch => dispatch({ type: CONFIRM_LOGGED_OUT })
    }, dispatch
  );

class LoggedOutSnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <MuiThemeProvider theme={themes.narrow}>
        <Snackbar
          open={this.props.loggedOut}
          onClose={this.props.confirmLoggedOut}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <SnackbarContent message="You have been logged out." className={this.classes.message}/>
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

LoggedOutSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(LoggedOutSnackbar));
