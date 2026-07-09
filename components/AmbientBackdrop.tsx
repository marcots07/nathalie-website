"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Site-wide ambient backdrop. Three very large, very soft blobs that drift
 * on autonomous 30-45 second loops — decoupled from scroll, so the
 * atmosphere feels alive rather than reactive. Heavy blur + low-saturation
 * pastel gradients keep the effect liminal instead of decorative.
 *
 * The whole thing lives at z-index 0, fixed, with content above it at
 * z-index 10. Sections are transparent, so the atmosphere reads as a
 * single continuous space rather than section-per-section bands.
 * `prefers-reduced-motion` freezes it to a static composition.
 */
export default function AmbientBackdrop() {
  const reduce = useReducedMotion();

  const orbs = [
    {
      // Warm sage, upper region.
      gradient:
        "radial-gradient(circle at 40% 40%, rgba(163, 193, 153, 0.55), rgba(163, 193, 153, 0) 65%)",
      base: { top: "-20vh", left: "-25vw" },
      size: "120vw",
      // A slow, wide loop; ~40 s for one round trip.
      keyframes: reduce
        ? { x: 0, y: 0 }
        : {
            x: ["0vw", "10vw", "-4vw", "0vw"],
            y: ["0vh", "8vh", "16vh", "0vh"],
          },
      duration: 42,
      delay: 0,
    },
    {
      // Warm cream / terracotta whisper, right side drifting up.
      gradient:
        "radial-gradient(circle at 60% 50%, rgba(230, 176, 154, 0.42), rgba(230, 176, 154, 0) 60%)",
      base: { top: "20vh", right: "-30vw" },
      size: "110vw",
      keyframes: reduce
        ? { x: 0, y: 0 }
        : {
            x: ["0vw", "-8vw", "4vw", "0vw"],
            y: ["0vh", "-6vh", "10vh", "0vh"],
          },
      duration: 55,
      delay: 6,
    },
    {
      // Cool cream anchor bottom-left, keeps composition asymmetrical.
      gradient:
        "radial-gradient(circle at 50% 50%, rgba(230, 210, 175, 0.5), rgba(230, 210, 175, 0) 60%)",
      base: { bottom: "-30vh", left: "10vw" },
      size: "100vw",
      keyframes: reduce
        ? { x: 0, y: 0 }
        : {
            x: ["0vw", "-6vw", "8vw", "0vw"],
            y: ["0vh", "-10vh", "-4vh", "0vh"],
          },
      duration: 48,
      delay: 12,
    },
  ];

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Base wash — a fraction of sage so the atmosphere is never fully
          absent even at the edges of the composition. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(226, 236, 223, 0.35) 0%, rgba(246, 241, 230, 0.25) 50%, rgba(226, 236, 223, 0.30) 100%)",
        }}
      />

      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            ...orb.base,
            width: orb.size,
            height: orb.size,
            background: orb.gradient,
            willChange: reduce ? undefined : "transform",
            filter: "blur(20px)",
          }}
          animate={orb.keyframes}
          transition={
            reduce
              ? undefined
              : {
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: orb.delay,
                }
          }
        />
      ))}

      {/* A quiet vignette so text always has enough contrast at the edges. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(251, 249, 244, 0.35) 100%)",
        }}
      />
    </div>
  );
}
