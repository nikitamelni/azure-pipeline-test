import { NextConfig } from 'next';
import withTM from 'next-transpile-modules';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  output: process.env.RUNNING_MODE === 'build' ? 'export' : undefined,
  trailingSlash: process.env.RUNNING_MODE === 'build' ? true : false, // This will generate /en/our-locations/index.html instead of /en/our-locations.html
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*' }],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    unoptimized: true,
  },
};

export default withTM(['@uniformdev/csk-components'])(nextConfig);
