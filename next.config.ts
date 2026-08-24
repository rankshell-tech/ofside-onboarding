import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/live-score',
        destination: '/scoring/scoringScreen',
        permanent: false,
      },
      {
        source: '/events/sessions-badminton-doubles-rackonnect-delhi-22-aug-2026',
        destination: '/',
        permanent: false,
      },
      {
        source: '/events/sessions-badminton-doubles-rackonnect-delhi-22-aug-2026-test',
        destination: '/',
        permanent: false,
      },
      {
        source: '/events/ofside-open-2',
        destination: '/',
        permanent: false,
      },
      {
        source: '/events/ofside-open-2/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/events/sessions-badminton-doubles-delhi',
        destination: '/',
        permanent: false,
      },
      // VENUE PARTNER — disabled
      // {
      //   source: '/venue-partners',
      //   destination: '/',
      //   permanent: false,
      // },
      // {
      //   source: '/onboarding',
      //   destination: '/',
      //   permanent: false,
      // },
    ];
  },
};

export default nextConfig;
