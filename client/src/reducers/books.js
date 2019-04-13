import agent from '../agent';

const initialState = {
  selected: null,
  editing: null,
  tooSlow: false,
  booksByReserver: {}
};

export default (state = initialState, action) => {
  const { field, value, patch } = action;
  const updateField = (f, v) =>
    (state.books || []).map((book) => {
      if (book.isbn === action.book.isbn) {
        return {...book, [f]: v};
      } else {
        return book;
      }
    });

  const patchBook = () =>
    (state.books || []).map((book) => {
      if (book.isbn === action.isbn) {
        return {...book, ...patch};
      } else {
        return book;
      }
    });

  const deleteReserver = () =>
    (state.books || []).map((book) => {
      if (book.isbn === action.book.isbn) {
        const {reserver, reserverName, ...clearedBook} = book;
        return clearedBook;
      } else {
        return book;
      }
    });

  const groupByReserver = () =>
    (action.books || [])
      .filter(book => book.reserver)
      .reduce((acc, curr) => {
        (acc[curr.reserver] = acc[curr.reserver] || []).push(curr);
        return acc;
      }, {});

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
      return sortableTitle(a.title).localeCompare(b.title);
    });

  const upsert = () => {
    const upserted = (state.books || []).filter((book) => action.book.isbn !== book.isbn);
    upserted.push(action.book);
    return sortedByAuthor(upserted);
  };

  switch (action.type) {
    case 'BOOKS_VIEW_LOADED':
      return { ...state, books: sortedByAuthor(action.books), booksByReserver: groupByReserver() };
    case 'BOOKS_VIEW_ERROR':
      return { ...state, error: action.error };
    case 'SELECT_BOOK':
      return { ...state, selected: action.book.isbn };
    case 'DESELECT_BOOK':
      return { ...state, selected: null };
    case 'EDIT_BOOK':
      return { ...state, editing: field };
    case 'UPDATE_BOOK':
      return { ...state, books: updateField(field, value), editing: null };
    case 'RESERVE_BOOK':
      return { ...state, books: updateField('reserverName', action.name), editing: null };
    case 'DECLINE_BOOK':
      return { ...state, books: deleteReserver(), editing: null };
    case 'PATCH_BOOK':
      return { ...state, books: patchBook() };
    case 'HIDE_BOOK':
      const tooSlow = state.selected === action.isbn;
      return {
        ...state,
        books: (state.books || []).filter(book => book.isbn !== action.isbn),
        tooSlow: tooSlow || state.tooSlow,
        selected: tooSlow ? null : state.selected
      };
    case 'CONFIRM_TOO_SLOW':
      return { ...state, tooSlow: false };
    case 'ADD_BOOK':
      return { ...state, books: upsert() };
    default:
      return state;
  }
}

export const getBooks = () => {
  return async dispatch => {
    try {
      const books = await agent.Books.all();
      dispatch({ type: 'BOOKS_VIEW_LOADED', books });
    } catch (err) {
      dispatch({ type: 'BOOKS_VIEW_ERROR', error: err.statusText});
    }
  };
};

export const selectBook = (book) => {
  return async dispatch => {
    dispatch({ type: 'SELECT_BOOK', book });
  };
};

export const deselectBook = (book) => {
  return async dispatch => {
    dispatch({ type: 'DESELECT_BOOK', book });
  };
};

export const editBook = (field) => {
  return async dispatch => {
    dispatch({ type: 'EDIT_BOOK', field});
  }
};

export const updateBook = (book, field, value) => {
  return async dispatch => {
    await agent.Books.update(book.isbn, field, value);
    dispatch({ type: 'UPDATE_BOOK', book, field, value});
  }
};

export const reserveBook = (book) => {
  return async dispatch => {
    try {
      const {name} = await agent.Books.reserve(book.isbn);
      dispatch({ type: 'RESERVE_BOOK', book, name});
    } catch (err) {
      if (err.status === 401) {
        dispatch({ type: 'LOG_IN', onSuccess: 'reserve', isbn: book.isbn})
      } else {
        throw err;
      }
    }
  }
};

export const declineBook = (book) => {
  return async dispatch => {
    try {
      await agent.Books.decline(book.isbn);
      dispatch({type: 'DECLINE_BOOK', book});
    } catch (err) {
      if (err.status === 401) {
        dispatch({ type: 'LOG_IN', onSuccess: 'decline', isbn: book.isbn})
      } else {
        throw err;
      }

    }
  }
};