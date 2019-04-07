import agent from '../agent';

const initialState = {
  selected: null,
  editing: null
};

function updateField(books, isbn, field, value) {
  return (books || []).map((book) => {
    if (book.isbn === isbn) {
      return {...book, [field]: value};
    } else {
      return book;
    }
  });
}


export default (state = initialState, action) => {
  const { field, value } = action;
  switch (action.type) {
    case 'BOOKS_VIEW_LOADED':
      return { ...state, books: action.payload };
    case 'SELECT_BOOK':
      return { ...state, selected: action.book.isbn };
    case 'DESELECT_BOOK':
      return { ...state, selected: null };
    case 'EDIT_BOOK':
      return { ...state, editing: field };
    case 'UPDATE_BOOK':
      return { ...state, books: updateField(state.books, action.book.isbn, field, value), editing: null };
    case 'RESERVE_BOOK':
      return { ...state, books: updateField(state.books, action.book.isbn, 'reserver', action.name), editing: null };
    default:
      return state;
  }
}

export const getBooks = () => {
  return async dispatch => {
    const payload = await agent.Books.all();
    dispatch({ type: 'BOOKS_VIEW_LOADED', payload });
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
    const { name } = await agent.Books.reserve(book.isbn);
    dispatch({ type: 'RESERVE_BOOK', book, name});
  }
};