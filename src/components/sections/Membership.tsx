"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { benefits } from "@/data/benefits";
import { FadeUp } from "@/components/motion/FadeUp";

export function Membership() {
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
            <span className="tag">Membership</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              What Members Get
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Joining the ReForm Health Alliance gives your organization the tools, data, and collective power to take control of your healthcare spending.
            </p>
          </motion.div>

          <div className="space-y-5">
            {benefits.map((benefit, i) => (
              <FadeUp key={benefit.title} delay={i * 0.08}>
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
