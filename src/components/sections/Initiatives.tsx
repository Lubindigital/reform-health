"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Layers, PieChart, Users, CircleCheck, Shield, Heart, type LucideIcon } from "lucide-react";
import { initiatives } from "@/data/initiatives";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/StaggerContainer";

const iconMap: Record<string, LucideIcon> = { Layers, PieChart, Users, CircleCheck, Shield, Heart };

export function Initiatives() {
  return (
    <section id="initiatives" className="py-24 bg-off-white">
      <div className="max-w-[1120px] mx-auto px-6">
        {/* Hero intro */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=340&fit=crop&q=80"
                alt="Data and technology in healthcare"
                width={500}
                height={340}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=340&fit=crop&q=80"
                alt="Education and community collaboration"
                width={500}
                height={340}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <FadeUp>
            <span className="tag">Our Initiatives</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
              How We&apos;re Making It Happen
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Proven strategies, data-driven decisions, and partnerships that deliver real results for Nevada employers.
            </p>
          </FadeUp>
        </div>

        {/* Initiative cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                variants={staggerItemVariants}
                whileHover={{ y: -4, boxShadow: "0 4px 12px rgba(0,0,0,0.07)" }}
                className="p-8 bg-white rounded-2xl border border-gray-100 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-navy/[0.06] rounded-lg flex items-center justify-center text-navy mb-5">
                  {Icon && <Icon className="w-6 h-6" strokeWidth={1.5} />}
                </div>
                <h3 className="font-heading text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
