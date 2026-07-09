"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Site-wide ambient backdrop. Two large blurred pastel orbs that drift
 * with scroll, plus a subtle color tint that shifts across the sage →
 * warm → terracotta pastel range as the reader passes through sections.
 *
 * Fixed positioned behind everything (z-index -10). Transform-only so
 * it doesn't trigger layout. When `prefers-reduced-motion` is set,
 * everything is static — no scroll listeners, no animation.
 */
export default function AmbientBackdrop() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  // Orb 1: drifts diagonally from top-left to mid-right.
  const orb1X = useTransform(smooth, [0, 1], ["-15vw", "40vw"]);
  const orb1Y = useTransform(smooth, [0, 1], ["-10vh", "60vh"]);
  const orb1Scale = useTransform(smooth, [0, 0.5, 1], [1, 1.15, 0.95]);

  // Orb 2: counter-drifts from right to left.
  const orb2X = useTransform(smooth, [0, 1], ["60vw", "-10vw"]);
  const orb2Y = useTransform(smooth, [0, 1], ["70vh", "10vh"]);
  const orb2Scale = useTransform(smooth, [0, 0.5, 1], [0.95, 1.1, 1]);

  // Tint sweep: subtle pastel shifts across the vertical journey.
  // Sage → warm cream → terracotta hint → back toward sage.
  const tintOpacity = useTransform(smooth, [0, 0.15, 0.85, 1], [0, 0.5, 0.5, 0]);
  const tintColor = useTransform(
    smooth,
    [0, 0.33, 0.66, 1],
    [
      "rgba(163, 193, 153, 0)",
      "rgba(230, 210, 180, 0.35)",
      "rgba(230, 176, 154, 0.28)",
      "rgba(163, 193, 153, 0.25)",
    ]
  );

  if (reduce) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -10 }}
      >
        <div className="absolute top-[-10vh] left-[-15vw] w-[70vw] h-[70vw] rounded-full bg-sage-200/30 blur-[100px]" />
        <div className="absolute top-[70vh] right-[-10vw] w-[60vw] h-[60vw] rounded-full bg-terracotta-300/25 blur-[100px]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -10 }}
    >
      {/* Ambient tint layer */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: tintColor,
          opacity: tintOpacity,
          willChange: "background-color, opacity",
        }}
      />

      {/* Orb 1: sage/cream gradient */}
      <motion.div
        style={{
          x: orb1X,
          y: orb1Y,
          scale: orb1Scale,
          willChange: "transform",
        }}
        className="absolute top-0 left-0 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-sage-300 via-cream-200 to-transparent opacity-40 blur-[80px]" />
      </motion.div>

      {/* Orb 2: cream/terracotta gradient, counter-motion */}
      <motion.div
        style={{
          x: orb2X,
          y: orb2Y,
          scale: orb2Scale,
          willChange: "transform",
        }}
        className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-terracotta-300 via-cream-200 to-sage-200 opacity-35 blur-[80px]" />
      </motion.div>
    </div>
  );
}
