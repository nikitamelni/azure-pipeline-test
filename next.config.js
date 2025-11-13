/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*" }],
  },
};

module.exports = nextConfig;
