import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Enables optimized standalone build for Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: false, // Disable source maps in production for basic protection
};

export default nextConfig;
