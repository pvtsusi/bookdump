import React from 'react';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import themes from '../themes';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import grey from '@material-ui/core/colors/grey';


const styles = theme => ({
  message: {
    justifyContent: 'center',
    backgroundColor: grey[50],
    color: 'black'
  }
});

const mapStateToProps = ({ error }) => ({
  error: error.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearError: () => dispatch => dispatch({ type: 'CLEAR_ERROR' })
    }, dispatch
  );


class ErrorSnackbar extends React.Component {
  constructor(props){
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <MuiThemeProvider theme={themes.narrow}>
        <Snackbar
          open={!!this.props.error}
          onClose={this.props.clearError}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <SnackbarContent message={`Error: ${this.props.error}`} className={this.classes.message} />
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

ErrorSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ErrorSnackbar));
