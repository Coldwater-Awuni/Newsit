import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Prevent 'async_hooks' from being bundled on the client
      config.resolve.alias = {
        ...config.resolve.alias,
        'async_hooks': false,
      };
    }
    // Required for Genkit plugins that might use gRPC
    config.externals = [...config.externals, 'pg-hstore'];
    return config;
  },
};

export default nextConfig;
