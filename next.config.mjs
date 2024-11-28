/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Remove console logs only in production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;