import { defineLive } from "next-sanity/live";
import { client } from "./client";

/**
 * Live Content wiring for draft previews and the Presentation tool.
 *
 * `sanityFetch` here is draft-aware: outside draft mode it returns published
 * content from the CDN, and inside draft mode it returns drafts and encodes
 * stega markers so the Presentation overlay can map rendered text back to the
 * field that produced it. `<SanityLive />` opens the event stream that keeps
 * both cases fresh.
 *
 * `browserToken` is required, not optional, and it was a mistake to omit it.
 * `<SanityLive>`'s `includeDrafts` only defaults to true when a `browserToken`
 * is configured; without one the live connection subscribes to published events
 * ONLY, so editing a draft fires nothing and the Presentation preview never
 * refreshes. That is the whole feature.
 *
 * It was left out over a concern that a browser-exposed Viewer token can run
 * arbitrary GROQ across the dataset, including the `drafts.*` documents holding
 * contact and registration PII (see writeClient.ts). That concern does not hold
 * up: the token is only handed to the browser once draft mode is active, draft
 * mode can only be entered through /api/draft-mode/enable with a one-time
 * secret, and minting that secret requires an authenticated Studio session. So
 * the only people who can obtain this token are project members who can already
 * read every document directly in the Studio. It grants them nothing new.
 *
 * It must stay a Viewer token. A write token here would be a genuine escalation.
 */
export const { sanityFetch: liveFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
});

/**
 * Draft-aware fetch that still degrades gracefully.
 *
 * `liveFetch` has no timeout and no try/catch — it lets rejections propagate.
 * The pages using it are `force-dynamic`, so there is no cached copy to fall
 * back on, and a Sanity incident would turn into a 500 on the homepage rather
 * than a page rendered from the hardcoded defaults in src/data/. This keeps the
 * same contract the rest of the app already relies on: return null, never throw,
 * give up after 3 seconds.
 *
 * SERVER ONLY. `next-sanity/live` resolves through a `react-server` export
 * condition whose client build throws at runtime, so never import this from a
 * component marked 'use client'.
 */
export async function draftAwareFetch<T>(
  query: string,
  params?: Record<string, string>,
): Promise<T | null> {
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
    const request = liveFetch({ query, params }).then((result) => result.data as T);
    const result = await Promise.race([request, timeout]);
    return (result ?? null) as T | null;
  } catch {
    return null;
  }
}
