"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const DEFAULT_HEADLINE = "Disrupting the Healthcare Status Quo for Nevada Employers";
const DEFAULT_DESCRIPTION =
  "The ReForm Health Alliance is a collective of leading Nevada organizations working together to deliver better employee healthcare benefits at sustainably lower costs — redirecting billions back to our communities.";
const DEFAULT_ROTATING_WORDS = ["Better Outcomes", "Lower Costs", "Stronger Communities"];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop&q=80";
const DEFAULT_IMAGE_ALT = "Healthcare professionals collaborating";
const DEFAULT_PRIMARY_CTA = "Join ReForm";
const DEFAULT_SECONDARY_CTA = "Our Goal";

export interface HeroProps {
  headline?: string;
  description?: string;
  rotatingWords?: string[];
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  image?: string | null;
  imageAlt?: string | null;
}

export function Hero({
  headline,
  description,
  rotatingWords,
  primaryCtaLabel,
  secondaryCtaLabel,
  image,
  imageAlt,
}: HeroProps = {}) {
  // Filter out null/empty entries that Sanity can return when the array was
  // never properly populated in Studio. Fall back to defaults if nothing valid.
  const filtered = (rotatingWords ?? []).filter(
    (w): w is string => typeof w === "string" && w.trim().length > 0,
  );
  const words = filtered.length > 0 ? filtered : DEFAULT_ROTATING_WORDS;
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <header id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <Image
        src={image || DEFAULT_IMAGE}
        alt={imageAlt || DEFAULT_IMAGE_ALT}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,25,60,0.92)] to-[rgba(15,35,80,0.85)]" />

      <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-10 mb-6 overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="block font-heading text-lg md:text-xl font-semibold text-navy-light uppercase tracking-[2px]"
            >
              {words[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.15] tracking-tight mb-6 max-w-[800px]"
        >
          {headline || DEFAULT_HEADLINE}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg text-white/70 mb-10 max-w-[620px] leading-relaxed"
        >
          {description || DEFAULT_DESCRIPTION}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3.5"
        >
          <a href="#contact" className="bg-navy-light hover:bg-navy text-white px-8 py-3.5 rounded-lg text-sm font-semibold text-center transition-colors cursor-pointer">
            {primaryCtaLabel || DEFAULT_PRIMARY_CTA}
          </a>
          <a href="#northstar" className="border border-white/25 text-white/90 px-8 py-3.5 rounded-lg text-sm font-semibold text-center hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer">
            {secondaryCtaLabel || DEFAULT_SECONDARY_CTA}
          </a>
        </motion.div>
      </div>
    </header>
  );
}
