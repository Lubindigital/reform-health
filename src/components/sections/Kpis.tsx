"use client";

import { motion } from "motion/react";
import { kpis as fallbackKpis } from "@/data/kpis";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";
import type { KpiItem } from "@/sanity/homePageTypes";

const DEFAULT_EYEBROW = "Our North Star";
const DEFAULT_TITLE = "Measurable Goals. Accountable Results.";

export interface KpisProps {
  eyebrow?: string;
  title?: string;
  kpis?: KpiItem[];
}

export function Kpis({ eyebrow, title, kpis }: KpisProps = {}) {
  // Sanity wins only when it has usable rows; a half-filled array would render
  // blank cards, which reads as a broken site rather than as missing content.
  const items =
    kpis?.filter((k) => k?.value || k?.label)?.length
      ? kpis.filter((k) => k?.value || k?.label)
      : fallbackKpis;

  return (
    <section id="northstar" className="py-24 bg-gradient-to-br from-[#0a193c] to-[#0f2350]">
      <div className="max-w-[1120px] mx-auto px-6">
        <SectionHeader tag={eyebrow || DEFAULT_EYEBROW} title={title || DEFAULT_TITLE} light />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((kpi, i) => (
            <motion.div
              // Prefer Sanity's _key: it is stable across edits and, unlike the
              // label, carries no stega characters that would change per render.
              key={("_key" in kpi && kpi._key) || `${kpi.label}-${i}`}
              variants={staggerItemVariants}
              whileHover={{ borderColor: "rgba(59,110,240,0.4)" }}
              className="p-8 rounded-2xl border border-white/10 bg-white/[0.04] transition-all cursor-pointer"
            >
              <div className="font-heading text-3xl font-bold text-navy-light mb-2">{kpi.value}</div>
              <div className="text-white text-sm font-semibold mb-3">{kpi.label}</div>
              <p className="text-white/50 text-sm leading-relaxed">{kpi.description}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
