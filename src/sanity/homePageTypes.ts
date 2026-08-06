import type { PortableTextBlock } from "@portabletext/react";

/**
 * Shape returned by HOME_PAGE_QUERY.
 *
 * Everything is optional on purpose. Validation rules in the schema run in the
 * Studio browser only — the Content Lake accepts anything, and the document may
 * not exist at all — so each section falls back to the copy hardcoded in its
 * component. Treat every field here as "might be missing".
 */

export interface SanityImage {
  _key?: string;
  url?: string | null;
  alt?: string | null;
}

export interface KpiItem {
  _key?: string;
  value?: string;
  label?: string;
  description?: string;
}

export interface BeliefItem {
  _key?: string;
  title?: string;
  description?: string;
}

export interface InitiativeItem {
  _key?: string;
  icon?: string;
  title?: string;
  description?: string;
}

export interface BenefitItem {
  _key?: string;
  title?: string;
  description?: string;
}

export interface HomePage {
  heroRotatingWords?: string[];
  heroHeadline?: string;
  heroDescription?: string;
  heroPrimaryCtaLabel?: string;
  heroSecondaryCtaLabel?: string;
  heroImage?: string | null;
  heroImageAlt?: string | null;

  northStarEyebrow?: string;
  northStarTitle?: string;
  kpis?: KpiItem[];

  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutBody?: PortableTextBlock[];
  aboutImages?: SanityImage[];

  beliefsEyebrow?: string;
  beliefsTitle?: string;
  beliefs?: BeliefItem[];

  initiativesEyebrow?: string;
  initiativesTitle?: string;
  initiativesDescription?: string;
  initiativesImages?: SanityImage[];
  initiatives?: InitiativeItem[];

  membershipEyebrow?: string;
  membershipTitle?: string;
  membershipDescription?: string;
  benefits?: BenefitItem[];

  ctaHeadline?: string;
  ctaDescription?: string;
  ctaButtonLabel?: string;
  ctaImage?: string | null;
  ctaImageAlt?: string | null;
}
