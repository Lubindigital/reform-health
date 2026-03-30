import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

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
