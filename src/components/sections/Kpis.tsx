"use client";

import { motion } from "motion/react";
import { kpis } from "@/data/kpis";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";

export function Kpis() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0a193c] to-[#0f2350]">
      <div className="max-w-[1120px] mx-auto px-6">
        <SectionHeader tag="Our North Star" title="Measurable Goals. Accountable Results." light />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
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
