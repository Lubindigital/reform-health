import Link from "next/link";

/**
 * Visible marker that the page is showing unpublished content, with the only
 * way back out.
 *
 * Sanity's Presentation tool never calls a disable endpoint — the option exists
 * in its config types but is marked not-implemented — so without this link an
 * editor who opens the real site after previewing keeps seeing drafts, and
 * every request they make bypasses the CDN. That is easy to mistake for the
 * site being broken.
 *
 * Hidden inside the Presentation iframe, where the Studio already makes the
 * draft state obvious and the banner would just cover the page being edited.
 */
export function DraftModeBanner() {
  return (
    <div
      data-sanity-hide-in-presentation
      className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-lg"
    >
      <span className="font-semibold">Draft preview</span>
      <span className="text-amber-800">You are seeing unpublished changes.</span>
      <Link
        href="/api/draft-mode/disable"
        prefetch={false}
        className="rounded-full bg-amber-900 px-3 py-1 text-xs font-semibold text-amber-50 transition-colors hover:bg-amber-800"
      >
        Exit
      </Link>
    </div>
  );
}
