import React from 'react';
import Button from './Button';
import {bindActionCreators} from 'redux';
import {deselectBook, reserveBook, declineBook} from '../reducers/books';
import { connect } from 'react-redux';
import LoginDialog from './LoginDialog';


const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deselectBook,
      reserveBook,
      declineBook
    }, dispatch
  );

class ReserveButton extends React.Component {
  render () {
    if (!this.props.book) {
      return null;
    }
    if (this.props.book.reserverName) {
      return (
        <Button disableRipple onClick={() => this.props.declineBook(this.props.book)} variant="outlined" color="secondary">
          I don't want this
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