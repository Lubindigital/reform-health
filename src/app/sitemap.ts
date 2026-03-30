import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.reformnv.org", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://www.reformnv.org/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://www.reformnv.org/blog/our-blueprint", lastModified: new Date("2026-03-14"), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://www.reformnv.org/blog/pricing-myths", lastModified: new Date("2026-02-17"), changeFrequency: "monthly", priority: 0.7 },
  ];
}
