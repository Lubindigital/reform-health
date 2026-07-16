import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Date & Details" },
    { name: "registration", title: "Registration" },
  ],
  // NOTE: `meetingLink` below is intentionally excluded from the public
  // EVENTS_QUERY. It is fetched server-side only and released to a registrant
  // after they submit the registration form.
  fields: [
    defineField({
      name: "title",
      title: "Event Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "emphasisWord",
      title: "Highlighted Word",
      type: "string",
      group: "content",
      description:
        'Optional. One word from the title to show in the accent color, e.g. "Failing". Must match a word in the title exactly.',
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "content",
      description: 'Small kicker above the title, e.g. "Nevada Employer Webinar"',
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Webinar", value: "Webinar" },
          { title: "Roundtable", value: "Roundtable" },
          { title: "In Person", value: "In Person" },
          { title: "Conference", value: "Conference" },
        ],
      },
      initialValue: "Webinar",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "startDate",
      title: "Date",
      type: "date",
      group: "details",
      options: { dateFormat: "dddd, MMMM D, YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timeLabel",
      title: "Time",
      type: "string",
      group: "details",
      description: 'The clock time, e.g. "12:00 to 12:30 PM"',
    }),
    defineField({
      name: "timeZone",
      title: "Time Zone",
      type: "string",
      group: "details",
      description: 'Shown under the time, e.g. "Pacific Time"',
      initialValue: "Pacific Time",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "details",
      description: 'e.g. "Google Meet", "Online", or "Reno, NV"',
      initialValue: "Google Meet",
    }),
    defineField({
      name: "locationNote",
      title: "Location Note",
      type: "string",
      group: "details",
      description: 'Second line under the location, e.g. "Link in registration email"',
    }),
    defineField({
      name: "speakers",
      title: "Speakers",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "host",
      title: "Hosted By",
      type: "string",
      group: "details",
      initialValue: "ReForm Health Alliance",
    }),
    defineField({
      name: "isFree",
      title: 'Show "Free" badge',
      type: "boolean",
      group: "registration",
      initialValue: true,
    }),
    defineField({
      name: "meetingLink",
      title: "Private Meeting Link",
      type: "url",
      group: "registration",
      description:
        "The join link (e.g. Google Meet). Kept private and only sent to people after they register. If set, the Register button opens the built-in registration form.",
    }),
    defineField({
      name: "startsAt",
      title: "Exact Start (for calendar invite)",
      type: "datetime",
      group: "registration",
      description: "Optional. Used to build the add-to-calendar invite in the registration email.",
    }),
    defineField({
      name: "endsAt",
      title: "Exact End (for calendar invite)",
      type: "datetime",
      group: "registration",
      description: "Optional. Used to build the add-to-calendar invite in the registration email.",
    }),
    defineField({
      name: "registrationUrl",
      title: "External Sign Up Link",
      type: "url",
      group: "registration",
      description:
        "Optional. Use only for an outside registration page (e.g. Eventbrite). Leave empty when using the Private Meeting Link above.",
    }),
    defineField({
      name: "image",
      title: "Promo Graphic",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description: "Optional. The graphic used for the social post; also used as the share preview.",
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
  ],
  orderings: [
    {
      title: "Date (Soonest)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "startDate", media: "image" },
  },
});
