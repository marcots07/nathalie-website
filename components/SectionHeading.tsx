"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  heading: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export default function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  children,
}: Props) {
  const alignment = align === "center" ? "items-center text-center" : "items-start";
  return (
    <div className={`flex flex-col ${alignment} max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-4 inline-flex items-center gap-3"
      >
        <span className="w-6 h-px bg-sage-500" />
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-ink"
      >
        {heading}
      </motion.h2>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-lg text-ink-soft leading-relaxed"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
