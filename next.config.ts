import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/login', destination: '/auth/login', permanent: false },
      { source: '/signup', destination: '/auth/register', permanent: false },
      { source: '/forgot-password', destination: '/auth/forgot-password', permanent: false },
      { source: '/reset-password', destination: '/auth/reset-password', permanent: false },
      { source: '/select-organization', destination: '/auth/select-organization', permanent: false },
      { source: '/mfa', destination: '/auth/mfa-verify', permanent: false },
    ]
  },
};

export default nextConfig;
