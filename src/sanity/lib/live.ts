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
 * `browserToken` is deliberately `false`. It would hand a Viewer token to the
 * browser during draft mode, and a Viewer token can run arbitrary GROQ across
 * the whole dataset — including the `drafts.*` documents where every contact
 * and webinar registration now lives (see writeClient.ts). Sanity tokens have
 * no per-document scoping, so there is no safe way to share one here. The cost
 * is that standalone draft preview in a plain tab does not live-update; preview
 * inside the Presentation tool works, because that path uses `serverToken`.
 */
export const { sanityFetch: liveFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: false,
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
