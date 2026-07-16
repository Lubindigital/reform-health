"use client";

import { motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, duration = 0.6, className }: FadeUpProps) {
  const reduce = useReducedMotion();

  // Respect prefers-reduced-motion: cross-fade in place with no vertical travel
  // and no stagger delay, instead of the default rise.
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: reduce ? 0.3 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
