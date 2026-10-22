import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(dirname, "../.."),
  experimental: {
    workerThreads: false,
    cpus: 4,
  },
};

export default nextConfig;
