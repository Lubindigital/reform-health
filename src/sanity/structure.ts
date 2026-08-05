import type { StructureResolver } from "sanity/structure";
import { CalendarDays, Cog, FileText, Inbox, Users } from "lucide-react";

// Custom Studio sidebar so dad sees a clean, organized list:
//   Site Settings (singleton — edits the whole site at once)
//   Blog Posts
//   Events
//   Webinar Registrations
//   Contact Submissions
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(Cog)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Blog Posts")
        .icon(FileText)
        .schemaType("blogPost")
        .child(S.documentTypeList("blogPost").title("Blog Posts")),
      S.divider(),
      S.listItem()
        .title("Events")
        .icon(CalendarDays)
        .schemaType("event")
        .child(S.documentTypeList("event").title("Events")),
      S.divider(),
      S.listItem()
        .title("Webinar Registrations")
        .icon(Users)
        .schemaType("eventRegistration")
        .child(
          // These two panes are inboxes, not content. Empty initialValueTemplates
          // removes the "+" create button so there is no way to hand-author a
          // fake lead alongside the real ones.
          S.documentTypeList("eventRegistration")
            .title("Webinar Registrations")
            .initialValueTemplates([]),
        ),
      S.divider(),
      S.listItem()
        .title("Contact Submissions")
        .icon(Inbox)
        .schemaType("contact")
        .child(
          S.documentTypeList("contact")
            .title("Contact Submissions")
            .initialValueTemplates([]),
        ),
    ]);
