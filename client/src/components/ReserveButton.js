import React from 'react';
import Button from './Button';
import CardActions from '@material-ui/core/CardActions/CardActions';
import {bindActionCreators} from 'redux';
import {deselectBook, reserveBook, declineBook} from '../reducers/books';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


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
        <Button onClick={() => this.props.declineBook(this.props.book)} variant="contained">
          I don't want this
        </Button>
      );
    }
    return (
      <Button onClick={() => this.props.reserveBook(this.props.book)} variant="contained">
        I want this
      </Button>
    );
  }
}

ReserveButton.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default connect(() => ({}), mapDispatchToProps)(ReserveButton);