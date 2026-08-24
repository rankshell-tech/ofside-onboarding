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
        source: '/events/ofside-open-2',
        destination: '/events/sessions-badminton-doubles-rackonnect-delhi-22-aug-2026',
        permanent: true,
      },
      {
        source: '/events/ofside-open-2/:path*',
        destination: '/events/sessions-badminton-doubles-rackonnect-delhi-22-aug-2026',
        permanent: true,
      },
      {
        source: '/events/sessions-badminton-doubles-delhi',
        destination: '/events/sessions-badminton-doubles-rackonnect-delhi-22-aug-2026',
        permanent: true,
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
