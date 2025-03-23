import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: [
      "puppeteer-extra",
      "puppeteer-extra-plugin-stealth",
      "puppeteer-extra-plugin-recaptcha",
    ],
  },
  images: {
    remotePatterns: [
      // exact match `example.com`
      { hostname: "example.com" },
      // wildcard subdomains to match all facebook avatars
      { hostname: "**.fbcdn.net" },
      // wildcard the region to match all bitbucket avatars
      { hostname: "avatar-management--avatars.*.prod.public.atl-paas.net" },
      // exact match hostname but wildcard path to match the account
      { hostname: "www.datocms-assets.com", pathname: "/13375P34K/**" },
      // exact match protocol and domain
      { protocol: "https", hostname: "assets.vercel.com" },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;
