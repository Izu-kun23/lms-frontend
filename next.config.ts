import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose API base URL to both client and server code
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://lmsbackend-dev.up.railway.app/api",
  },
};

export default nextConfig;
