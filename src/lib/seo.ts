import type { Metadata } from "next";

export const SITE_URL = "https://www.reformnv.org";
export const SITE_NAME = "ReForm Health Alliance";

export const OG_IMAGE = {
  url: "/og-reform-health-alliance.jpg",
  width: 1200,
  height: 630,
  alt: "ReForm Health Alliance — Better Care. Lower Costs. Stronger Communities.",
};

export const HOME_SHARE = {
  title: "ReForm Health Alliance | Better Care. Lower Costs. Stronger Communities.",
  description: "A collective of leading Nevada organizations disrupting the health insurance status quo.",
};

type ShareInput = { title: string; description?: string; path: string; type?: "website" | "article" };

/**
 * Next merges metadata SHALLOWLY: a page that sets `openGraph` replaces the
 * layout's whole openGraph object, images and site name included. Every page
 * builds its share tags through these two helpers so nothing drops out.
 */
export function pageOpenGraph({ title, description, path, type = "website" }: ShareInput): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url: `${SITE_URL}${path}`,
    siteName: SITE_NAME,
    locale: "en_US",
    type,
    images: [OG_IMAGE],
  };
}

export function pageTwitter({ title, description }: Pick<ShareInput, "title" | "description">): NonNullable<Metadata["twitter"]> {
  return { card: "summary_large_image", title, description, images: [OG_IMAGE.url] };
}
