import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'image-background-remover-8wa.pages.dev',
    '*.pages.dev',
    'localhost:3000',
    'localhost:3001',
  ],
  output: 'standalone',
};

export default nextConfig;
