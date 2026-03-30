import { createClient, type SanityClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

let _client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (!projectId || projectId === "placeholder") return null;
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    });
  }
  return _client;
}

export async function sanityFetch<T>(query: string, params?: Record<string, string>): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try {
    if (params) {
      return await c.fetch<T>(query, params);
    }
    return await c.fetch<T>(query);
  } catch {
    return null;
  }
}

// GROQ queries
export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  subtitle,
  "slug": slug.current,
  category,
  author,
  authorRole,
  publishedAt,
  readTime,
  excerpt
}`;

export const BLOG_POST_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  subtitle,
  "slug": slug.current,
  category,
  author,
  authorRole,
  publishedAt,
  readTime,
  excerpt,
  body
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  heroHeadline,
  heroDescription,
  rotatingWords,
  contactPhone,
  contactLocation,
  ctaHeadline,
  ctaDescription
}`;
