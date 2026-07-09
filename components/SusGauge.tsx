"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  value: number;
  outOf?: number;
};

export default function SusGauge({ value, outOf = 100 }: Props) {
  const [visible, setVisible] = useState(false);
  const progress = useMotionValue(0);
  const dash = useTransform(progress, (v) => {
    // Circle circumference for r=80: 2π·80 ≈ 502.65. Draw from top.
    const circumference = 502.65;
    return `${(v / outOf) * circumference} ${circumference}`;
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const controls = animate(progress, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [visible, value, progress]);

  return (
    <motion.div
      onViewportEnter={() => setVisible(true)}
      viewport={{ once: true, margin: "-80px" }}
      className="relative flex flex-col items-center justify-center"
    >
      <svg width="200" height="200" viewBox="0 0 200 200" className="rotate-[-90deg]">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#e2ecdf"
          strokeWidth="6"
        />
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#5f8555"
          strokeWidth="6"
          strokeLinecap="round"
          style={{ strokeDasharray: dash }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl md:text-6xl text-ink">
          {display}
        </span>
        <span className="text-xs uppercase tracking-[0.24em] text-sage-700 mt-1">
          SUS · {outOf}
        </span>
      </div>
    </motion.div>
  );
}
