import agent from '../agent';
import { endLoading, startLoading } from '../progress';
import { startLoggingIn } from '../sessions';
import { showSnackbar } from '../snackbar';
import { SNACKBAR_ERROR } from '../snackbar';
import {
  BOOKS_VIEW_ERROR,
  BOOKS_VIEW_LOADED,
  CANCEL_MARK_DELIVERED,
  CONFIRM_MARK_DELIVERED,
  DECLINE_BOOK,
  DELETE_BOOK,
  DESELECT_BOOK,
  EDIT_BOOK,
  RESERVE_BOOK,
  SELECT_BOOK,
  UPDATE_BOOK
} from './booksConstants';

async function doGetBooks(dispatch) {
  try {
    const books = await agent.Books.all();
    dispatch({ type: BOOKS_VIEW_LOADED, books });
  } catch (err) {
    dispatch({ type: BOOKS_VIEW_ERROR, error: err.statusText });
  }
}

export const getBooks = () => {
  return async dispatch => {
    await doGetBooks(dispatch);
  };
};
export const selectBook = (book) => dispatch => dispatch({ type: SELECT_BOOK, book });
export const deselectBook = () => dispatch => dispatch({ type: DESELECT_BOOK });
export const editBook = (field) => dispatch => dispatch({ type: EDIT_BOOK, field });
export const updateBook = (book, field, value) => {
  return async dispatch => {
    await agent.Books.update(book.isbn, field, value);
    dispatch({ type: UPDATE_BOOK, book, field, value });
  };
};
export const reserveBook = (book) => {
  return async dispatch => {
    dispatch(startLoading());
    try {
      const { name } = await agent.Books.reserve(book.isbn);
      dispatch({ type: RESERVE_BOOK, book, name });
    } catch (err) {
      if (err.status === 401) {
        dispatch(startLoggingIn());
      } else {
        dispatch(showSnackbar(SNACKBAR_ERROR, `Error: ${err.statusText}`));
      }
    } finally {
      dispatch(endLoading());
    }
  };
};
export const declineBook = (book) => {
  return async dispatch => {
    dispatch(startLoading());
    try {
      await agent.Books.decline(book.isbn);
      dispatch({ type: DECLINE_BOOK, book });
    } catch (err) {
      if (err.status === 401) {
        dispatch(startLoggingIn());
      } else {
        dispatch(showSnackbar(SNACKBAR_ERROR, `Error: ${err.statusText}`));
      }
    } finally {
      dispatch(endLoading());
    }
  };
};
export const markDelivered = (reserver) => {
  return async dispatch => {
    await agent.Books.delete(reserver);
    await doGetBooks(dispatch);
    dispatch({ type: DELETE_BOOK, reserver });
  };
};

export const confirmMarkDelivered = (reserver) => dispatch => dispatch({ type: CONFIRM_MARK_DELIVERED, reserver });
export const cancelMarkDelivered = () => dispatch => dispatch({ type: CANCEL_MARK_DELIVERED });