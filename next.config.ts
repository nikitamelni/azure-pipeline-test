import { NextConfig } from 'next';
import withTM from 'next-transpile-modules';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  output: process.env.RUNNING_MODE === 'build' ? 'export' : undefined,
  trailingSlash: process.env.RUNNING_MODE === 'build' ? true : false, // This will generate /en/our-locations/index.html instead of /en/our-locations.html
  // Pin the Next.js BUILD_ID so any partial-redeploy work in the future keeps
  // _next/data/{BUILD_ID}/*.json paths and chunk manifests stable across builds.
  // CI passes BUILD_DEPLOY_ID (typically the git SHA); local builds fall back
  // to a constant so dev output is reproducible.
  generateBuildId: async () => process.env.BUILD_DEPLOY_ID || 'pfg-uniform-build',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*' }],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    unoptimized: true,
  },
};

export default withTM(['@uniformdev/csk-components'])(nextConfig);
