import type { MetadataRoute } from "next";

const SITE_URL = "https://ofside.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/onboarding",
          "/invite",
          "/scoring/",
          "/live-score",
          "/score/",
          "/nearYou/",
          "/thank-you",
          "/community",
          "/events/sessions/ticket/",
          "/events/sessions-badminton-doubles-rackonnect-delhi-22-aug-2026-test",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
