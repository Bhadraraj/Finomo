/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/school-management' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/school-management' : '',
  
  images: { 
    unoptimized: true 
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  swcMinify: true,
};

module.exports = nextConfig;    