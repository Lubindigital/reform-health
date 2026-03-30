import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/motion/FadeUp";
import { sanityFetch, BLOG_POSTS_QUERY } from "@/sanity/client";
import { blogPosts as fallbackPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Insights | ReForm Health Alliance",
  description: "Insights, analysis, and thought leadership from the ReForm Health Alliance on employer healthcare strategy in Nevada.",
};

interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
}

async function getPosts() {
  try {
    const posts = await sanityFetch<SanityPost[]>(BLOG_POSTS_QUERY);
    if (posts && posts.length > 0) {
      return posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        date: new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        readTime: p.readTime,
        excerpt: p.excerpt,
        author: p.author,
      }));
    }
  } catch {
    // Sanity not configured yet
  }
  return fallbackPosts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-to-br from-[#0a193c] to-[#0f2350] pt-40 pb-20">
          <div className="max-w-[1120px] mx-auto px-6">
            <span className="tag">Blog</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white tracking-tight">Insights</h1>
          </div>
        </section>

        <section className="py-20 bg-off-white">
          <div className="max-w-[1120px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, i) => (
                <FadeUp key={post.slug} delay={i * 0.1}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block bg-white p-8 rounded-2xl border border-gray-100 hover:border-navy/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="bg-navy/[0.06] text-navy font-bold uppercase tracking-wide px-2.5 py-1 rounded">{post.category}</span>
                      <span>{post.date} &middot; {post.readTime}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-2.5 group-hover:text-navy transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">By {post.author}</span>
                      <span className="text-navy text-sm font-semibold">Read More &rarr;</span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
