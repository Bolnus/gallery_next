/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '3001',
            pathname: '/**',
          },
          {
            protocol: 'http',
            hostname: 'mike-pc.local',
            port: '3001',
            pathname: '/**',
          }
        ],
      }
};

export default nextConfig;
