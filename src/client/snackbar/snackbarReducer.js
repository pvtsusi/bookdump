import { CLEAR_SNACKBAR, SHOW_SNACKBAR } from './snackbarConstants';

export default (state = {}, action) => {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return { ...state, [action.key]: action.message };
    case CLEAR_SNACKBAR:
      return { ...state, [action.key]: undefined };
    default:
      return state;
  }
};
