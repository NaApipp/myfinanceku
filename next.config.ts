// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  allowedDevOrigins: ['192.168.18.11'],
};

export default nextConfig;
