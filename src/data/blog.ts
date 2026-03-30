export interface BlogPost {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  image: string;
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
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop&q=80",
  },
];
