"use client";

import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

/**
 * TransitionProvider ensures that AnimatePresence is available at the root
 * without forcing a specific animation on every page.
 * Individual pages or route groups should use Template.tsx or motion components
 * to define their own transitions.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  );
}
