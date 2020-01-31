import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CLEAR_SNACKBAR } from '../reducers/snackbar';
import themes from '../themes';

const styles = theme => ({
  message: {
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  }
});

const mapStateToProps = ({ snackbar }) => ({
  shown: snackbar
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearSnackbar: (key) => dispatch => dispatch({ type: CLEAR_SNACKBAR, key })
    }, dispatch
  );


class MessageSnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
  }

  render() {
    return (
      <MuiThemeProvider theme={themes.narrow}>
        <Snackbar
          open={this.props.open || !!this.props.shown[this.props.snackbarKey]}
          onClose={() => {
            this.props.onClose && this.props.onClose();
            this.props.clearSnackbar(this.props.snackbarKey);
          }}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <SnackbarContent
            message={this.props.message || this.props.shown[this.props.snackbarKey]}
            className={this.classes.message}/>
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

MessageSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  snackbarKey: PropTypes.string
};

const styled = withStyles(styles)(MessageSnackbar);
export { styled as MessageSnackbar };
export default connect(mapStateToProps, mapDispatchToProps)(styled);
