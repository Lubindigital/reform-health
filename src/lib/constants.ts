export const CONTACT = {
  phone: "775-636-5005",
  phoneHref: "tel:7756365005",
  location: "Reno, Nevada",
} as const;

export type NavChild = { label: string; href: string };
export type NavLink =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: readonly NavChild[] };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Initiatives", href: "/#initiatives" },
  { label: "Membership", href: "/#membership" },
  { label: "Insights", href: "/#insights" },
  {
    label: "News",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "In the News", href: "/#in-the-news" },
    ],
  },
] as const;

export const FORMSPREE_ACTION = "https://formspree.io/f/xkoprobn";

export const SOCIAL_LINKS = [
  { platform: "LinkedIn", href: "https://www.linkedin.com/company/reform-health-alliance" },
  { platform: "Twitter", href: "https://twitter.com/reformhealthnv" },
  { platform: "Facebook", href: "https://www.facebook.com/reformhealthalliance" },
] as const;
