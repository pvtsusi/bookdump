import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { declineBook, deselectBook, reserveBook } from '../../reducers/books';
import Button from '../Button';
import LoginDialog from '../sessions/LoginDialog';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deselectBook,
      reserveBook,
      declineBook
    }, dispatch
  );

class ReserveButton extends React.Component {
  render() {
    if (!this.props.book) {
      return null;
    }
    if (this.props.book.reserverName) {
      return (
        <Button disableRipple onClick={() => this.props.declineBook(this.props.book)} variant="outlined"
                color="secondary">
          Never mind
        </Button>
      );
    }
    return (
      <React.Fragment>
        <Button disableRipple onClick={() => this.props.reserveBook(this.props.book)} variant="contained">
          I want this
        </Button>
        <LoginDialog onSuccess={() => this.props.reserveBook(this.props.book)}/>
      </React.Fragment>
    );
  }
}


export default connect(() => ({}), mapDispatchToProps)(ReserveButton);