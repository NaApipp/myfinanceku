// next.config.ts

import type { NextConfig } from "next";
// import withPWAInit from "next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
//   fallbacks: {
//     document: "/offline",
//   },
// });

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  experimental: {
    // any other experimental features
  }
};

export default nextConfig;
