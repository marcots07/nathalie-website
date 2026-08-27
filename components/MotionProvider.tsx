"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every Framer Motion animation on the site honor the user's
 * `prefers-reduced-motion` setting. Framer Motion drives transforms in JS
 * (not CSS animations), so the global CSS reduced-motion rule doesn't touch
 * it — `reducedMotion="user"` disables transform/layout animations while
 * still allowing opacity, which keeps content appearing without movement.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
