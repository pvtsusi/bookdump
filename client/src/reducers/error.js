export const SHOW_ERROR = 'SHOW_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export default (state = { error: null }, action) => {
  switch (action.type) {
    case SHOW_ERROR:
      return { ...state, error: action.error };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};
