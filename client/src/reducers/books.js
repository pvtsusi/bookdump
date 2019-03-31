import agent from '../agent';

const initialState = {
  selected: null
};

export default (state = {}, action) => {
  switch (action.type) {
    case 'BOOKS_VIEW_LOADED':
      return { ...state, books: action.payload };
    case 'SELECT_BOOK':
      return { ...state, selected: action.book };
    case 'DESELECT_BOOK':
      return { ...state, selected: null };
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
