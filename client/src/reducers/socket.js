import * as Actions from '../actions';
import {sessionService} from 'redux-react-session';

const initialState = {
  isPoking: false,
  isValidatingSession: false,
  shouldLogin: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Actions.POKE:
      return {
        ...state,
        isPoking: true
      };
    case Actions.KICKBACK:
      return {
        ...state,
        kickback: action.data,
        isPoking: false
      };
    case 'VALIDATE_SESSION':
      return {
        ...state,
        isValidatingSession: true
      };
    case 'SESSION_VALIDATED':
      return {
        ...state,
        isValidatingSession: false
      };
    default:
      return state;
  }
};

export const kickback = (data) => {
  return dispatch => {
    dispatch(Actions.kickback(data));
  };
};

export const isValidSession = (options) => {
  return async dispatch => {
    try {
      const user = await sessionService.loadUser();
      if (!user || !user.admin) {
        return;
      }
      const session = await sessionService.loadSession();
      if (session.token) {
        dispatch({ type: 'VALIDATE_SESSION' });
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
