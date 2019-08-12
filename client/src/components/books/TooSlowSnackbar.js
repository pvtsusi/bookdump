import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CONFIRM_TOO_SLOW } from '../../reducers/books';
import { SNACKBAR_TOO_SLOW } from '../../reducers/snackbar';
import MessageSnackbar from '../MessageSnackbar';

const mapStateToProps = ({ books }) => ({
  tooSlow: books.tooSlow
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmTooSlow: () => dispatch => dispatch({ type: CONFIRM_TOO_SLOW })
    }, dispatch
  );

class TooSlowSnackbar extends React.Component {
  render() {
    return (
      <MessageSnackbar
        open={this.props.tooSlow}
        onClose={() => this.props.confirmTooSlow()}
        snackbarKey={SNACKBAR_TOO_SLOW}
        message="Sorry, someone was quicker than you." />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TooSlowSnackbar);
