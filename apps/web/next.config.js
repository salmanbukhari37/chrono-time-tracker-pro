/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL
          ? `${process.env.API_URL}/:path*`
          : "http://localhost:3001/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
