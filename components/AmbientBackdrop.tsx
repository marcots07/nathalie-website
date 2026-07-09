"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Site-wide ambient backdrop. Two large gradient orbs that drift with
 * scroll plus a color-tint layer that shifts across the sage → warm →
 * terracotta pastel range as the reader passes through sections.
 *
 * Fixed position at z-index 0 (sits above the html background but below
 * the main content, which is wrapped in `relative z-10`). Transform-only
 * so it doesn't trigger layout. When `prefers-reduced-motion` is set,
 * everything is static.
 */
export default function AmbientBackdrop() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
    restDelta: 0.001,
  });

  // Orb 1: drifts diagonally from top-left corner down and across.
  const orb1X = useTransform(smooth, [0, 1], ["-20vw", "35vw"]);
  const orb1Y = useTransform(smooth, [0, 1], ["-15vh", "70vh"]);
  const orb1Scale = useTransform(smooth, [0, 0.5, 1], [1, 1.2, 0.95]);

  // Orb 2: counter-drifts from bottom-right to top-left.
  const orb2X = useTransform(smooth, [0, 1], ["55vw", "-15vw"]);
  const orb2Y = useTransform(smooth, [0, 1], ["60vh", "-10vh"]);
  const orb2Scale = useTransform(smooth, [0, 0.5, 1], [0.95, 1.15, 1]);

  // Third accent orb — appears mid-scroll for the "terracotta moment"
  // between sections, then drifts off.
  const orb3X = useTransform(smooth, [0, 1], ["30vw", "70vw"]);
  const orb3Y = useTransform(smooth, [0, 1], ["30vh", "50vh"]);
  const orb3Opacity = useTransform(smooth, [0, 0.35, 0.7, 1], [0, 0.6, 0.4, 0]);

  // Ambient tint sweep across the whole page.
  const tintColor = useTransform(
    smooth,
    [0, 0.25, 0.55, 0.85, 1],
    [
      "rgba(163, 193, 153, 0.18)", // sage
      "rgba(230, 210, 175, 0.35)", // warm cream
      "rgba(230, 176, 154, 0.32)", // soft terracotta
      "rgba(198, 217, 192, 0.28)", // back toward sage
      "rgba(163, 193, 153, 0.22)",
    ]
  );

  if (reduce) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div className="absolute top-[-15vh] left-[-20vw] w-[90vw] h-[90vw] rounded-full bg-sage-300/60 blur-[90px]" />
        <div className="absolute bottom-[-10vh] right-[-15vw] w-[80vw] h-[80vw] rounded-full bg-terracotta-300/50 blur-[90px]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Tint layer sweeps color across the page as you scroll. */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: tintColor,
          willChange: "background-color",
        }}
      />

      {/* Orb 1: sage — bright and prominent. */}
      <motion.div
        style={{
          x: orb1X,
          y: orb1Y,
          scale: orb1Scale,
          willChange: "transform",
        }}
        className="absolute top-0 left-0 w-[95vw] h-[95vw] max-w-[1200px] max-h-[1200px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-sage-400 via-sage-300 to-cream-200 opacity-70 blur-[70px]" />
      </motion.div>

      {/* Orb 2: cream + terracotta accent. */}
      <motion.div
        style={{
          x: orb2X,
          y: orb2Y,
          scale: orb2Scale,
          willChange: "transform",
        }}
        className="absolute top-0 left-0 w-[85vw] h-[85vw] max-w-[1100px] max-h-[1100px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-terracotta-400 via-cream-300 to-sage-300 opacity-60 blur-[70px]" />
      </motion.div>

      {/* Orb 3: mid-scroll terracotta highlight. */}
      <motion.div
        style={{
          x: orb3X,
          y: orb3Y,
          opacity: orb3Opacity,
          willChange: "transform, opacity",
        }}
        className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px]"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-terracotta-400 to-cream-200 blur-[60px]" />
      </motion.div>
    </div>
  );
}
