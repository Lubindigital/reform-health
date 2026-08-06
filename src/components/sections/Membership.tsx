"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { benefits as fallbackBenefits } from "@/data/benefits";
import { FadeUp } from "@/components/motion/FadeUp";
import type { BenefitItem } from "@/sanity/homePageTypes";

const DEFAULT_EYEBROW = "Membership";
const DEFAULT_TITLE = "What Members Get";
const DEFAULT_DESCRIPTION =
  "Joining the ReForm Health Alliance gives your organization the tools, data, and collective power to take control of your healthcare spending.";

export interface MembershipProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  benefits?: BenefitItem[];
}

export function Membership({ eyebrow, title, description, benefits }: MembershipProps = {}) {
  const usable = benefits?.filter((b) => b?.title) ?? [];
  const items = usable.length ? usable : fallbackBenefits;

  return (
    <section id="membership" className="py-24 bg-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="tag">{eyebrow || DEFAULT_EYEBROW}</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              {title || DEFAULT_TITLE}
            </h2>
            <p className="text-gray-500 leading-relaxed">{description || DEFAULT_DESCRIPTION}</p>
          </motion.div>

          <div className="space-y-5">
            {items.map((benefit, i) => (
              <FadeUp key={("_key" in benefit && benefit._key) || `${benefit.title}-${i}`} delay={i * 0.08}>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <strong className="block text-gray-900 text-sm font-semibold mb-1">{benefit.title}</strong>
                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
