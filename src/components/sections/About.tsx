"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { FadeUp } from "@/components/motion/FadeUp";
import type { SanityImage } from "@/sanity/homePageTypes";

const DEFAULT_EYEBROW = "About ReForm";
const DEFAULT_TITLE = "Reimagining Healthcare Through the Power of Partnership";
const DEFAULT_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop&q=80",
    alt: "Partnership handshake",
  },
  {
    url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop&q=80",
    alt: "Doctor and patient consultation",
  },
];

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-600 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="text-gray-900">{children}</strong>
    ),
  },
};

export interface AboutProps {
  eyebrow?: string;
  title?: string;
  body?: PortableTextBlock[];
  images?: SanityImage[];
}

export function About({ eyebrow, title, body, images }: AboutProps = {}) {
  const usableImages = images?.filter((img) => img?.url) ?? [];
  const shownImages = usableImages.length ? usableImages : DEFAULT_IMAGES;
  const hasBody = Array.isArray(body) && body.length > 0;

  return (
    <section id="about" className="py-24 bg-off-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeUp>
              <span className="tag">{eyebrow || DEFAULT_EYEBROW}</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                {title || DEFAULT_TITLE}
              </h2>
            </FadeUp>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {shownImages.slice(0, 2).map((img, i) => (
                <div key={("_key" in img && img._key) || `${img.url}-${i}`} className="rounded-xl overflow-hidden">
                  <Image
                    src={String(img.url)}
                    alt={img.alt || ""}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            {hasBody ? (
              <PortableText value={body} components={portableTextComponents} />
            ) : (
              <>
                <p className="text-gray-600 leading-relaxed">
                  The ReForm Health Alliance is more than a coalition&mdash;it&apos;s a movement. We bring together employers and providers to implement <strong className="text-gray-900">High Performing Health Plans (HPHPs)</strong> that empower employers and providers to control spending, improve access and outcomes, and transform health benefits from &apos;liability&apos; to &apos;strategic asset&apos;.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By aligning incentives, mandating transparency, and facilitating collaboration between providers and employers, we gain momentum and control that no single employer can achieve alone. The result: better healthcare for employees, sustainable and predictable costs for businesses, and stronger communities across Nevada.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
