import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { LOG_IN } from '../sessions/sessionsConstants';
import {
  cancelMarkDelivered, confirmMarkDelivered,
  declineBook,
  deselectBook,
  editBook, getBooks,
  markDelivered,
  reserveBook, selectBook,
  updateBook
} from './booksActions';
import {
  BOOKS_VIEW_ERROR, BOOKS_VIEW_LOADED,
  CANCEL_MARK_DELIVERED, CONFIRM_MARK_DELIVERED,
  DECLINE_BOOK,
  DELETE_BOOK, DESELECT_BOOK,
  EDIT_BOOK,
  RESERVE_BOOK, SELECT_BOOK,
  UPDATE_BOOK
} from './booksConstants';
import { LOADED, LOADING } from '../reducers/progress';
import { SHOW_SNACKBAR, SNACKBAR_ERROR } from '../reducers/snackbar';

const mockBook = { isbn: 'isbn1' };
const mockBooks = ['mockBook1', 'mockBook2'];
const mockReserver = 'Mock Reserver';
let mockError = null;
let mockReserveFn = jest.fn();
let mockDeclineFn = jest.fn();
let mockUpdateFn = jest.fn();
let mockDeleteFn = jest.fn();

jest.mock('../agent', () => {
  return {
    __esModule: true,
    default: {
      Books: {
        all: async () => {
          if (mockError) {
            throw mockError;
          } else {
            return mockBooks;
          }
        },
        update: async (isbn, field, value) => mockUpdateFn(isbn, field, value),
        reserve: async (isbn) => {
          const reservedValue = mockReserveFn(isbn);
          if (mockError) {
            throw mockError;
          } else {
            return reservedValue;
          }
        },
        decline: async (isbn) => {
          mockDeclineFn(isbn);
          if (mockError) {
            throw mockError;
          }
        },
        delete: async (userSha) => mockDeleteFn(userSha)
      }
    }
  };
});

const mockStore = configureMockStore([thunk]);

let store;

describe('books actions', () => {
  beforeEach(() => {
    mockError = null;
    mockReserveFn = jest.fn();
    mockDeclineFn = jest.fn();
    mockUpdateFn = jest.fn();
    mockDeleteFn = jest.fn();
    store = mockStore({
      booksByReserver: {}
    });
  });

  describe('with no books retrieval errors', () => {
    beforeEach(() => {
      mockError = null;
    });

    it('getBooks() dispatches BOOKS_VIEW_LOADED', async () => {
      await store.dispatch(getBooks());
      expect(store.getActions()).toEqual([{
        type: BOOKS_VIEW_LOADED,
        books: mockBooks
      }]);
    });
  });

  describe('with books retrieval error', () => {
    beforeEach(() => {
      mockError = { status: 500, statusText: 'error message' };
    });

    it('getBooks() dispatches BOOKS_VIEW_ERROR', async () => {
      await store.dispatch(getBooks());
      expect(store.getActions()).toEqual([{
        type: BOOKS_VIEW_ERROR,
        error: 'error message'
      }]);
    });
  });

  it('selectBook() dispatches SELECT_BOOK', () => {
    const book = 'mock book';
    store.dispatch(selectBook(book));
    expect(store.getActions()).toEqual([{
      type: SELECT_BOOK,
      book
    }]);
  });

  it('deselectBook() dispatches DESELECT_BOOK', () => {
    store.dispatch(deselectBook());
    expect(store.getActions()).toEqual([{
      type: DESELECT_BOOK
    }]);
  });

  it('editBook() dispatches EDIT_BOOK', () => {
    const field = 'field name';
    store.dispatch(editBook(field));
    expect(store.getActions()).toEqual([{
      type: EDIT_BOOK,
      field
    }]);
  });

  it('updateBook() calls agent update() and dispatches UPDATE_BOOK', async () => {
    const book = { isbn: 'isbn1' };
    const field = 'field name';
    const value = 'new field value';
    await store.dispatch(updateBook(book, field, value));
    expect(mockUpdateFn).toHaveBeenCalledWith(book.isbn, field, value);
    expect(store.getActions()).toEqual([{
      type: UPDATE_BOOK,
      book,
      field,
      value
    }]);
  });

  describe('with no reservation or declination errors', () => {
    beforeEach(() => {
      mockReserveFn = jest.fn(() => ({ name: mockReserver }));
      mockError = null;
    });

    it('reserveBook() dispatches LOADING, RESERVE_BOOK and LOADED', async () => {
      await store.dispatch(reserveBook(mockBook));
      expect(mockReserveFn).toHaveBeenCalledWith(mockBook.isbn);
      expect(store.getActions()).toEqual([{
        type: LOADING
      }, {
        type: RESERVE_BOOK,
        book: mockBook,
        name: mockReserver
      }, {
        type: LOADED
      }]);
    });

    it('declineBook() dispatches LOADING, DECLINE_BOOK and LOADED', async () => {
      await store.dispatch(declineBook(mockBook));
      expect(mockDeclineFn).toHaveBeenCalledWith(mockBook.isbn);
      expect(store.getActions()).toEqual([{
        type: LOADING
      }, {
        type: DECLINE_BOOK,
        book: mockBook
      }, {
        type: LOADED
      }]);
    });
  });

  describe('with authentication error', () => {
    beforeEach(() => {
      mockReserveFn = jest.fn();
      mockError = { status: 401 };
    });

    it('reserveBook() dispatches LOADING, LOG_IN and LOADED', async () => {
      await store.dispatch(reserveBook(mockBook));
      expect(mockReserveFn).toHaveBeenCalledWith(mockBook.isbn);
      expect(store.getActions()).toEqual([{
        type: LOADING
      }, {
        type: LOG_IN,
        onSuccess: 'reserve',
        isbn: mockBook.isbn
      }, {
        type: LOADED
      }]);
    });

    it('declineBook() dispatches LOADING, LOG_IN and LOADED', async () => {
      await store.dispatch(declineBook(mockBook));
      expect(mockDeclineFn).toHaveBeenCalledWith(mockBook.isbn);
      expect(store.getActions()).toEqual([{
        type: LOADING
      }, {
        type: LOG_IN,
        onSuccess: 'decline',
        isbn: mockBook.isbn
      }, {
        type: LOADED
      }]);
    });
  });

  describe('with unspecified error', () => {
    beforeEach(() => {
      mockReserveFn = jest.fn();
      mockError = { status: 500, statusText: 'error message' };
    });

    it('reserveBook() dispatches LOADING, SHOW_SNACKBAR with error and LOADED', async () => {
      await store.dispatch(reserveBook(mockBook));
      expect(mockReserveFn).toHaveBeenCalledWith(mockBook.isbn);
      expect(store.getActions()).toEqual([{
        type: LOADING
      }, {
        type: SHOW_SNACKBAR,
        key: SNACKBAR_ERROR,
        message: 'Error: error message'
      }, {
        type: LOADED
      }]);
    });

    it('declineBook() dispatches LOADING, SHOW_SNACKBAR with error and LOADED', async () => {
      await store.dispatch(declineBook(mockBook));
      expect(mockDeclineFn).toHaveBeenCalledWith(mockBook.isbn);
      expect(store.getActions()).toEqual([{
        type: LOADING
      }, {
        type: SHOW_SNACKBAR,
        key: SNACKBAR_ERROR,
        message: 'Error: error message'
      }, {
        type: LOADED
      }]);
    });
  });

  it('markDelivered() dispatches BOOKS_VIEW_LOADED and DELETE_BOOK', async () => {
    const reserver = 'reserver sha';
    await store.dispatch(markDelivered(reserver));
    expect(mockDeleteFn).toHaveBeenCalledWith(reserver);
    expect(store.getActions()).toEqual([{
      type: BOOKS_VIEW_LOADED,
      books: mockBooks
    }, {
      type: DELETE_BOOK,
      reserver
    }]);
  });

  it('confirmMarkDelivered() dispatches CONFIRM_MARK_DELIVERED', () => {
    const reserver = 'reserver sha';
    store.dispatch(confirmMarkDelivered(reserver));
    expect(store.getActions()).toEqual([{
      type: CONFIRM_MARK_DELIVERED,
      reserver
    }]);
  });

  it('cancelMarkDelivered() dispatches CANCEL_MARK_DELIVERED', () => {
    store.dispatch(cancelMarkDelivered());
    expect(store.getActions()).toEqual([{
      type: CANCEL_MARK_DELIVERED
    }]);
  });

});