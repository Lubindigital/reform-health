import { defineField, defineType } from "sanity";

export const eventRegistration = defineType({
  name: "eventRegistration",
  title: "Webinar Registration",
  type: "document",
  // Read-only in the Studio: these come from the public form, not hand-editing.
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Work Email",
      type: "string",
    }),
    defineField({
      name: "eventTitle",
      title: "Event",
      type: "string",
    }),
    defineField({
      name: "eventSlug",
      title: "Event Slug",
      type: "string",
    }),
    defineField({
      name: "submittedAt",
      title: "Registered At",
      type: "datetime",
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      initialValue: "webinar-registration",
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "By Event",
      name: "byEvent",
      by: [
        { field: "eventTitle", direction: "asc" },
        { field: "submittedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      company: "company",
      email: "email",
    },
    prepare({ firstName, lastName, company, email }) {
      const name = [firstName, lastName].filter(Boolean).join(" ") || "Registrant";
      return {
        title: name,
        subtitle: [company, email].filter(Boolean).join(" · "),
      };
    },
  },
});
