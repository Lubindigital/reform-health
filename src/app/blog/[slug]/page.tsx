import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client, BLOG_POST_QUERY, BLOG_POSTS_QUERY } from "@/sanity/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShareButtons } from "@/components/shared/ShareButtons";

// Fallback content for when Sanity isn't set up yet
import { blogPostContent } from "@/data/blogContent";

interface BlogPost {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  body?: unknown[];
}

export async function generateStaticParams() {
  try {
    const posts: BlogPost[] = await client.fetch(BLOG_POSTS_QUERY);
    if (posts && posts.length > 0) {
      return posts.map((post) => ({ slug: post.slug }));
    }
  } catch {
    // Sanity not configured yet
  }
  // Fallback to static slugs
  return [{ slug: "our-blueprint" }, { slug: "pricing-myths" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Try Sanity first
  try {
    const post: BlogPost | null = await client.fetch(BLOG_POST_QUERY, { slug });
    if (post) {
      return {
        title: `${post.title} | ReForm Health Alliance`,
        description: post.excerpt,
      };
    }
  } catch {
    // fallback
  }

  // Fallback
  const fallback = blogPostContent[slug];
  if (fallback) {
    return { title: `${fallback.title} | ReForm Health Alliance`, description: fallback.excerpt };
  }
  return { title: "Blog | ReForm Health Alliance" };
}

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-heading text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-heading text-lg font-bold text-gray-900 mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-600 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-navy pl-4 italic text-gray-500 my-6">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-gray-900">{children}</strong>,
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
      <a href={value?.href} className="text-navy underline hover:text-navy-deep" target="_blank" rel="noopener noreferrer">{children}</a>
    ),
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try Sanity first
  let post: BlogPost | null = null;
  try {
    post = await client.fetch(BLOG_POST_QUERY, { slug });
  } catch {
    // Sanity not configured
  }

  // Fallback to static content
  const fallback = blogPostContent[slug];
  if (!post && !fallback) notFound();

  const title = post?.title || fallback?.title || "";
  const subtitle = post?.subtitle || fallback?.subtitle || "";
  const category = post?.category || fallback?.category || "";
  const date = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : fallback?.date || "";
  const readTime = post?.readTime || fallback?.readTime || "";
  const author = post?.author || fallback?.author || "";
  const authorRole = post?.authorRole || fallback?.authorRole || "";

  return (
    <>
      <Navbar />
      <main>
        <article className="pt-36 pb-20">
          <div className="max-w-[720px] mx-auto px-6">
            <Link href="/blog" className="text-navy text-sm font-medium hover:underline mb-8 inline-block">&larr; All Insights</Link>

            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
              <span className="bg-navy/[0.06] text-navy font-bold uppercase tracking-wide px-2.5 py-1 rounded">{category}</span>
              <span>{date} &middot; {readTime}</span>
            </div>

            <h1 className="font-heading text-4xl md:text-[2.8rem] font-bold text-gray-900 leading-tight tracking-tight mb-3">{title}</h1>
            {subtitle && <p className="text-xl text-gray-500 mb-4">{subtitle}</p>}
            <p className="text-sm text-gray-400 mb-6">By <strong className="text-gray-700">{author}</strong>, {authorRole}</p>

            <ShareButtons title={title} />

            {post?.body ? (
              <div className="mt-8">
                <PortableText value={post.body as never[]} components={portableTextComponents} />
              </div>
            ) : fallback?.htmlContent ? (
              <div
                className="mt-8 prose prose-gray max-w-none [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-gray-900"
                dangerouslySetInnerHTML={{ __html: fallback.htmlContent }}
              />
            ) : null}

            <div className="mt-16 p-8 bg-off-white rounded-2xl border border-gray-100 text-center">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{fallback?.ctaTitle || "Ready to join the movement?"}</h3>
              <p className="text-gray-500 text-sm mb-5">{fallback?.ctaDescription || "Learn how your organization can be part of the ReForm Health Alliance."}</p>
              <Link href="/#contact" className="inline-block bg-navy text-white px-8 py-3.5 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors">
                Join the Alliance
              </Link>
            </div>

            <Link href="/blog" className="text-navy text-sm font-medium hover:underline mt-10 inline-block">&larr; Back to Insights</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
