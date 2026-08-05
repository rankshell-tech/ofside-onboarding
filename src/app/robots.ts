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
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
