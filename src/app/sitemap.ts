import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  return [
    {
      url: `${base}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/privacy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/schedule`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
