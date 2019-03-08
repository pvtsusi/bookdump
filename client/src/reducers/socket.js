import * as Actions from '../actions';

const initialState = {
  isPoking: true
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
    default:
      return state;
  }
};

export const kickback = (data) => {
  return dispatch => {
    dispatch(Actions.kickback(data));
  };
};