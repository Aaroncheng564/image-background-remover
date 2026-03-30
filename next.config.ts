import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'image-background-remover.faguemcquade.workers.dev',
    'imagebackgroundremover.art',
    '*.pages.dev',
    'localhost:3000',
    'localhost:3001',
  ],
  // Remove 'standalone' for Cloudflare Pages
  // output: 'standalone',  
};

export default nextConfig;
