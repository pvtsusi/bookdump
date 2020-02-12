import {
  ADD_BOOK,
  BOOKS_VIEW_ERROR,
  BOOKS_VIEW_LOADED,
  CANCEL_MARK_DELIVERED,
  CONFIRM_MARK_DELIVERED,
  CONFIRM_TOO_SLOW,
  DECLINE_BOOK,
  DELETE_BOOK,
  DESELECT_BOOK,
  EDIT_BOOK,
  FINISH_RESERVATION,
  HIDE_BOOK,
  PATCH_BOOK,
  RESERVE_BOOK,
  SELECT_BOOK,
  UPDATE_BOOK
} from './booksConstants';
import {
  updateBookField,
  patchBook,
  deleteReserver,
  deleteBooks,
  groupByReserver,
  existingReservations, sortedByAuthor, upsert
} from './booksHelpers';


const initialState = {
  selected: null,
  editing: null,
  tooSlow: false,
  reservations: {},
  booksByReserver: {},
  markDelivered: null
};

export default (state = initialState, action) => {
  const { book, field, value } = action;
  switch (action.type) {
    case BOOKS_VIEW_LOADED:
      return {
        ...state,
        books: sortedByAuthor(action.books),
        booksByReserver: groupByReserver(action.books),
        reservations: existingReservations(action.books)
      };
    case BOOKS_VIEW_ERROR:
      return { ...state, error: action.error };
    case SELECT_BOOK:
      return { ...state, selected: book.isbn };
    case DESELECT_BOOK:
      return { ...state, selected: null };
    case EDIT_BOOK:
      return { ...state, editing: field };
    case UPDATE_BOOK:
      return { ...state, books: updateBookField(state.books, book.isbn, field, value), editing: null };
    case RESERVE_BOOK:
      return {
        ...state,
        books: updateBookField(state.books, book.isbn, 'reserverName', action.name),
        editing: null,
        reservations: { ...state.reservations, [book.isbn]: 'coming' }
      };
    case FINISH_RESERVATION:
      return {
        ...state,
        reservations: { ...state.reservations, [action.isbn]: 'exists' }
      };
    case DECLINE_BOOK:
      return {
        ...state,
        books: deleteReserver(state.books, book.isbn),
        editing: null,
        reservations: { ...state.reservations, [book.isbn]: 'going' }
      };
    case PATCH_BOOK:
      return { ...state, books: patchBook(state.books, action.isbn, action.patch) };
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
      return { ...state, books: upsert(state.books, book) };
    case CONFIRM_MARK_DELIVERED:
      return { ...state, markDelivered: action.reserver };
    case CANCEL_MARK_DELIVERED:
      return { ...state, markDelivered: null };
    case DELETE_BOOK:
      return { ...state, books: deleteBooks(state.books, action.reserver), markDelivered: null };
    default:
      return state;
  }
}
