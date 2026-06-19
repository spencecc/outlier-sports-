import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Short, email-friendly URL for the legal disclaimer.
      { source: "/disclaimer", destination: "/legal/disclaimer", permanent: true },
    ];
  },
};

export default nextConfig;
