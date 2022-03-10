const {
    createProxyMiddleware
  } = require('http-proxy-middleware')
  
  module.exports = (req, res) => {
    let target = ''
    if (req.url.startsWith('/api')) {
      target = 'http://192.168.10.16:7001'
    }
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api'
      }
    })(req, res)
  }