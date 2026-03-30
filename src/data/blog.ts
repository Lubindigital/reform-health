export interface BlogPost {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "our-blueprint",
    category: "Proclamation",
    date: "Mar 14, 2026",
    readTime: "6 min read",
    title: "Our Blueprint",
    excerpt: "A proclamation for Nevada employers — the case for High Performing Health Plans and a detailed roadmap for redirecting billions in healthcare waste.",
    author: "Michael Lubin",
    authorRole: "Founder",
  },
  {
    slug: "pricing-myths",
    category: "The Solutions",
    date: "Feb 17, 2026",
    readTime: "3 min read",
    title: "Decoding Healthcare Pricing Myths",
    excerpt: "How hospital pricing really works, why it matters for employers, and what you can do to stop overpaying for employee healthcare.",
    author: "Michael Lubin",
    authorRole: "Founder",
  },
];
