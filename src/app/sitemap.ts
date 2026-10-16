import type { MetadataRoute } from "next";
import { BLOG_POSTS_QUERY, sanityFetch } from "@/sanity/client";
import { blogPosts as fallbackPosts } from "@/data/blog";

const SITE_URL = "https://www.reformnv.org";

interface SitemapPost {
  slug: string;
  publishedAt?: string;
}

/**
 * Sanity posts merged over the hardcoded ones BY SLUG, the same rule /blog uses,
 * so a post published in Studio shows up here without a code change and the
 * posts still rendering from src/data/blog.ts are not dropped.
 */
async function getPostEntries(): Promise<MetadataRoute.Sitemap> {
  const bySlug = new Map<string, Date>();
  for (const p of fallbackPosts) bySlug.set(p.slug, new Date(p.date));
  try {
    const posts = await sanityFetch<SitemapPost[]>(BLOG_POSTS_QUERY);
    for (const p of posts ?? []) {
      if (!p.slug) continue;
      const d = p.publishedAt ? new Date(p.publishedAt) : new Date();
      bySlug.set(p.slug, Number.isNaN(d.getTime()) ? new Date() : d);
    }
  } catch {
    // Sanity unreachable: the static posts above still list.
  }
  return [...bySlug.entries()].map(([slug, lastModified]) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...(await getPostEntries()),
  ];
}
