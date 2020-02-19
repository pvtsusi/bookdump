import {
  updateBookField,
  patchBook,
  deleteReserver,
  deleteBooks,
  groupByReserver,
  existingReservations,
  sortedByAuthor,
  upsert
} from './booksHelpers';

describe('updateBookField()', () => {
  const isbn = 'isbn1';
  const field = 'field name';
  const value = 'new value';

  it('returns empty array for empty array', () =>
    expect(updateBookField([], isbn, field, value)).toEqual([]));

  it('modifies a field only in a book matching the given isbn', () => {
    const books = [
      { isbn: 'isbn1', [field]: 'old value' },
      { isbn: 'isbn2', [field]: 'other' }
    ];
    expect(updateBookField(books, isbn, field, value)).toEqual([
      { isbn: 'isbn1', [field]: value },
      { isbn: 'isbn2', [field]: 'other' }
    ]);
  });

  it('returns a new book object on modification', () => {
    const books = [{ isbn, [field]: 'old value' }];
    const modifiedBook = updateBookField(books, isbn, field, value)[0];
    expect(modifiedBook).toEqual({ isbn, [field]: value });
    expect(modifiedBook).not.toBe(books[0]);
  });

  it('returns a new book array on modification', () => {
    const books = [{ isbn, [field]: 'old value' }];
    expect(updateBookField(books, isbn, field, value)).not.toBe(books);
  });

  it('returns unmodified books array for isbn that is not found in books', () => {
    const books = [{ isbn: 'isbn2', [field]: 'old value' }];
    expect(updateBookField(books, isbn, field, value)).toEqual(books);
  });
});

describe('patchBook()', () => {
  const isbn = 'isbn1';
  const patch = {
    field1: 'new value',
    field2: 'new field'
  };

  it('returns empty array for empty array', () =>
    expect(patchBook([], isbn, patch)).toEqual([]));

  it('patches only a book matching the given isbn', () => {
    const books = [
      { isbn: 'isbn1', field1: 'old value' },
      { isbn: 'isbn2', field1: 'other' }
    ];
    expect(patchBook(books, isbn, patch)).toEqual([
      { isbn: 'isbn1', field1: 'new value', field2: 'new field' },
      { isbn: 'isbn2', field1: 'other' }
    ]);
  });

  it('returns a new book object on modification', () => {
    const books = [{ isbn }];
    const modifiedBook = patchBook(books, isbn, patch)[0];
    expect(modifiedBook).toEqual({ isbn, field1: 'new value', field2: 'new field' });
    expect(modifiedBook).not.toBe(books[0]);
  });

  it('returns a new book array on modification', () => {
    const books = [{ isbn }];
    expect(patchBook(books, patch)).not.toBe(books);
  });

  it('returns unmodified books array for isbn that is not found in books', () => {
    const books = [{ isbn: 'isbn2', field1: 'old value' }];
    expect(patchBook(books, isbn, patch)).toEqual(books);
  });
});

describe('deleteReserver()', () => {
  const isbn = 'isbn1';
  const reserver = 'reserver sha';
  const reserverName = 'Reserver Name';

  it('returns empty array for empty array', () =>
    expect(deleteReserver([], isbn)).toEqual([]));

  it('deletes only reserver and reserverName fields only from books matching the isbn', () => {
    const books = [
      { isbn, reserver, reserverName, field: 'other' },
      { isbn: 'isbn2', reserver, reserverName }
    ];
    expect(deleteReserver(books, isbn)).toEqual([
      { isbn, field: 'other' },
      { isbn: 'isbn2', reserver, reserverName }
    ]);
  });

  it('returns a new book on modification', () => {
    const books = [{ isbn, reserver, reserverName }];
    const modifiedBook = deleteReserver(books, isbn)[0];
    expect(modifiedBook).toEqual({ isbn });
    expect(modifiedBook).not.toBe(books[0]);
  });

  it('returns a new book array on modification', () => {
    const books = [{ isbn, reserver, reserverName }];
    expect(deleteReserver(books, isbn)).not.toBe(books);
  });

  it('returns unmodified books array for isbn that is not found in books', () => {
    const books = [{ isbn: 'isbn2', reserver, reserverName }];
    expect(deleteReserver(books, isbn)).toEqual(books);
  });
});

describe('deleteBooks()', () => {
  const reserver = 'reserver sha';

  it('returns empty array for empty array', () =>
    expect(deleteBooks([], reserver)).toEqual([]));

  it('deletes only the books that match the reserver', () => {
    const books = [
      { isbn: 'isbn1', reserver },
      { isbn: 'isbn2', reserver: 'other' },
      { isbn: 'isbn3' }
    ];
    expect(deleteBooks(books, reserver)).toEqual([
      { isbn: 'isbn2', reserver: 'other' },
      { isbn: 'isbn3' }
    ]);
  });

  it('returns a new book array on modification', () => {
    const books = [{ isbn: 'isbn1', reserver }, { isbn: 'isbn2' }];
    expect(deleteBooks(books, reserver)).not.toBe(books);
  });

  it('returns unmodified books array for reserver that is not found in books', () => {
    const books = [{ isbn: 'isbn1', reserver: 'other' }];
    expect(deleteBooks(books, reserver)).toEqual(books);
  });
});

describe('groupByReserver()', () => {
  it('returns empty object for empty array', () =>
    expect(groupByReserver([])).toEqual({}));

  it('returns object with reserver SHAs as keys and arrays of books as values', () => {
    const books = [
      { isbn: 'isbn1', reserver: 'a' },
      { isbn: 'isbn2', reserver: 'b' },
      { isbn: 'isbn3', reserver: 'a' },
      { isbn: 'isbn4' }
    ];
    expect(groupByReserver(books)).toEqual({
      a: [{ isbn: 'isbn1', reserver: 'a' }, { isbn: 'isbn3', reserver: 'a' }],
      b: [{ isbn: 'isbn2', reserver: 'b' }]
    });
  });
});

describe('existingReservations', () => {
  it('returns empty object for empty array', () =>
    expect(existingReservations([])).toEqual({}));

  it('returns an object with book ISBNs as keys for all books that have a reservation', () => {
    const books = [
      { isbn: 'isbn1', reserver: 'a' },
      { isbn: 'isbn2' },
      { isbn: 'isbn3', reserver: 'b' }
    ];
    expect(existingReservations(books)).toEqual({
      isbn1: 'exists',
      isbn3: 'exists'
    });
  });
});

describe('sortedByAuthor', () => {
  it('returns empty array for empty array', () =>
    expect(sortedByAuthor([])).toEqual([]));

  it('sorts primarily by the last name of the author, case insensitively', () => {
    const books = [
      { isbn: 'isbn1', title: 'x', author: 'Aa ba'},
      { isbn: 'isbn2', title: 'y', author: 'Aa Ca'},
      { isbn: 'isbn3', title: 'z', author: 'Ba de Aa'}
    ];
    expect(sortedByAuthor(books)).toEqual([
      { isbn: 'isbn3', title: 'z', author: 'Ba de Aa'},
      { isbn: 'isbn1', title: 'x', author: 'Aa ba'},
      { isbn: 'isbn2', title: 'y', author: 'Aa Ca'}
    ]);
  });

  it('if the last name is the same, sorts by the whole name of the author, case insensitively', () => {
    const books = [
      { isbn: 'isbn1', title: 'x', author: 'ba Aa'},
      { isbn: 'isbn1', title: 'y', author: 'Ca Aa'},
      { isbn: 'isbn3', title: 'z', author: 'Aa de Aa'}
    ];
    expect(sortedByAuthor(books)).toEqual([
      { isbn: 'isbn3', title: 'z', author: 'Aa de Aa'},
      { isbn: 'isbn1', title: 'x', author: 'ba Aa'},
      { isbn: 'isbn1', title: 'y', author: 'Ca Aa'},
    ]);
  });

  it('if the last name is the same, sorts by the whole name of the author, case insensitively', () => {
    const books = [
      { isbn: 'isbn1', title: 'x', author: 'ba Aa'},
      { isbn: 'isbn2', title: 'y', author: 'Ca Aa'},
      { isbn: 'isbn3', title: 'z', author: 'Aa de Aa'}
    ];
    expect(sortedByAuthor(books)).toEqual([
      { isbn: 'isbn3', title: 'z', author: 'Aa de Aa'},
      { isbn: 'isbn1', title: 'x', author: 'ba Aa'},
      { isbn: 'isbn2', title: 'y', author: 'Ca Aa'},
    ]);
  });

  it('if the author is the same, sort by title', () => {
    const books = [
      { isbn: 'isbn1', title: 'z', author: 'Aa'},
      { isbn: 'isbn2', title: 'x', author: 'Aa'},
      { isbn: 'isbn3', title: 'y', author: 'Aa'}
    ];
    expect(sortedByAuthor(books)).toEqual([
      { isbn: 'isbn2', title: 'x', author: 'Aa'},
      { isbn: 'isbn3', title: 'y', author: 'Aa'},
      { isbn: 'isbn1', title: 'z', author: 'Aa'}
    ]);
  });

  it('disregard English, Swedish and French articles in titles while sorting', () => {
    const books = [
      { isbn: 'isbn1', title: 'a z', author: 'Aa'},
      { isbn: 'isbn2', title: 'les x', author: 'Aa'},
      { isbn: 'isbn3', title: 'en y', author: 'Aa'}
    ];
    expect(sortedByAuthor(books)).toEqual([
      { isbn: 'isbn2', title: 'les x', author: 'Aa'},
      { isbn: 'isbn3', title: 'en y', author: 'Aa'},
      { isbn: 'isbn1', title: 'a z', author: 'Aa'}
    ]);
  });
});

describe('upsert()', () => {
  const isbn = 'isbn1';
  const book = { isbn, author: 'c' };

  describe('when the books does not already include a book with matching isbn', () => {
    const books = [
      { isbn: 'isbn2', author: 'a'},
      { isbn: 'isbn3', author: 'd'}
    ];

    it('adds the book and sorts them by author', () =>
      expect(upsert(books, book)).toEqual([
        { isbn: 'isbn2', author: 'a'},
        book,
        { isbn: 'isbn3', author: 'd'}
      ]));

    it('returns a modified books array', () =>
      expect(upsert(books, book)).not.toBe(books));
  });

  describe('when the books includes a book with matching isbn', () => {
    const books = [
      { isbn, author: 'a'},
      { isbn: 'isbn2', author: 'a'},
      { isbn: 'isbn3', author: 'd'}
    ];

    it('replaces the book matching the isbn sorts them by author', () =>
      expect(upsert(books, book)).toEqual([
        { isbn: 'isbn2', author: 'a'},
        book,
        { isbn: 'isbn3', author: 'd'}
      ]));

    it('returns a modified books array', () =>
      expect(upsert(books, book)).not.toBe(books));
  });
});