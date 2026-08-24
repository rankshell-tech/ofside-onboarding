import type { MetadataRoute } from "next";
import { EVENT } from "@/lib/eventConfig";

const SITE_URL = "https://ofside.in";

/** Public, indexable marketing / policy routes only. */
const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/players", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.8 },
  {
    path: `/events/${EVENT.path}`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    path: "/events/sessions/terms",
    changeFrequency: "monthly",
    priority: 0.5,
  },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.4 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/rescheduling-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/delete-account", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
