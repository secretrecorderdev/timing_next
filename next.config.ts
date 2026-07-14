import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.TIMING_NODE_API_BASE_URL ?? "http://127.0.0.1:8082";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;