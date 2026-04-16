"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { FadeUp } from "@/components/motion/FadeUp";

export function About() {
  return (
    <section id="about" className="py-24 bg-off-white">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <FadeUp>
              <span className="tag">About ReForm</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                Reimagining Healthcare Through the Power of Partnership
              </h2>
            </FadeUp>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop&q=80"
                  alt="Partnership handshake"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop&q=80"
                  alt="Doctor and patient consultation"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            <p className="text-gray-600 leading-relaxed">
              The ReForm Health Alliance is more than a coalition&mdash;it&apos;s a movement. We bring together employers and providers to implement <strong className="text-gray-900">High Performing Health Plans (HPHPs)</strong> that empower employers and providers to control spending, improve access and outcomes, and transform health benefits from &apos;liability&apos; to &apos;strategic asset&apos;.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By aligning incentives, mandating transparency, and facilitating collaboration between providers and employers, we gain momentum and control that no single employer can achieve alone. The result: better healthcare for employees, sustainable and predictable costs for businesses, and stronger communities across Nevada.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
