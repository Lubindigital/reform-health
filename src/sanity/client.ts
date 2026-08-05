import { client } from "./lib/client";

/**
 * Safe read helper. Returns `null` rather than throwing, and gives up after 3
 * seconds, so a slow or unreachable Sanity API degrades to the hardcoded
 * content in src/data/ instead of hanging or 500-ing the render.
 *
 * Keep this contract. next-sanity's own `sanityFetch` (from defineLive) has no
 * timeout and no try/catch — it lets rejections propagate. Since the pages that
 * call this are `force-dynamic`, there is no cached copy to fall back on, so
 * adopting the raw version unguarded would turn a Sanity incident into a
 * site-wide outage. When Live Content is wired up, wrap it rather than replace
 * this.
 */
export async function sanityFetch<T>(query: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const fetchPromise = params ? client.fetch<T>(query, params) : client.fetch<T>(query);
    const result = await Promise.race([fetchPromise, timeout]);
    return (result ?? null) as T | null;
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
  excerpt,
  "image": mainImage.asset->url,
  "imageAlt": mainImage.alt
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
  "image": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  body
}`;

export const EVENTS_QUERY = `*[_type == "event"] | order(startDate asc) {
  _id,
  title,
  emphasisWord,
  eyebrow,
  "slug": slug.current,
  format,
  startDate,
  timeLabel,
  timeZone,
  location,
  locationNote,
  description,
  isFree,
  registrationUrl,
  "hasRegistration": defined(meetingLink),
  host,
  speakers,
  "image": image.asset->url
}`;

// Public single-event fields for the registration page. Deliberately excludes
// meetingLink so the private join link never reaches the client.
export const EVENT_BY_SLUG_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  title,
  eyebrow,
  "slug": slug.current,
  format,
  startDate,
  timeLabel,
  timeZone,
  location,
  description,
  isFree,
  host
}`;

// SERVER-ONLY. Returns the private join link for a single event. Call this only
// from the registration API route, never from a page or client component.
export const EVENT_MEETING_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  "meetingLink": meetingLink,
  startsAt,
  endsAt,
  timeLabel,
  timeZone,
  startDate,
  location
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
