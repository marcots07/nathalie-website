"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import SectionHeading from "./SectionHeading";

const DOOR_KEYS = ["medicine", "rbt", "design"] as const;
type DoorKey = (typeof DOOR_KEYS)[number];

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

          <div className="md:col-span-5 md:pl-8">
            <div className="sticky top-28">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-8 inline-flex items-center gap-3"
              >
                <span className="w-6 h-px bg-sage-500" />
                {dict.about.threadLabel}
              </motion.p>
              <ThreeDoors dict={dict} active={active} setActive={setActive} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// SVG coordinates of each dot along the organic path, tuned by eye so the
// dots sit on the curve at roughly the 12 %, 55 %, and 92 % marks.
const DOOR_POSITIONS: { cx: number; cy: number }[] = [
  { cx: 40, cy: 60 },
  { cx: 220, cy: 165 },
  { cx: 380, cy: 260 },
];

// Path draw thresholds for each dot's scroll-linked activation.
const DOOR_THRESHOLDS = [0.15, 0.5, 0.85];

function ThreeDoors({
  dict,
  active,
  setActive,
}: {
  dict: Dictionary;
  active: number | null;
  setActive: (i: number | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start when the top of the container reaches 80 % of viewport,
    // end when it reaches 20 % — so the trace fills during natural reading.
    offset: ["start 80%", "end 20%"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [reached, setReached] = useState<boolean[]>([false, false, false]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setReached((prev) => {
      const next = DOOR_THRESHOLDS.map((t, i) => prev[i] || v >= t);
      // Skip re-render if nothing changed.
      if (next.every((r, i) => r === prev[i])) return prev;
      return next;
    });
  });

  return (
    <div ref={containerRef} className="relative">
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

        {/* Ghost path — light, always visible so the composition reads even
            before scroll trace fills in. */}
        <path
          d="M 40 60 C 120 40, 180 220, 260 180 S 380 60, 380 260"
          stroke="#e2ecdf"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Scroll-linked trace over the ghost path. */}
        <motion.path
          d="M 40 60 C 120 40, 180 220, 260 180 S 380 60, 380 260"
          stroke="url(#thread)"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength }}
        />

        {DOOR_POSITIONS.map((c, i) => {
          const key = DOOR_KEYS[i];
          const isActive = active === i;
          const isReached = reached[i];
          const r = isActive ? 14 : isReached ? 9 : 6;
          const fill = isActive
            ? "#c47758"
            : isReached
              ? "#5f8555"
              : "#c6d9c0";
          return (
            <g
              key={key}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              tabIndex={0}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <motion.circle
                cx={c.cx}
                cy={c.cy}
                r={r}
                fill={fill}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 15 }}
                style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              />
              {/* Pulse ring on active */}
              {isActive && (
                <motion.circle
                  cx={c.cx}
                  cy={c.cy}
                  r={r}
                  fill="none"
                  stroke="#c47758"
                  strokeWidth="1"
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.4 }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
                />
              )}
              {/* Glyph inside the dot, only visible once reached */}
              {isReached && (
                <DoorGlyph
                  cx={c.cx}
                  cy={c.cy}
                  size={isActive ? 10 : 7}
                  which={key}
                />
              )}
              {/* Year label above the dot */}
              <text
                x={c.cx}
                y={c.cy - r - 10}
                textAnchor="middle"
                fontSize="9"
                fontFamily="var(--font-sans)"
                letterSpacing="0.24em"
                fill={isReached ? "#496a41" : "#a3a39a"}
                style={{ textTransform: "uppercase" }}
              >
                {dict.about.doors[key].year}
              </text>
              {/* Keyword revealed on hover */}
              <motion.text
                x={c.cx}
                y={c.cy + r + 22}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-serif)"
                fontStyle="italic"
                fill="#c47758"
                initial={{ opacity: 0, y: c.cy + r + 12 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? c.cy + r + 22 : c.cy + r + 12,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {dict.about.doors[key].keyword}
              </motion.text>
            </g>
          );
        })}
      </svg>

      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        {DOOR_KEYS.map((key, i) => {
          const door = dict.about.doors[key];
          const isActive = active === i;
          const isReached = reached[i];
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
                  : isReached
                    ? "border-transparent bg-cream-100/40"
                    : "border-transparent bg-transparent"
              }`}
            >
              <p
                className={`font-medium transition-colors ${
                  isReached ? "text-ink" : "text-ink-muted"
                }`}
              >
                {door.label}
              </p>
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

/** Tiny glyph rendered inside each dot. Kept minimal — a mark, not an icon. */
function DoorGlyph({
  cx,
  cy,
  size,
  which,
}: {
  cx: number;
  cy: number;
  size: number;
  which: DoorKey;
}) {
  const stroke = "#fbf9f4";
  const sw = 1.2;
  if (which === "medicine") {
    // Cross (medical).
    return (
      <g>
        <line
          x1={cx - size / 2}
          y1={cy}
          x2={cx + size / 2}
          y2={cy}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy - size / 2}
          x2={cx}
          y2={cy + size / 2}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (which === "rbt") {
    // Two curves — hands / connection.
    return (
      <g>
        <path
          d={`M ${cx - size / 2} ${cy} Q ${cx} ${cy - size / 2} ${cx + size / 2} ${cy}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${cx - size / 2} ${cy} Q ${cx} ${cy + size / 2} ${cx + size / 2} ${cy}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }
  // design: four-point spark
  return (
    <g>
      <line
        x1={cx}
        y1={cy - size / 2}
        x2={cx}
        y2={cy + size / 2}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <line
        x1={cx - size / 2}
        y1={cy}
        x2={cx + size / 2}
        y2={cy}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <line
        x1={cx - size / 3}
        y1={cy - size / 3}
        x2={cx + size / 3}
        y2={cy + size / 3}
        stroke={stroke}
        strokeWidth={sw * 0.8}
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1={cx - size / 3}
        y1={cy + size / 3}
        x2={cx + size / 3}
        y2={cy - size / 3}
        stroke={stroke}
        strokeWidth={sw * 0.8}
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  );
}
