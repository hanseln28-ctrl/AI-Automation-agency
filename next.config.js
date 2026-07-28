/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // Transpile these packages through SWC to ensure ESM/CJS compatibility
  transpilePackages: ['recharts', 'framer-motion'],

  // Webpack: use Babel to transpile framer-motion source as a fallback
  // if SWC encounters parsing issues. Requires: bun add -D babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript
  webpack: (config, { isServer }) => {
    let hasBabelLoader = false;
    try {
      require.resolve('babel-loader');
      hasBabelLoader = true;
    } catch (_) {
      // babel-loader not installed — framer-motion will be handled by SWC
    }

    if (hasBabelLoader) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: [/node_modules\/framer-motion/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { node: '18' } }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
            },
          },
        ],
      });
    }
    return config;
  },
};

module.exports = nextConfig;
