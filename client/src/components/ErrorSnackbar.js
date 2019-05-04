import grey from '@material-ui/core/colors/grey';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CLEAR_ERROR } from '../reducers/error';
import themes from '../themes';

const styles = () => ({
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
      clearError: () => dispatch => dispatch({ type: CLEAR_ERROR })
    }, dispatch
  );


class ErrorSnackbar extends React.Component {
  constructor(props) {
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
          <SnackbarContent message={`Error: ${this.props.error}`} className={this.classes.message}/>
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

ErrorSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ErrorSnackbar));
