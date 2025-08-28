const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.NODE_ENV === 'production' 
        ? 'http://localhost:8113'  // For production/external access 
        : 'http://tkb-backend-1:3001', // For development in Docker
      changeOrigin: true,
      logLevel: 'debug',
      secure: false, // Allow proxy to HTTP from HTTPS
      onError: (err, req, res) => {
        console.error('Proxy error:', err.message);
        console.log('Trying to connect to:', err.config?.target || 'unknown');
        res.writeHead(503, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          error: 'Backend service unavailable',
          details: err.message 
        }));
      }
    })
  );
};