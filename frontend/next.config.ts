import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@dnd-kit/core', '@dnd-kit/sortable'],
  webpack: (config) => {
    config.resolve.alias['@dnd-kit'] = 'node_modules/@dnd-kit'
    return config
  },
}

export default nextConfig;