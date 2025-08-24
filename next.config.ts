import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
      {
        source: '/stockoverview/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/stockoverview/:path*`,
      },
    ];
  },
};

export default nextConfig;
