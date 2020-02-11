import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSnackbar, SNACKBAR_TOO_SLOW } from '../../snackbar';
import { CONFIRM_TOO_SLOW } from '../booksConstants';

export default function TooSlowSnackbar() {
  const dispatch = useDispatch();
  const tooSlow = useSelector(state => state.books.tooSlow);
  return (
    <MessageSnackbar
      open={tooSlow}
      onClose={() => dispatch({ type: CONFIRM_TOO_SLOW })}
      snackbarKey={SNACKBAR_TOO_SLOW}
      message="Sorry, someone was quicker than you."/>
  );
}
