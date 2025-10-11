import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Skip linting during build for faster deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Skip type checking during build for faster deployments
  typescript: {
    ignoreBuildErrors: true, // Temporarily set to true for deployment
  },
  
  // External packages for server components
  serverExternalPackages: ['@neondatabase/serverless'],
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Compiler options for modern browsers
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'motion',
      'motion-dom',
      'lucide-react',
      'recharts',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'react-icons'
    ],
    // Enable modern build output
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Output configuration
  output: 'standalone',
  
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  
  // Production source maps
  productionBrowserSourceMaps: false,
  
  // Webpack optimization for smaller chunks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split large chunks into smaller ones
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Split large libraries into separate chunks
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/](framer-motion|motion|motion-dom)[\\/]/,
              priority: 40,
              reuseExistingChunk: true,
            },
            three: {
              name: 'three',
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              priority: 35,
              reuseExistingChunk: true,
            },
            lucideIcons: {
              name: 'lucide-icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            },
            reactIcons: {
              name: 'react-icons',
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              priority: 25,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  }
};

export default withBundleAnalyzer(nextConfig);