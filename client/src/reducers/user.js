const initialState = {
  errors: {},
  loggingOut: false,
  loggedOut: false,
  loggingIn: false,
  onSuccess: null,
  isbn: null
};

export default (state = initialState, action) => {
  const { field, message } = action;
  switch (action.type) {
    case 'LOGIN_ERROR':
      const newErrors = { ...state.errors, [field]: message};
      return { ...state, errors: newErrors};
    case 'CLEAR_LOGIN_ERROR':
      const { errors, ...clearedErrors} = state;
      return { ...clearedErrors, errors: {} };
    case 'LOG_OUT':
      return { ...state, loggingOut: true };
    case 'CANCEL_LOGOUT':
      return { ...state, loggingOut: false };
    case 'LOGGED_OUT':
      return { ...state, loggingOut: false, loggedOut: true };
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
