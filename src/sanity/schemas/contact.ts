import { defineField, defineType } from "sanity";

export const contact = defineType({
  name: "contact",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "company",
      title: "Organization",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Inquiry Type",
      type: "string",
      options: {
        list: [
          { title: "Employer / HR Leader", value: "employer" },
          { title: "Benefit Consultant", value: "consultant" },
          { title: "Healthcare Provider", value: "provider" },
          { title: "Other / General Inquiry", value: "other" },
        ],
      },
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Contact Form", value: "contact-form" },
          { title: "AI Chatbot", value: "chatbot" },
        ],
      },
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
