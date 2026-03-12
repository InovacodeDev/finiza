"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, only use opacity (no Y translation)
  const initial = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const exit = shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ 
        duration: 0.25, 
        ease: "easeInOut" 
      }}
      style={{ willChange: "transform, opacity" }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
