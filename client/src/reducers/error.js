export default (state = { error: null }, action) => {
  switch (action.type) {
    case 'SHOW_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};
