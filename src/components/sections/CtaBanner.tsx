"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";

export function CtaBanner() {
  return (
    <section className="py-20">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden py-20 px-8 text-center">
          <Image
            src="https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1400&h=600&fit=crop&q=80"
            alt="Healthcare professionals"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,25,60,0.93)] to-[rgba(20,40,90,0.88)]" />

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(59,110,240,0.15) 0%, transparent 60%)" }}
          />

          <div className="relative z-10">
            <FadeUp>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to Take Control of Your Healthcare Costs?
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="text-white/60 text-lg mb-8 max-w-[520px] mx-auto">
                Join the growing coalition of Nevada employers who are demanding better. The status quo ends when we act together.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="inline-block bg-navy-light hover:bg-navy text-white px-9 py-4 rounded-lg text-base font-semibold transition-colors cursor-pointer"
              >
                Join the Alliance
              </motion.a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
