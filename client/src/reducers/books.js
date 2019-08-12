import agent from '../agent';
import { SHOW_ERROR } from './error';
import { LOADED, LOADING } from './progress';
import { LOG_IN } from './user';
import { PATCH_BOOK, ADD_BOOK, HIDE_BOOK } from './sharedActions.mjs';

export const CONFIRM_TOO_SLOW = 'CONFIRM_TOO_SLOW';
export const FINISH_RESERVATION = 'FINISH_RESERVATION';
export const CONFIRM_MARK_DELIVERED = 'CONFIRM_MARK_DELIVERED';
export const CANCEL_MARK_DELIVERED = 'CANCEL_MARK_DELIVERED';
const BOOKS_VIEW_LOADED = 'BOOKS_VIEW_LOADED';
const BOOKS_VIEW_ERROR = 'BOOKS_VIEW_ERROR';
const SELECT_BOOK = 'SELECT_BOOK';
const DESELECT_BOOK = 'DESELECT_BOOK';
const EDIT_BOOK = 'EDIT_BOOK';
const UPDATE_BOOK = 'UPDATE_BOOK';
const RESERVE_BOOK = 'RESERVE_BOOK';
const DECLINE_BOOK = 'DECLINE_BOOK';
const DELETE_BOOK = 'DELETE_BOOK';

const initialState = {
  selected: null,
  editing: null,
  tooSlow: false,
  reservations: {},
  booksByReserver: {},
  markDelivered: null
};

export default (state = initialState, action) => {
  const { field, value, patch } = action;

  const updateBookField = (f, v) =>
    (state.books || []).map((book) => {
      if (book.isbn === action.book.isbn) {
        return { ...book, [f]: v };
      } else {
        return book;
      }
    });

  const patchBook = () =>
    (state.books || []).map((book) => {
      if (book.isbn === action.isbn) {
        return { ...book, ...patch };
      } else {
        return book;
      }
    });

  const deleteReserver = () =>
    (state.books || []).map((book) => {
      if (book.isbn === action.book.isbn) {
        const clearedBook = {};
        for (const key of Object.keys(book)) {
          if (key !== 'reserver' && key !== 'reserverName') {
            clearedBook[key] = book[key];
          }
        }
        return clearedBook;
      } else {
        return book;
      }
    });

  const deleteBooks = () =>
    (state.books || []).filter((book) => book.reserver !== action.reserver);

  const groupByReserver = () =>
    (action.books || [])
      .filter(book => book.reserver)
      .reduce((acc, curr) => {
        (acc[curr.reserver] = acc[curr.reserver] || []).push(curr);
        return acc;
      }, {});

  const existingReservations = () => {
    const reservations = {};
    const books = (action.books || []);
    for (const book of books) {
      if (book.reserver) {
        reservations[book.isbn] = 'exists';
      }
    }
    return reservations;
  };

  const surname = (fullName) => {
    const parts = fullName.split(/\s+/);
    return parts[parts.length - 1];
  };

  const sortableTitle = (title) => {
    const parts = title.split(/\s+/);
    // Uhh..
    const articles = ['a', 'an', 'the', 'en', 'ett', 'un', 'une', 'le', 'la', 'les'];
    if (parts.length > 1 && articles.includes(parts[0].toLowerCase())) {
      parts.shift();
      return parts.join(' ');
    }
    return title;
  };

  const sortedByAuthor = (books) =>
    (books || []).slice().sort((a, b) => {
      const surnameComparison = surname(a.author).localeCompare(surname(b.author));
      if (surnameComparison !== 0) {
        return surnameComparison;
      }
      const nameComparison = a.author.localeCompare(b.author);
      if (nameComparison !== 0) {
        return nameComparison;
      }
      return sortableTitle(a.title).localeCompare(sortableTitle(b.title));
    });

  const upsert = () => {
    const upserted = (state.books || []).filter((book) => action.book.isbn !== book.isbn);
    upserted.push(action.book);
    return sortedByAuthor(upserted);
  };

  switch (action.type) {
    case BOOKS_VIEW_LOADED:
      return {
        ...state,
        books: sortedByAuthor(action.books),
        booksByReserver: groupByReserver(),
        reservations: existingReservations()
      };
    case BOOKS_VIEW_ERROR:
      return { ...state, error: action.error };
    case SELECT_BOOK:
      return { ...state, selected: action.book.isbn };
    case DESELECT_BOOK:
      return { ...state, selected: null };
    case EDIT_BOOK:
      return { ...state, editing: field };
    case UPDATE_BOOK:
      return { ...state, books: updateBookField(field, value), editing: null };
    case RESERVE_BOOK:
      return {
        ...state,
        books: updateBookField('reserverName', action.name),
        editing: null,
        reservations: { ...state.reservations, [action.book.isbn]: 'coming' }
      };
    case FINISH_RESERVATION:
      return {
        ...state,
        reservations: { ...state.reservations, [action.isbn]: 'exists' }
      };
    case DECLINE_BOOK:
      return {
        ...state,
        books: deleteReserver(),
        editing: null,
        reservations: { ...state.reservations, [action.book.isbn]: 'going' }
      };
    case PATCH_BOOK:
      return { ...state, books: patchBook() };
    case HIDE_BOOK:
      const tooSlow = state.selected === action.isbn;
      return {
        ...state,
        books: (state.books || []).filter(book => book.isbn !== action.isbn),
        tooSlow: tooSlow || state.tooSlow,
        selected: tooSlow ? null : state.selected
      };
    case CONFIRM_TOO_SLOW:
      return { ...state, tooSlow: false };
    case ADD_BOOK:
      return { ...state, books: upsert() };
    case CONFIRM_MARK_DELIVERED:
      return { ...state, markDelivered: action.reserver };
    case CANCEL_MARK_DELIVERED:
      return { ...state, markDelivered: null };
    case DELETE_BOOK:
      return { ...state, books: deleteBooks(), markDelivered: null };
    default:
      return state;
  }
}

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

export const selectBook = (book) => {
  return async dispatch => {
    dispatch({ type: SELECT_BOOK, book });
  };
};

export const deselectBook = (book) => {
  return async dispatch => {
    dispatch({ type: DESELECT_BOOK, book });
  };
};

export const editBook = (field) => {
  return async dispatch => {
    dispatch({ type: EDIT_BOOK, field });
  };
};

export const updateBook = (book, field, value) => {
  return async dispatch => {
    await agent.Books.update(book.isbn, field, value);
    dispatch({ type: UPDATE_BOOK, book, field, value });
  };
};

export const reserveBook = (book) => {
  return async dispatch => {
    dispatch({ type: LOADING });
    try {
      const { name } = await agent.Books.reserve(book.isbn);
      dispatch({ type: RESERVE_BOOK, book, name });
    } catch (err) {
      if (err.status === 401) {
        dispatch({ type: LOG_IN, onSuccess: 'reserve', isbn: book.isbn });
      } else {
        dispatch({ type: SHOW_ERROR, error: err.statusText });
      }
    } finally {
      dispatch({ type: LOADED });
    }
  };
};

export const declineBook = (book) => {
  return async dispatch => {
    dispatch({ type: LOADING });
    try {
      await agent.Books.decline(book.isbn);
      dispatch({ type: DECLINE_BOOK, book });
    } catch (err) {
      if (err.status === 401) {
        dispatch({ type: LOG_IN, onSuccess: 'decline', isbn: book.isbn });
      } else {
        dispatch({ type: SHOW_ERROR, error: err.statusText });
      }
    } finally {
      dispatch({ type: LOADED });
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