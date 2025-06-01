/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'http',
            hostname: 'mike-pc.local',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'gallery-backend-teal.vercel.app',
            port: '',
            pathname: '/**',
          }
        ],
      },
      staticPageGenerationTimeout: 120,
      async rewrites() {
        return [
          {
            source: '/gallery/:path*',
            destination: 'https://gallery-backend-teal.vercel.app/gallery/:path*'
          }
        ]
      }
};

export default nextConfig;
