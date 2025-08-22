import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
      {
        source: '/stockoverview/:path*',
        destination: 'http://localhost:4000/stockoverview/:path*',
      },
    ];
  },
};

export default nextConfig;
