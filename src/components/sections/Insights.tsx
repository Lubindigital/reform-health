import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/blog";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeUp } from "@/components/motion/FadeUp";

export function Insights() {
  return (
    <section id="insights" className="py-24 bg-off-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <SectionHeader tag="From ReForm" title="From the Alliance" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post, i) => (
            <FadeUp key={post.slug} delay={i * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-navy/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="bg-navy/[0.06] text-navy font-bold uppercase tracking-wide px-2.5 py-1 rounded">{post.category}</span>
                    <span>{post.date} &middot; {post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2.5 group-hover:text-navy transition-colors">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <span className="text-navy text-sm font-semibold">Read More &rarr;</span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
