export const SHOW_SNACKBAR = 'SHOW_SNACKBAR';
export const CLEAR_SNACKBAR = 'CLEAR_SNACKBAR';

export const SNACKBAR_LOGGED_OUT = 'logged-out';
export const SNACKBAR_TOO_SLOW = 'too-slow';
export const SNACKBAR_ERROR = 'error';

export default (state = { }, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return { ...state, [action.key]: action.message };
    case CLEAR_SNACKBAR:
      return { ...state, [action.key]: undefined };
    default:
      return state;
  }
};
