"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const rotatingWords = ["Better Care", "Lower Costs", "Stronger Communities"];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop&q=80"
        alt="Healthcare professionals collaborating"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(10,25,60,0.92)] to-[rgba(15,35,80,0.85)]" />

      <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-40 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-12 mb-6 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="block font-heading text-xl md:text-2xl font-semibold text-navy-light"
            >
              {rotatingWords[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.15] tracking-tight mb-6 max-w-[800px]"
        >
          Disrupting the Healthcare Status Quo for Nevada Employers
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg text-white/70 mb-10 max-w-[620px] leading-relaxed"
        >
          The ReForm Health Alliance is a collective of leading Nevada organizations working together to deliver better employee healthcare benefits at sustainably lower costs — redirecting billions back to our communities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3.5"
        >
          <a href="#contact" className="bg-navy-light hover:bg-navy text-white px-8 py-3.5 rounded-lg text-sm font-semibold text-center transition-colors cursor-pointer">
            Join the Alliance
          </a>
          <a href="#about" className="border border-white/25 text-white/90 px-8 py-3.5 rounded-lg text-sm font-semibold text-center hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer">
            Learn More
          </a>
        </motion.div>
      </div>
    </header>
  );
}
