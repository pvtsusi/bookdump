import { sessionService } from 'redux-react-session';
import { SESSION_VALIDATED, VALIDATE_SESSION } from './socketConstants';

const { loadUser, loadSession } = sessionService;

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

export const sessionValidated = () => dispatch => dispatch({ type: SESSION_VALIDATED });