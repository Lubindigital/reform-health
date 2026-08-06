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

  const returnTo = new URL(request.url).searchParams.get("returnTo") || "/";
  // Only allow same-site paths, so this can't be used as an open redirect.
  redirect(returnTo.startsWith("/") ? returnTo : "/");
}
