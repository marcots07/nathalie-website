"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated organic backdrop for the Hero: three overlapping leaf/wave shapes
 * that drift slowly. This is the site's single "wow factor" — kept in one
 * place, low-jank (transform-only), and disabled under prefers-reduced-motion.
 */
export default function OrganicBackdrop() {
  const reduce = useReducedMotion();
  const shapes = [
    {
      d: "M60,20 C90,10 130,30 140,70 C150,110 120,150 80,140 C40,130 20,90 40,60 C50,45 55,30 60,20 Z",
      color: "rgba(163, 193, 153, 0.35)",
      x: "-10%",
      y: "10%",
      size: "60%",
      duration: 24,
    },
    {
      d: "M40,50 C60,20 120,20 140,60 C160,100 140,150 100,150 C60,150 20,120 30,80 C33,70 36,60 40,50 Z",
      color: "rgba(230, 176, 154, 0.28)",
      x: "50%",
      y: "5%",
      size: "55%",
      duration: 30,
    },
    {
      d: "M50,40 C80,20 130,40 140,80 C150,120 110,150 70,140 C30,130 20,80 40,55 C43,50 47,45 50,40 Z",
      color: "rgba(198, 217, 192, 0.5)",
      x: "20%",
      y: "45%",
      size: "70%",
      duration: 36,
    },
  ];

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {shapes.map((shape, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 180 180"
          className="absolute"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            filter: "blur(30px)",
          }}
          initial={{ scale: 0.95, rotate: 0 }}
          animate={
            reduce
              ? { scale: 1, rotate: 0 }
              : { scale: [0.95, 1.05, 0.95], rotate: [0, 8, 0] }
          }
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        >
          <path d={shape.d} fill={shape.color} />
        </motion.svg>
      ))}
    </div>
  );
}
