import agent from '../agent';

const initialState = {
  books: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'BOOKS_VIEW_LOADED':
      return { ...state, books: action.payload };
    default:
      return state;
  }
}

export const getBooks = () => {
  return async dispatch => {
    const payload = await agent.Books.all();
    dispatch({ type: 'BOOKS_VIEW_LOADED', payload })
  };
};