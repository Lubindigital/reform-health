import { createClient, type SanityClient } from "next-sanity";
import { apiVersion } from "./env";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

let _client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (!projectId || projectId === "placeholder") return null;
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion,
      // CDN serves cached responses for ~60s; turn it off so CMS publishes are
      // visible on the next request instead of after a stale window.
      useCdn: false,
    });
  }
  return _client;
}

export async function sanityFetch<T>(query: string, params?: Record<string, string>): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try {
    // 3-second timeout so a slow/unreachable Sanity API can't hang page renders.
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const fetchPromise = params ? c.fetch<T>(query, params) : c.fetch<T>(query);
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
