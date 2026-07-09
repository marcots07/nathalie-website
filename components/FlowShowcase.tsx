"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DeviceScreen from "./DeviceScreen";

type Props = {
  flows: string[];
  screens?: { src: string }[];
  notes?: string[];
  decisionLabel: string;
  aspectRatio?: string;
  frame?: "device" | "browser";
};

const AUTO_ADVANCE_MS = 5000;

/**
 * Guided walkthrough for a flow's screens: a numbered step list beside a
 * large featured screen. Clicking a step (or the prev/next controls)
 * swaps the screen with a soft crossfade; until the reader interacts, it
 * auto-advances gently. Auto-advance is disabled entirely under
 * prefers-reduced-motion, and pauses while hovered.
 */
export default function FlowShowcase({
  flows,
  screens,
  notes,
  decisionLabel,
  aspectRatio,
  frame = "device",
}: Props) {
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  const count = flows.length;
  const isLandscape = (() => {
    if (frame === "browser") return true;
    if (!aspectRatio) return false;
    const [w, h] = aspectRatio.split("/").map((s) => parseFloat(s.trim()));
    return Number.isFinite(w) && Number.isFinite(h) && w > h;
  })();

  useEffect(() => {
    if (reduce || interacted || hovered || count < 2) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % count),
      AUTO_ADVANCE_MS
    );
    return () => window.clearInterval(id);
  }, [reduce, interacted, hovered, count]);

  const select = (i: number) => {
    setActive(((i % count) + count) % count);
    setInteracted(true);
  };

  return (
    <div
      className="grid md:grid-cols-12 gap-8 md:gap-12 items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Step list */}
      <ol
        className={`order-2 md:order-1 ${
          isLandscape ? "md:col-span-4" : "md:col-span-6"
        } flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-6 px-6 md:mx-0 md:px-0`}
      >
        {flows.map((flow, i) => {
          const isActive = i === active;
          const [title, ...rest] = flow.split("—");
          const detail = rest.join("—").trim();
          return (
            <li key={flow} className="flex-shrink-0 md:flex-shrink">
              <button
                type="button"
                onClick={() => select(i)}
                aria-current={isActive ? "step" : undefined}
                className={`group w-full text-left flex items-baseline gap-4 rounded-xl px-4 py-3 transition-all duration-500 border-l-2 ${
                  isActive
                    ? "border-sage-600 bg-cream-100/80"
                    : "border-transparent hover:bg-cream-100/50"
                }`}
              >
                <span
                  className={`font-display text-lg tabular-nums transition-colors duration-500 ${
                    isActive ? "text-sage-700 italic" : "text-ink-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-medium transition-colors duration-500 whitespace-nowrap md:whitespace-normal ${
                      isActive ? "text-ink" : "text-ink-soft"
                    }`}
                  >
                    {title.trim()}
                  </span>
                  {detail && (
                    <span
                      className={`hidden md:block text-xs text-ink-muted overflow-hidden transition-all duration-500 ${
                        isActive ? "max-h-10 opacity-100 mt-1" : "max-h-0 opacity-0"
                      }`}
                    >
                      {detail}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Featured screen */}
      <div
        className={`order-1 md:order-2 ${
          isLandscape ? "md:col-span-8" : "md:col-span-6"
        }`}
      >
        <div className={isLandscape ? "" : "max-w-[300px] mx-auto"}>
          <div className="relative">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 32, scale: 0.98 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -32, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <DeviceScreen
                  src={screens?.[active]?.src}
                  alt={flows[active]}
                  aspectRatio={aspectRatio}
                  frame={frame}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs tabular-nums tracking-[0.24em] text-ink-muted">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <ArrowButton
                  direction="prev"
                  onClick={() => select(active - 1)}
                  label="Previous screen"
                />
                <ArrowButton
                  direction="next"
                  onClick={() => select(active + 1)}
                  label="Next screen"
                />
              </div>
            </div>
          )}
        </div>

        {/* Design-decision note for the active screen */}
        {notes && notes[active] && (
          <div className="mt-6 border-l-2 border-sage-500 pl-5 min-h-[4.5rem]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-sage-700 mb-2">
              {decisionLabel}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active}
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-ink-soft leading-relaxed"
              >
                {notes[active]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-full border border-sage-200 hover:border-sage-600 hover:bg-cream-100/80 text-sage-700 flex items-center justify-center transition-all duration-300"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        className={direction === "prev" ? "rotate-180" : ""}
      >
        <path
          d="M3 8h10m0 0L9 4m4 4L9 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
