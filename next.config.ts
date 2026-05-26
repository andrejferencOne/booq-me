import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-auth', 'better-auth/react', 'better-auth/cookies', 'better-auth/next-js'],
};

export default nextConfig;
