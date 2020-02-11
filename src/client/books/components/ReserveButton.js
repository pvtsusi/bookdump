import React from 'react';
import { useDispatch } from 'react-redux';
import { declineBook, reserveBook } from '../booksActions';
import { Button } from '../../app';
import { LoginDialog } from '../../sessions';

export default function ReserveButton(props) {
  const dispatch = useDispatch();
  if (!props.book) {
    return null;
  }
  if (props.book.reserverName) {
    return (
      <Button disableRipple onClick={() => dispatch(declineBook(props.book))} variant="outlined"
              color="secondary">
        Never mind
      </Button>
    );
  }
  return (
    <React.Fragment>
      <Button disableRipple onClick={() => dispatch(reserveBook(props.book))} variant="contained">
        I want this
      </Button>
      <LoginDialog onSuccess="reserve" isbn={props.book.isbn}/>
    </React.Fragment>
  );
}
