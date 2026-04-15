const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline'
  }
});

module.exports = withPWA({
  reactStrictMode: true,
});