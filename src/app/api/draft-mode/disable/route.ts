import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Exit draft mode.
 *
 * Hand-written on purpose: next-sanity ships `defineEnableDraftMode` but has no
 * disable counterpart, and Sanity's `previewUrl.previewMode.disable` option is
 * marked not-implemented — the Presentation tool never calls it. Without this
 * route the only way out of draft mode is clearing cookies, and a stale draft
 * cookie means an editor keeps seeing unpublished content on the real site and
 * bypasses the CDN on every request.
 */
export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  // Resolve the requested path against this origin and compare origins, rather
  // than prefix-matching on "/". A startsWith("/") check looks right and is not:
  // `//evil.example.com` and `/\evil.example.com` both begin with a slash and
  // both are treated by browsers as protocol-relative absolute URLs, which made
  // this an open redirect on a domain used for outreach to employers.
  const here = new URL(request.url);
  const requested = here.searchParams.get("returnTo") || "/";

  let target = "/";
  try {
    const resolved = new URL(requested, here);
    if (resolved.origin === here.origin) {
      target = resolved.pathname + resolved.search + resolved.hash;
    }
  } catch {
    // Unparseable input falls through to "/".
  }

  redirect(target);
}
