import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeUp } from "@/components/motion/FadeUp";
import { BLOG_POSTS_QUERY } from "@/sanity/client";
import { draftAwareFetch } from "@/sanity/lib/live";
import { blogPosts as fallbackPosts } from "@/data/blog";

// This page was prerendered once at build time with no revalidation path, so
// publishing a post in Studio changed nothing on the live site until the next
// deploy — silently, with no error. Fetching through draftAwareFetch attaches
// sync tags that the mounted <SanityLive /> can invalidate, and the timer is a
// backstop in case no live event arrives.
export const revalidate = 300;

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
  image?: string | null;
  imageAlt?: string | null;
}

interface ListedPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Merge Sanity posts over the hardcoded ones BY SLUG.
 *
 * This used to be all-or-nothing: `if (posts.length > 0)` returned only the
 * Sanity list, so publishing a single post in Studio silently removed every
 * other post from /blog. Now Sanity wins per-slug and anything not yet migrated
 * keeps rendering from src/data/blog.ts, which makes the migration incremental
 * instead of a cliff.
 */
async function getPosts(): Promise<ListedPost[]> {
  const posts = await draftAwareFetch<SanityPost[]>(BLOG_POSTS_QUERY);

  const fromSanity: ListedPost[] = (posts ?? [])
    .filter((p) => p?.slug)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      date: p.publishedAt
        ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "",
      readTime: p.readTime,
      excerpt: p.excerpt,
      author: p.author,
      ...(p.image ? { image: p.image, imageAlt: p.imageAlt ?? p.title } : {}),
    }));

  const claimed = new Set(fromSanity.map((p) => p.slug));
  const remaining = fallbackPosts
    .filter((p) => !claimed.has(p.slug))
    .map(({ slug, title, category, date, readTime, excerpt, author, image }) => ({
      slug,
      title,
      category,
      date,
      readTime,
      excerpt,
      author,
      image,
      imageAlt: title,
    }));

  return [...fromSanity, ...remaining];
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
                    className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-navy/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all cursor-pointer group"
                  >
                    {post.image && (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.imageAlt ?? post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-8">
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
