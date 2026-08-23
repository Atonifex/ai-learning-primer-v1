import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Parent ChatGPT_or_Coding/ also has a package-lock.json; pin this app so Turbopack
// does not resolve routes from the wrong workspace root.
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
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
