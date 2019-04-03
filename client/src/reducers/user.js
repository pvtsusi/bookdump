export default (state = { errors: {} }, action) => {
  const { field, message } = action;
  switch (action.type) {
    case 'LOGIN_ERROR':
      const newErrors = { ...state.errors, [field]: message};
      return { ...state, errors: newErrors};
    case 'CLEAR_LOGIN_ERROR':
      const { errors, ...cleared} = state;
      return { ...cleared, errors: {} };
    default:
      return state;
  }
}
