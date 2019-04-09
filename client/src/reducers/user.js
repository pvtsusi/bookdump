export default (state = { errors: {}, loggedOut: false }, action) => {
  const { field, message } = action;
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
    default:
      return state;
  }
}
