const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://tkb-backend-1:3001', // Backend container internal port
      changeOrigin: true,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.writeHead(503, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Backend service unavailable' }));
      }
    })
  );
};