const proxy = require('http-proxy-middleware');

const URI = process.env.REVERSE_PROXY_URI || 'http://localhost:5000';

module.exports = function(app) {
  const apiProxy = proxy('/api/', {target:URI});
  const wsProxy = proxy('/socket.io/', {ws:true, target:URI});
  app.use(apiProxy);
  app.use(wsProxy);
};
