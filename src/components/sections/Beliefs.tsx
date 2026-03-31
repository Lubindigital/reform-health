"use client";

import { motion } from "motion/react";
import { beliefs } from "@/data/beliefs";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";

export function Beliefs() {
  return (
    <section id="beliefs" className="py-24 bg-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <span className="inline-block text-sm font-bold uppercase tracking-[3px] text-navy mb-3.5">Our Beliefs</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.4rem] font-bold leading-tight tracking-tight text-gray-900">The Principles That Drive Our Mission</h2>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beliefs.map((belief) => (
            <motion.div
              key={belief.number}
              variants={staggerItemVariants}
              whileHover={{ y: -4, borderColor: "rgba(29,78,216,0.3)", boxShadow: "0 4px 12px rgba(0,0,0,0.07)" }}
              className={`p-8 rounded-2xl border border-gray-100 transition-all cursor-pointer ${
                belief.number === "04" || belief.number === "05" ? "lg:col-span-1 lg:last:col-start-2" : ""
              }`}
            >
              <div className="font-heading text-3xl font-bold text-navy/20 mb-4">{belief.number}</div>
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-2.5">{belief.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{belief.description}</p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
