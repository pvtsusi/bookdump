import agent from '../agent';

const initialState = {
  selected: null,
  editing: null
};

export default (state = initialState, action) => {
  const { field, value } = action;
  const updateField = (f, v) =>
    (state.books || []).map((book) => {
      if (book.isbn === action.book.isbn) {
        return {...book, [f]: v};
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

  switch (action.type) {
    case 'BOOKS_VIEW_LOADED':
      return { ...state, books: action.payload };
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
    default:
      return state;
  }
}

export const getBooks = () => {
  return async dispatch => {
    try {
      const payload = await agent.Books.all();
      dispatch({ type: 'BOOKS_VIEW_LOADED', payload });
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