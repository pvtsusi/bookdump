export const POKE = 'poke';
export const KICKBACK = 'kickback';

export const poke = () => ({
  type: POKE
});

export const kickback = data => {
  return {
    type: KICKBACK,
    data
  };
};

export const doPoke = options => async dispatch => {
  dispatch(poke());

  const { socket } = options;
  delete options.socket;

  // Error handling...
  socket.emit(POKE, options);
};