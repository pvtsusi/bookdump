const POKE = 'poke';
const KICKBACK = 'kickback';

module.exports = client => {
  // Define the function here so we have client in our scope.
  const _poke = async data => {
    client.emit(KICKBACK, 'yow!');
  };
  console.log('Socket connection started!');
  client.on(POKE, _poke());
};