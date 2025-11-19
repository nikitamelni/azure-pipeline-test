import { NextConfig } from 'next';
import withTM from 'next-transpile-modules';
import localizationSettings from './src/i18n/locales.json';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*' }],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
  },
  i18n: {
    locales: localizationSettings?.locales,
    defaultLocale: localizationSettings?.defaultLocale,
    localeDetection: false,
  },
};

export default withTM(['@uniformdev/csk-components'])(nextConfig);
