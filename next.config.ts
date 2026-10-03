import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev assets are tied to localhost. Agents and browsers also open 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
