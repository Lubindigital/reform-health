"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { stegaClean } from "next-sanity";
import { Layers, PieChart, Users, CircleCheck, Shield, Heart, type LucideIcon } from "lucide-react";
import { initiatives as fallbackInitiatives } from "@/data/initiatives";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";
import type { InitiativeItem, SanityImage } from "@/sanity/homePageTypes";

const iconMap: Record<string, LucideIcon> = { Layers, PieChart, Users, CircleCheck, Shield, Heart };

const DEFAULT_EYEBROW = "Our Initiatives";
const DEFAULT_TITLE = "How We're Making It Happen";
const DEFAULT_DESCRIPTION =
  "Proven strategies, data-driven decisions, and partnerships that deliver real results for Nevada employers.";
const DEFAULT_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=340&fit=crop&q=80",
    alt: "Data and technology in healthcare",
  },
  {
    url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=340&fit=crop&q=80",
    alt: "Education and community collaboration",
  },
];

export interface InitiativesProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  images?: SanityImage[];
  initiatives?: InitiativeItem[];
}

export function Initiatives({ eyebrow, title, description, images, initiatives }: InitiativesProps = {}) {
  const usable = initiatives?.filter((item) => item?.title) ?? [];
  const items = usable.length ? usable : fallbackInitiatives;

  const usableImages = images?.filter((img) => img?.url) ?? [];
  const shownImages = usableImages.length ? usableImages : DEFAULT_IMAGES;

  return (
    <section id="initiatives" className="py-24 bg-off-white">
      <div className="max-w-[1120px] mx-auto px-6">
        {/* Hero intro */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {shownImages.slice(0, 2).map((img, i) => (
              <div key={("_key" in img && img._key) || `${img.url}-${i}`} className="rounded-xl overflow-hidden">
                <Image
                  src={String(img.url)}
                  alt={img.alt || ""}
                  width={500}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
          <FadeUp>
            <span className="tag">{eyebrow || DEFAULT_EYEBROW}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              {title || DEFAULT_TITLE}
            </h2>
            <p className="text-gray-500 leading-relaxed">{description || DEFAULT_DESCRIPTION}</p>
          </FadeUp>
        </div>

        {/* Initiative cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            // stegaClean is required here, not optional. In draft mode Sanity
            // encodes invisible characters into every string it returns, so the
            // raw value would never match a key in iconMap and the icon would
            // silently disappear — only while previewing, which is the worst
            // possible time to look broken.
            const Icon = iconMap[stegaClean(item.icon) ?? ""];
            return (
              <motion.div
                key={("_key" in item && item._key) || `${item.title}-${i}`}
                variants={staggerItemVariants}
                whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0,0,0,0.07)" }}
                className="p-8 bg-white rounded-2xl border border-gray-100 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-navy/[0.06] rounded-lg flex items-center justify-center text-navy mb-5">
                  {Icon && <Icon className="w-6 h-6" strokeWidth={1.5} />}
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
