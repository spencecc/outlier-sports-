import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://copaceticsports.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/plays`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/track-record`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/bet-log`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/reports`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/updates`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/legal/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
