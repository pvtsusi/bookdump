import {
  CANCEL_LOGIN,
  CANCEL_LOGOUT,
  CLEAR_LOGIN_ERROR,
  LOG_IN,
  LOG_OUT,
  LOGGED_IN,
  LOGGED_OUT,
  LOGIN_ERROR
} from './sessionsConstants';

const initialState = {
  errors: {},
  loggingOut: false,
  loggingIn: false,
  onSuccess: null,
  isbn: null
};

export default (state = initialState, action) => {
  const { field, message } = action;
  switch (action.type) {
    case LOG_IN:
      return { ...state, loggingIn: true, onSuccess: action.onSuccess, isbn: action.isbn };
    case LOGIN_ERROR:
      const newErrors = { ...state.errors, [field]: message };
      return { ...state, errors: newErrors };
    case CLEAR_LOGIN_ERROR:
      return { ...state, errors: {} };
    case LOG_OUT:
      return { ...state, loggingOut: true };
    case CANCEL_LOGOUT:
      return { ...state, loggingOut: false };
    case LOGGED_OUT:
      return { ...state, loggingOut: false };
    case CANCEL_LOGIN:
      return { ...state, loggingIn: false, onSuccess: null, isbn: null };
    case LOGGED_IN:
      return { ...state, loggingIn: false, onSuccess: null, isbn: null };
    default:
      return state;
  }
}
