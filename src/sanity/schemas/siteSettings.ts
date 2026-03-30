import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Disrupting the Healthcare Status Quo for Nevada Employers",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "rotatingWords",
      title: "Rotating Words (Hero)",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Better Care", "Lower Costs", "Stronger Communities"],
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "contactLocation",
      title: "Contact Location",
      type: "string",
    }),
    defineField({
      name: "ctaHeadline",
      title: "CTA Section Headline",
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Section Description",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
