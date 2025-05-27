// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zcoder-backend-9aq1.onrender.com/api/:path*', // Proxy to backend
      },
    ];
  },
};

module.exports = nextConfig;
