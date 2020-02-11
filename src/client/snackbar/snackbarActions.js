import { CLEAR_SNACKBAR, SHOW_SNACKBAR } from './snackbarConstants';

export const showSnackbar = (key, message) => dispatch => dispatch({ type: SHOW_SNACKBAR, key, message });
export const clearSnackbar = key => dispatch => dispatch({ type: CLEAR_SNACKBAR, key });
