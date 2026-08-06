import { defineDocuments, defineLocations } from "sanity/presentation";
import type { PresentationPluginOptions } from "sanity/presentation";

/**
 * Wiring between documents and the pages they appear on.
 *
 * `locations` powers the "Used on" panel — open a document and see where it
 * actually renders. That panel is also the cheapest way to catch a field that
 * has no consumer. This Studio has done that twice now: siteSettings.contactPhone
 * and contactLocation sat in the schema for months while the site read a
 * hardcoded constant, and then the P3 migration to homePage orphaned five more
 * fields while this very file kept pointing "/" at the dead document.
 *
 * `mainDocuments` is the reverse — it maps a URL in the preview iframe back to
 * the document to open in the editor.
 *
 * This module is pulled into the Studio's client bundle via sanity.config.ts,
 * so keep it free of server-only imports and of non-NEXT_PUBLIC env reads.
 */

// Note: there is deliberately no `/events/[slug]` route in this app. Events are
// listed on /events and each one links to /events/[slug]/register. A resolver
// copied from a tutorial would point at a 404.
export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    homePage: defineLocations({
      message: "Every section of the home page",
      tone: "positive",
      locations: [{ title: "Home page", href: "/" }],
    }),

    blogPost: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled post",
            href: `/blog/${doc?.slug}`,
          },
          { title: "Insights index", href: "/blog" },
        ],
      }),
    }),

    event: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: "Events", href: "/events" },
          {
            title: `Register — ${doc?.title || "Untitled event"}`,
            href: `/events/${doc?.slug}/register`,
          },
        ],
      }),
    }),
  },

  // Evaluated in order, first match wins — so the register route has to come
  // before the bare /events listing.
  mainDocuments: defineDocuments([
    {
      route: "/blog/:slug",
      filter: `_type == "blogPost" && slug.current == $slug`,
    },
    {
      route: "/events/:slug/register",
      filter: `_type == "event" && slug.current == $slug`,
    },
    {
      route: "/",
      filter: `_type == "homePage"`,
    },
  ]),
};
