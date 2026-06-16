// Content-Security-Policy. Allows the inline styles the app relies on (React
// `style={}` + framer-motion) and the Google Fonts CDN used in globals.css.
// connect-src covers the Stellar RPC/Horizon/Expert endpoints the client calls.
// NOTE: script-src keeps 'unsafe-inline' for Next's bootstrap scripts — tighten
// to a nonce-based policy (via middleware) as a follow-up.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.stellar.org https://stellar.expert",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Workspace packages are consumed as TypeScript source, so Next must
  // transpile them.
  transpilePackages: ['@signet/types', '@signet/ui', '@signet/sdk', '@signet/db'],
  // Fonts are loaded via @import in globals.css (not next/font), so there is no
  // build-time font download to optimize — the former `optimizeFonts` flag was
  // removed in Next 15.
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
