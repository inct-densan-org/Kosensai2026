import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  experimental: {
    workerThreads: false,
    cpus: 4,
  },
};

export default nextConfig;
