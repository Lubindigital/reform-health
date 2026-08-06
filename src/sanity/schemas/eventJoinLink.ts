import { defineField, defineType } from "sanity";

/**
 * The private join link for a webinar, deliberately kept OFF the event document.
 *
 * Why this type exists at all: the `production` dataset is public — private
 * datasets are a paid feature — and an event has to be *published* for the site
 * to render it. Anything on a published document is readable by anyone who runs
 * a GROQ query against the public API, and the project id ships in the client
 * bundle by design. So a join link stored on the event defeats the registration
 * gate the whole /events/[slug]/register flow exists to enforce.
 *
 * Drafts are the exception: Sanity excludes `drafts.*` from unauthenticated
 * reads. This document is therefore never published — sanity.config.ts strips
 * the publish action from it — so it stays readable only to the Studio and to
 * the server, which queries it with a token in /api/register.
 *
 * The permanent "unpublished changes" state in the Studio is expected, not a
 * mistake. That is the mechanism.
 */
export const eventJoinLink = defineType({
  name: "eventJoinLink",
  title: "Webinar Join Link",
  type: "document",
  fields: [
    defineField({
      name: "event",
      title: "Event",
      type: "reference",
      to: [{ type: "event" }],
      description: "Which webinar this join link belongs to.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "meetingLink",
      title: "Join link",
      type: "url",
      description:
        "The Google Meet (or similar) link. Only ever sent to someone after they complete the registration form — it is never rendered on a public page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "string",
      description: "Optional reminder for yourself, e.g. a dial-in number or passcode.",
    }),
  ],
  preview: {
    select: { title: "event.title", subtitle: "meetingLink" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Unassigned join link",
      subtitle: subtitle || "No link set",
    }),
  },
});
