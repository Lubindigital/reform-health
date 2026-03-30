"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";

const stats = [
  { value: 17.5, prefix: "$", suffix: "B+", decimals: 1, text: "Spent annually by Nevada employers on health insurance premiums" },
  { value: 40, prefix: "", suffix: "%", decimals: 0, text: "Estimated waste in current employer health spending" },
  { value: 3.5, prefix: "$", suffix: "B", decimals: 1, text: "Annual savings redirectable back to Nevada's economy" },
];

export function ImpactNumbers() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-[1120px] mx-auto px-6">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={staggerItemVariants} className="text-center px-5 relative">
              <div className="font-heading text-5xl font-bold text-navy mb-2">
                <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{stat.text}</p>
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gray-200" />
              )}
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
