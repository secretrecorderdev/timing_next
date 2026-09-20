import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.TIMING_NODE_API_BASE_URL ?? "http://127.0.0.1:8082";
const allowedDevOrigin = process.env.TIMING_ALLOWED_DEV_ORIGIN;

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: allowedDevOrigin ? [allowedDevOrigin] : undefined,
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