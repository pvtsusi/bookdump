const initialState = {
  errors: {},
  loggedOut: false,
  loggingIn: false,
  onSuccess: null,
  isbn: null
};

export default (state = initialState, action) => {
  const { field, message, onSuccess, isbn } = action;
  switch (action.type) {
    case 'LOGIN_ERROR':
      const newErrors = { ...state.errors, [field]: message};
      return { ...state, errors: newErrors};
    case 'CLEAR_LOGIN_ERROR':
      const { errors, ...clearedErrors} = state;
      return { ...clearedErrors, errors: {} };
    case 'LOGGED_OUT':
      return { ...state, loggedOut: true };
    case 'CONFIRM_LOGGED_OUT':
      return { ...state, loggedOut: false };
    case 'LOG_IN':
      return { ...state, loggingIn: true };
    case 'CANCEL_LOGIN':
      return { ...state, loggingIn: false };
    case 'LOGGED_IN':
      return { ...state, loggingIn: false };
    default:
      return state;
  }
}
