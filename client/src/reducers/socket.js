import { sessionService } from 'redux-react-session';

const { loadUser, loadSession } = sessionService;

const VALIDATE_SESSION = 'VALIDATE_SESSION';
export const SESSION_VALIDATED = 'SESSION_VALIDATED';

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

export const isValidSession = (options) => {
  return async dispatch => {
    try {
      const user = await loadUser();
      if (!user || !user.admin) {
        return;
      }
      const session = await loadSession();
      if (session.token) {
        dispatch({ type: VALIDATE_SESSION });
        const { socket } = options;
        delete options.socket;
        options.token = session.token;
        socket.emit('validate_session', options);
      }
    } catch {
      // No session, do nothing.
    }
  };
};
