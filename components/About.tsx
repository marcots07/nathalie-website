"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import SectionHeading from "./SectionHeading";

const DOOR_KEYS = ["medicine", "rbt", "design"] as const;

export default function About({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={dict.about.eyebrow} heading={dict.about.heading} />

        <div className="mt-16 md:mt-20 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 space-y-6">
            {dict.about.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="text-lg text-ink-soft leading-relaxed"
              >
                {p}
              </motion.p>
            ))}

            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 pl-6 border-l-2 border-sage-500 font-display italic text-2xl md:text-3xl text-ink leading-snug"
            >
              &ldquo;{dict.about.anchorQuote}&rdquo;
            </motion.blockquote>
          </div>

          {/* Three-doors micro-interaction */}
          <div className="md:col-span-5 md:pl-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sticky top-28"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-8">
                {/* Timeline label rendered visually below */}
                <span className="w-6 h-px bg-sage-500 inline-block align-middle mr-3" />
                {DOOR_KEYS.length} · {dict.about.eyebrow}
              </p>

              <ThreeDoors dict={dict} active={active} setActive={setActive} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreeDoors({
  dict,
  active,
  setActive,
}: {
  dict: Dictionary;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 320"
        className="w-full h-auto"
        aria-hidden
      >
        <defs>
          <linearGradient id="thread" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7fa374" />
            <stop offset="100%" stopColor="#c47758" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 40 60 C 120 40, 180 220, 260 180 S 380 60, 380 260"
          stroke="url(#thread)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
        {[
          { cx: 40, cy: 60 },
          { cx: 260, cy: 180 },
          { cx: 380, cy: 260 },
        ].map((c, i) => (
          <motion.circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={active === i ? 12 : 7}
            fill={active === i ? "#c47758" : "#5f8555"}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 1 + i * 0.25 }}
            style={{ transformOrigin: `${c.cx}px ${c.cy}px`, cursor: "pointer" }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
      </svg>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {DOOR_KEYS.map((key, i) => {
          const door = dict.about.doors[key];
          const isActive = active === i;
          return (
            <button
              key={key}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={`text-left p-3 rounded-xl border transition-all duration-500 ${
                isActive
                  ? "border-terracotta-400 bg-cream-100/80"
                  : "border-transparent bg-cream-100/40"
              }`}
            >
              <p className="font-medium text-ink">{door.label}</p>
              <p
                className={`mt-1 text-xs text-ink-muted overflow-hidden transition-all duration-500 ${
                  isActive ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {door.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
