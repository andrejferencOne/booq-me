import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-auth', 'better-auth/react', 'better-auth/cookies', 'better-auth/next-js'],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
