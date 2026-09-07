"use client";

import { motion, useMotionValue, animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  /** Free-form result string, e.g. "100%", "76", "2 of 5" — only the
   * leading integer counts up; everything after it (suffix, units, the
   * rest of "2 of 5") is preserved and rendered static. */
  value: string;
};

const LEADING_INT = /^(\d+)(.*)$/;

/**
 * Case-study result numbers (SUS-adjacent stats, percentages) counting up
 * from 0 when they scroll into view, instead of just appearing — same
 * onViewportEnter + imperative `animate()` pattern as SusGauge's own
 * count-up, generalized for the free-form stat strings in project.json's
 * `testing.stats` (which mix "100%", "76", and "2 of 5").
 */
export default function CountUp({ value }: Props) {
  const match = value.match(LEADING_INT);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(target === null || reducedMotion ? target ?? 0 : 0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    if (target === null || reducedMotion) return;
    return motionValue.on("change", (latest) => setDisplay(Math.round(latest)));
  }, [target, reducedMotion, motionValue]);

  if (target === null) {
    return <>{value}</>;
  }

  return (
    <motion.span
      onViewportEnter={() => {
        if (reducedMotion) return;
        animate(motionValue, target, {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        });
      }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {display}
      {suffix}
    </motion.span>
  );
}
