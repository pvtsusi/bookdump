export default (state = {}, action) => {
  switch (action.type) {
    case 'BOOKS_VIEW_LOADED':
      return { ...state, books: action.payload };
    default:
      return state;
  }
}