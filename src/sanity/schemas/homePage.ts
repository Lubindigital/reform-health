import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The home page, section by section.
 *
 * A singleton — src/sanity/structure.ts pins it to the id "homePage" and
 * sanity.config.ts hides it from Create menus and strips its destructive
 * document actions.
 *
 * Field notes for whoever edits this schema next:
 * - Every field carries a `description`, because the person using this Studio is
 *   not technical and an unlabelled text box is a guess.
 * - Repeatable items define a `preview`, otherwise the Studio lists them as
 *   "Untitled" and reordering becomes guesswork.
 * - A few things are deliberately NOT editable. Belief numbering is derived from
 *   array order rather than stored, because those strings drive a grid-placement
 *   rule in Beliefs.tsx and a typo would silently break the layout. Animation
 *   timings and grid classes stay in code for the same reason.
 * - Validation here is a Studio-side guardrail only. The Content Lake does not
 *   enforce it, so the frontend still null-guards everything.
 */

const ICON_CHOICES = [
  { title: "Layers", value: "Layers" },
  { title: "Pie chart", value: "PieChart" },
  { title: "People", value: "Users" },
  { title: "Check in a circle", value: "CircleCheck" },
  { title: "Shield", value: "Shield" },
  { title: "Heart", value: "Heart" },
];

/** Shared image field: hotspot on, alt text required once an asset is picked. */
const imageField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description: "Describe the image for screen readers and when images fail to load.",
      }),
    ],
    validation: (rule) =>
      rule.custom((value: { asset?: unknown; alt?: string } | undefined) => {
        if (!value?.asset) return true;
        return value.alt?.trim() ? true : "Add alt text so this image is accessible.";
      }),
  });

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "northStar", title: "North Star" },
    { name: "about", title: "About" },
    { name: "beliefs", title: "Beliefs" },
    { name: "initiatives", title: "Initiatives" },
    { name: "membership", title: "Membership" },
    { name: "cta", title: "Closing CTA" },
  ],
  fields: [
    // ---------------------------------------------------------------- hero
    defineField({
      name: "heroRotatingWords",
      title: "Rotating words",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Cycled one at a time above the headline, every 2.5 seconds. Keep them short — two or three words.",
      validation: (rule) => rule.min(1).max(6),
    }),
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "string",
      group: "hero",
      description: "The first thing visitors read. One sentence.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "heroDescription",
      title: "Description",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Two or three lines under the headline.",
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: "heroPrimaryCtaLabel",
      title: "Primary button label",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroSecondaryCtaLabel",
      title: "Secondary button label",
      type: "string",
      group: "hero",
    }),
    imageField("heroImage", "Background image", "Sits behind a dark navy overlay, so choose something with room for white text. Wide and landscape works best."),

    // ----------------------------------------------------------- north star
    defineField({
      name: "northStarEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "northStar",
      description: "Small uppercase label above the heading.",
    }),
    defineField({
      name: "northStarTitle",
      title: "Heading",
      type: "string",
      group: "northStar",
    }),
    defineField({
      name: "kpis",
      title: "Goal cards",
      type: "array",
      group: "northStar",
      description:
        "Exactly three. The layout is a three-column grid — a fourth card would sit alone on its own row.",
      validation: (rule) => rule.min(3).max(3),
      of: [
        defineArrayMember({
          type: "object",
          name: "kpi",
          fields: [
            defineField({
              name: "value",
              title: "Big number",
              type: "string",
              description: 'The large figure, e.g. "$3.5B" or "3%". Written exactly as it should appear.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),

    // --------------------------------------------------------------- about
    defineField({
      name: "aboutEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutTitle",
      title: "Heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutBody",
      title: "Body",
      type: "array",
      group: "about",
      description: "Paragraphs of prose. Bold works; headings and lists are intentionally unavailable here.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [{ title: "Bold", value: "strong" }],
            annotations: [],
          },
        }),
      ],
    }),
    defineField({
      name: "aboutImages",
      title: "Images",
      type: "array",
      group: "about",
      description: "Two images, shown side by side.",
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
      ],
    }),

    // ------------------------------------------------------------- beliefs
    defineField({
      name: "beliefsEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "beliefs",
    }),
    defineField({
      name: "beliefsTitle",
      title: "Heading",
      type: "string",
      group: "beliefs",
    }),
    defineField({
      name: "beliefs",
      title: "Beliefs",
      type: "array",
      group: "beliefs",
      description:
        "Numbered automatically from their order here — drag to renumber. No number field to keep in sync.",
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "belief",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),

    // ---------------------------------------------------------- initiatives
    defineField({
      name: "initiativesEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "initiatives",
    }),
    defineField({
      name: "initiativesTitle",
      title: "Heading",
      type: "string",
      group: "initiatives",
    }),
    defineField({
      name: "initiativesDescription",
      title: "Intro",
      type: "text",
      rows: 2,
      group: "initiatives",
    }),
    defineField({
      name: "initiativesImages",
      title: "Images",
      type: "array",
      group: "initiatives",
      description: "Two images, shown side by side next to the intro.",
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        }),
      ],
    }),
    defineField({
      name: "initiatives",
      title: "Initiative cards",
      type: "array",
      group: "initiatives",
      // Cannot be emptied. An empty array falls through to the hardcoded launch
      // copy in src/data/initiatives.ts, so deleting the last card would
      // republish six old cards instead of clearing the section.
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "initiative",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Pick from the set the site ships. Typing a name that isn't on this list would show no icon at all.",
              options: { list: ICON_CHOICES },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "icon" } },
        }),
      ],
    }),

    // ---------------------------------------------------------- membership
    defineField({
      name: "membershipEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "membership",
    }),
    defineField({
      name: "membershipTitle",
      title: "Heading",
      type: "string",
      group: "membership",
    }),
    defineField({
      name: "membershipDescription",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "membership",
    }),
    defineField({
      name: "benefits",
      title: "Member benefits",
      type: "array",
      group: "membership",
      description: "Each one gets a checkmark. Listed in this order.",
      // Same reason as initiatives: emptying it resurrects the hardcoded list.
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "benefit",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        }),
      ],
    }),

    // ----------------------------------------------------------------- cta
    defineField({
      name: "ctaHeadline",
      title: "Headline",
      type: "string",
      group: "cta",
      description: "The closing pitch, just above the contact form.",
    }),
    defineField({
      name: "ctaDescription",
      title: "Description",
      type: "text",
      rows: 2,
      group: "cta",
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "Button label",
      type: "string",
      group: "cta",
    }),
    imageField("ctaImage", "Background image", "Sits behind a dark navy overlay, like the hero."),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
