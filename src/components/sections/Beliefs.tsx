"use client";

import { motion } from "motion/react";
import { beliefs as fallbackBeliefs } from "@/data/beliefs";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";
import type { BeliefItem } from "@/sanity/homePageTypes";

const DEFAULT_EYEBROW = "Our Beliefs";
const DEFAULT_TITLE = "The Principles That Drive Our Mission";

export interface BeliefsProps {
  eyebrow?: string;
  title?: string;
  beliefs?: BeliefItem[];
}

export function Beliefs({ eyebrow, title, beliefs }: BeliefsProps = {}) {
  const usable = beliefs?.filter((b) => b?.title) ?? [];
  const items = usable.length ? usable : fallbackBeliefs;

  return (
    <section id="beliefs" className="py-24 bg-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <span className="inline-block text-sm font-bold uppercase tracking-[3px] text-navy mb-3.5">
            {eyebrow || DEFAULT_EYEBROW}
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.4rem] font-bold leading-tight tracking-tight text-gray-900">
            {title || DEFAULT_TITLE}
          </h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((belief, i) => {
            // Numbering is derived from array order, never stored. It used to be
            // an editable string that also drove the grid rule below, so a typo
            // silently broke the layout. Now reordering in Studio renumbers.
            const number = String(i + 1).padStart(2, "0");
            const isCenteredTail = number === "04" || number === "05";

            return (
              <motion.div
                key={("_key" in belief && belief._key) || `${belief.title}-${i}`}
                variants={staggerItemVariants}
                whileHover={{ y: -4, borderColor: "rgba(29,78,216,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.07)" }}
                className={`p-8 rounded-2xl border border-gray-100 transition-all cursor-pointer ${
                  isCenteredTail ? "lg:col-span-1 lg:last:col-start-2" : ""
                }`}
              >
                <div className="font-heading text-3xl font-bold text-navy/20 mb-4">{number}</div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2.5">{belief.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{belief.description}</p>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
