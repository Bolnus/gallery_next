/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/app/request.ts");
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "mike-pc.local",
        port: "3001",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "mike-pc.local",
        port: "",
        pathname: "/**"
      },
      {
        hostname: "recipes-rho-ten.vercel.app",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "gallery-backend-teal.vercel.app",
        pathname: "/**"
      }
    ],
    // domains: ["localhost", "mike-pc.local", "recipes-rho-ten.vercel.app", "gallery-backend-teal.vercel.app"],
    qualities: [50, 100],
    dangerouslyAllowLocalIP: true
  },
  staticPageGenerationTimeout: 120,
  async rewrites() {
    return [
      {
        source: "/gallery/:path*",
        destination: "https://gallery-backend-teal.vercel.app/gallery/:path*"
      }
    ];
  },
  // headers: [
  //   {
  //     source: "/gallery/:path*",
  //     headers: [
  //       { key: "Access-Control-Allow-Credentials", value: "true" },
  //       { key: "Access-Control-Allow-Origin", value: "https://recipes-rho-ten.vercel.app" },
  //       { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
  //       {
  //         key: "Access-Control-Allow-Headers",
  //         value:
  //           "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie"
  //       }
  //     ]
  //   }
  // ]
};

export default withNextIntl(nextConfig);
