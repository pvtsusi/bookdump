import {
  BOOKS_VIEW_ERROR,
  BOOKS_VIEW_LOADED,
  DESELECT_BOOK,
  EDIT_BOOK,
  SELECT_BOOK,
  UPDATE_BOOK
} from './booksConstants';
import reducer from './booksReducer';
import * as types from './booksConstants';

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
      const {books, editing, ...others} = reduced;
      expect(others).toEqual({});
    });
  });
});