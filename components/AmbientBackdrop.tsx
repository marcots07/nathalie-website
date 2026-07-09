"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Site-wide ambient backdrop. Scroll-driven so the composition breathes
 * with the reader, but kept minimal: two large soft radial gradients that
 * counter-drift as you scroll, plus a very quiet tint shift over a long
 * base wash. Heavy spring on the scroll progress smooths any nudge into
 * a slow drift so nothing ever feels jumpy.
 *
 * Fixed at z-index 0; page content sits above at z-index 10. Sections
 * are transparent so the whole scroll reads as one continuous space.
 * Respects `prefers-reduced-motion`.
 */
export default function AmbientBackdrop() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Heavy spring — motion arrives late and settles slowly, so the drift
  // reads as atmosphere rather than as a scroll indicator.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 22,
    damping: 30,
    restDelta: 0.001,
  });

  // Orb 1 — sage, drifts down-right through the composition.
  const orb1X = useTransform(smooth, [0, 1], ["-8vw", "18vw"]);
  const orb1Y = useTransform(smooth, [0, 1], ["-6vh", "38vh"]);

  // Orb 2 — warm cream / terracotta, counter-drifts up-left.
  const orb2X = useTransform(smooth, [0, 1], ["12vw", "-14vw"]);
  const orb2Y = useTransform(smooth, [0, 1], ["30vh", "-4vh"]);

  // Tint sweep — sage → warm cream → soft terracotta → sage.
  const tint = useTransform(
    smooth,
    [0, 0.35, 0.7, 1],
    [
      "rgba(163, 193, 153, 0.10)",
      "rgba(230, 210, 175, 0.16)",
      "rgba(230, 176, 154, 0.14)",
      "rgba(163, 193, 153, 0.10)",
    ]
  );

  if (reduce) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "rgba(226, 236, 223, 0.18)" }}
        />
        <div
          className="absolute -top-[10vh] -left-[8vw] w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px]"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(163, 193, 153, 0.45), rgba(163, 193, 153, 0) 65%)",
          }}
        />
        <div
          className="absolute top-[20vh] right-[-14vw] w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px]"
          style={{
            background:
              "radial-gradient(circle at 60% 50%, rgba(230, 176, 154, 0.32), rgba(230, 176, 154, 0) 60%)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Base wash. Always present, keeps the atmosphere continuous even
          when both orbs happen to be near the edges. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(226, 236, 223, 0.18) 0%, rgba(246, 241, 230, 0.12) 50%, rgba(226, 236, 223, 0.16) 100%)",
        }}
      />

      {/* Tint sweep bound to scroll — very quiet, mostly a warmth shift. */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: tint, willChange: "background-color" }}
      />

      {/* Orb 1 — sage */}
      <motion.div
        className="absolute -top-[10vh] -left-[8vw] w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px]"
        style={{
          x: orb1X,
          y: orb1Y,
          background:
            "radial-gradient(circle at 40% 40%, rgba(163, 193, 153, 0.45), rgba(163, 193, 153, 0) 65%)",
          willChange: "transform",
        }}
      />

      {/* Orb 2 — warm cream / terracotta */}
      <motion.div
        className="absolute top-[20vh] right-[-14vw] w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px]"
        style={{
          x: orb2X,
          y: orb2Y,
          background:
            "radial-gradient(circle at 60% 50%, rgba(230, 176, 154, 0.32), rgba(230, 176, 154, 0) 60%)",
          willChange: "transform",
        }}
      />

      {/* Quiet vignette so text always has enough contrast at the edges. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(251, 249, 244, 0.28) 100%)",
        }}
      />
    </div>
  );
}
