/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  optimizeFonts: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

module.exports = nextConfig;
