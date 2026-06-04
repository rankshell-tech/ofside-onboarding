import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/live-score',
        destination: '/scoring/scoringScreen',
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
