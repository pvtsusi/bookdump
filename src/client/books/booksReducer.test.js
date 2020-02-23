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
import reducer from './booksReducer';

describe('booksReducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      selected: null,
      editing: null,
      tooSlow: false,
      reservations: {},
      booksByReserver: {},
      markDelivered: null
    });
  });

  describe('BOOKS_VIEW_LOADED', () => {
    let reduced = null;
    const book1 = { isbn: 'isbn1', author: 'b', title: 't1', reserver: 'r1' };
    const book2 = { isbn: 'isbn2', author: 'c', title: 't2', reserver: 'r2' };
    const book3 = { isbn: 'isbn3', author: 'a', title: 't3', reserver: 'r1' };
    const book4 = { isbn: 'isbn4', author: 'd', title: 't4 ' };
    beforeEach(() => {
      reduced = reducer({}, { type: BOOKS_VIEW_LOADED, books: [book1, book2, book3, book4] });
    });

    it('sets books, sorted by author', () =>
      expect(reduced.books).toEqual([
        book3, book1, book2, book4
      ]));

    it('collates to booksByReserver', () =>
      expect(reduced.booksByReserver).toEqual({
        r1: [book1, book3],
        r2: [book2]
      }));

    it('collates to reservations', () =>
      expect(reduced.reservations).toEqual({
        isbn1: 'exists',
        isbn2: 'exists',
        isbn3: 'exists'
      }));

    it('does not reduce to other fields', () => {
      const { books, booksByReserver, reservations, ...rest } = reduced;
      expect(rest).toEqual({});
    });
  });

  it('BOOKS_VIEW_ERROR sets error', () =>
    expect(reducer({}, { type: BOOKS_VIEW_ERROR, error: 'error message' })).toEqual({
      error: 'error message'
    }));

  it('SELECT_BOOK sets selected isbn', () =>
    expect(reducer({}, { type: SELECT_BOOK, book: { isbn: 'isbn1' } })).toEqual({
      selected: 'isbn1'
    }));

  it('DESELECT_BOOK sets selected isbn to null', () =>
    expect(reducer({ selected: 'isbn2' }, { type: DESELECT_BOOK })).toEqual({
      selected: null
    }));

  it('EDIT_BOOK sets the field that is being edited', () =>
    expect(reducer({}, { type: EDIT_BOOK, field: 'field name' })).toEqual({
      editing: 'field name'
    }));

  describe('UPDATE_BOOK', () => {
    let reduced = null;
    const isbn = 'isbn1';
    const field = 'title';
    const value = 'new title';
    const books = [
      { isbn: 'isbn1', author: 'auth', title: 'old title' },
      { isbn: 'isbn2', author: 'auth', title: 'other book' }
    ];
    beforeEach(() => {
      reduced = reducer({ books }, { type: UPDATE_BOOK, book: { isbn }, field, value });
    });

    it('updates a field of a single book matched by isbn', () =>
      expect(reduced.books).toEqual([
        { isbn: 'isbn1', author: 'auth', title: 'new title' },
        { isbn: 'isbn2', author: 'auth', title: 'other book' }
      ]));

    it('finishes editing by setting edited field to null', () =>
      expect(reduced.editing).toEqual(null));

    it('does not reduce to other fields', () => {
      const { books, editing, ...others } = reduced;
      expect(others).toEqual({});
    });
  });

  describe('RESERVE_BOOK', () => {
    let reduced = null;
    const isbn = 'isbn1';
    const name = 'Reserver Name';
    const books = [
      { isbn: 'isbn1' },
      { isbn: 'isbn2' }
    ];
    beforeEach(() => {
      reduced = reducer({ books }, { type: RESERVE_BOOK, book: { isbn }, name });
    });

    it('sets reserverName field for the reserved book', () =>
      expect(reduced.books).toEqual([
        { isbn: 'isbn1', reserverName: name },
        { isbn: 'isbn2' }
      ]));

    it('finishes editing by setting edited field to null', () =>
      expect(reduced.editing).toEqual(null));

    it('sets the reservation as coming for the book', () =>
      expect(reduced.reservations).toEqual({
        isbn1: 'coming'
      }));

    it('does not reduce to other fields', () => {
      const { books, editing, reservations, ...others } = reduced;
      expect(others).toEqual({});
    });
  });

  it('FINISH_RESERVATION sets the reservation as exists for the book', () =>
    expect(reducer({}, { type: FINISH_RESERVATION, isbn: 'isbn1' })).toEqual({
      reservations: {
        isbn1: 'exists'
      }
    }));

  describe('DECLINE_BOOK', () => {
    let reduced = null;
    const isbn = 'isbn1';
    const reserver = 'reserver sha';
    const reserverName = 'Reserver Name';
    const book1 = { isbn, reserver, reserverName };
    const book2 = { isbn: 'isbn2' };
    const books = [book1, book2];
    beforeEach(() => {
      reduced = reducer({ books }, { type: DECLINE_BOOK, book: book1 });
    });

    it('clears reserverName field from the reserved book', () =>
      expect(reduced.books).toEqual([
        { isbn: 'isbn1' },
        { isbn: 'isbn2' }
      ]));

    it('finishes editing by setting edited field to null', () =>
      expect(reduced.editing).toEqual(null));

    it('sets the reservation as going for the book', () =>
      expect(reduced.reservations).toEqual({
        isbn1: 'going'
      }));

    it('does not reduce to other fields', () => {
      const { books, editing, reservations, ...others } = reduced;
      expect(others).toEqual({});
    });
  });

  it('PATCH_BOOK patches a matching book', () => {
    const isbn = 'isbn1';
    const patch = { title: 'new title' };
    const book1 = { isbn, author: 'auth', title: 'old title' };
    const book2 = { isbn: 'isbn2', author: 'auth', title: 'other book' };
    const books = [book1, book2];
    expect(reducer({ books: books }, { type: PATCH_BOOK, isbn, patch })).toEqual({
      books: [
        { isbn, author: 'auth', title: 'new title' },
        book2
      ]
    });
  });

  describe('when the book to hide is selected', () => {
    const books = [{ isbn: 'isbn1' }, { isbn: 'isbn2' }];
    const state = { books, selected: 'isbn1' };

    it('HIDE_BOOK deletes the book, sets selected to null and sets tooSlow flag up', () =>
      expect(reducer(state, { type: HIDE_BOOK, isbn: 'isbn1' })).toEqual({
        books: [{ isbn: 'isbn2' }],
        selected: null,
        tooSlow: true
      }));
  });

  describe('when the book to hide is not selected', () => {
    const books = [{ isbn: 'isbn1' }, { isbn: 'isbn2' }];
    const state = { books, selected: 'isbn2' };

    it('HIDE_BOOK deletes the book and does not modify isbn2', () =>
      expect(reducer(state, { type: HIDE_BOOK, isbn: 'isbn1' })).toEqual({
        books: [{ isbn: 'isbn2' }],
        selected: 'isbn2'
      }));
  });

  it('CONFIRM_TOO_SLOW sets tooSlow to false', () =>
    expect(reducer({ tooSlow: true }, { type: CONFIRM_TOO_SLOW })).toEqual({
      tooSlow: false
    }));

  it('ADD_BOOK inserts a new book to books and orders them by author', () => {
    const books = [{ isbn: 'isbn1', author: 'b' }];
    const book = { isbn: 'isbn2', author: 'a' };
    expect(reducer({ books }, { type: ADD_BOOK, book })).toEqual({
      books: [book, { isbn: 'isbn1', author: 'b' }]
    });
  });

  it('ADD_BOOK replaces an existing book in books by isbn', () => {
    const books = [{ isbn: 'isbn1', author: 'a' }, { isbn: 'isbn2', author: 'b' }];
    const book = { isbn: 'isbn1', author: 'c' };
    expect(reducer({ books }, { type: ADD_BOOK, book })).toEqual({
      books: [
        { isbn: 'isbn2', author: 'b' },
        { isbn: 'isbn1', author: 'c' }
      ]
    });
  });

  it('CONFIRM_MARK_DELIVERED sets markDelivered to the reserver', () =>
    expect(reducer({}, { type: CONFIRM_MARK_DELIVERED, reserver: 'reserver sha' })).toEqual({
      markDelivered: 'reserver sha'
    }));

  it('CANCEL_MARK_DELIVERED sets markDelivered to null', () =>
    expect(reducer({}, { type: CANCEL_MARK_DELIVERED })).toEqual({
      markDelivered: null
    }));

  it('DELETE_BOOK deletes books which are reserved by the given reserver and sets markDelivered to null', () => {
    const reserver = 'reserver sha';
    const books = [
      { isbn: 'isbn1', reserver },
      { isbn: 'isbn2', reserver: 'other reserver sha' },
      { isbn: 'isbn3' }
    ];
    expect(reducer({ books }, { type: DELETE_BOOK, reserver })).toEqual({
      books: [
        { isbn: 'isbn2', reserver: 'other reserver sha' },
        { isbn: 'isbn3' }
      ],
      markDelivered: null
    });
  });
});