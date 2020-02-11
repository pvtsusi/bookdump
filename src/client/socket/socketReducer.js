import { SESSION_VALIDATED, VALIDATE_SESSION } from './socketConstants';

const initialState = {
  isValidatingSession: false,
  shouldLogin: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_SESSION:
      return {
        ...state,
        isValidatingSession: true
      };
    case SESSION_VALIDATED:
      return {
        ...state,
        isValidatingSession: false
      };
    default:
      return state;
  }
};

