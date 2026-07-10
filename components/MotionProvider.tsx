"use client";

import { MotionConfig } from "framer-motion";

/**
 * Makes every Framer Motion animation honor the OS-level
 * `prefers-reduced-motion` setting. With `reducedMotion="user"`, transform
 * and layout animations are skipped for users who ask for reduced motion,
 * while opacity fades are preserved — the CSS media query in globals.css
 * only covers CSS-driven animations, so this closes the gap for JS motion.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
