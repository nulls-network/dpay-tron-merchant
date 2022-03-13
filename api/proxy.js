const {
  createProxyMiddleware,
} = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''
  if (req.url.startsWith('/api'))
    target = 'http://api-tron-v1.dpay.systems'

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api',
    },
  })(req, res)
}
