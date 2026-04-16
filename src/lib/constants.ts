export const CONTACT = {
  phone: "775-636-5005",
  phoneHref: "tel:7756365005",
  location: "Reno, Nevada",
} as const;

export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Initiatives", href: "/#initiatives" },
  { label: "Membership", href: "/#membership" },
  { label: "Insights", href: "/#insights" },
  { label: "News", href: "/blog" },
] as const;

export const FORMSPREE_ACTION = "https://formspree.io/f/xkoprobn";

export const SOCIAL_LINKS = [
  { platform: "LinkedIn", href: "https://www.linkedin.com/company/reform-health-alliance" },
  { platform: "Twitter", href: "https://twitter.com/reformhealthnv" },
  { platform: "Facebook", href: "https://www.facebook.com/reformhealthalliance" },
] as const;
