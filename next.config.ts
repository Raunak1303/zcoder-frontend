// next.config.ts

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,  // <-- Add this to ignore ESLint errors during build
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zcoder-backend-9aq1.onrender.com/api/:path*', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
