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

const mapStateToProps = ({ books }) => ({
  tooSlow: books.tooSlow
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmTooSlow: () => dispatch => dispatch({ type: 'CONFIRM_TOO_SLOW' })
    }, dispatch
  );


class TooSlowSnackbar extends React.Component {
  constructor(props){
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <MuiThemeProvider theme={themes.narrow}>
        <Snackbar
          open={this.props.tooSlow}
          onClose={this.props.confirmTooSlow}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <SnackbarContent message="Sorry, someone was quicker than you." className={this.classes.message} />
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

TooSlowSnackbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TooSlowSnackbar));
