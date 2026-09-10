"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress({
  variant = "default",
}: {
  /** "reading" is for the long case-study pages (~13,000px): thicker, a
   * warmer accent color, and a visible track so it reads as a reading
   * progress bar from the first pixel — not just a hairline that's easy
   * to miss on a page this long. */
  variant?: "default" | "reading";
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  // The case-study pages run ~13,000px, so the same spring that feels fine
  // on a normal page reads as sluggish there — the bar visibly trails a
  // fast scroll/fling instead of tracking it. A much stiffer, less damped
  // spring (rather than binding scrollYProgress directly with no easing at
  // all, which reads as jittery on a trackpad) keeps it glued to the
  // actual scroll position.
  const readingScaleX = useSpring(scrollYProgress, {
    stiffness: 1000,
    damping: 60,
    restDelta: 0.001,
  });

  // Both variants keep every colour on an *absolutely* positioned child
  // and leave the fixed wrapper itself transparent. Safari 26+ tints its
  // status bar from the `background-color` of whatever fixed or sticky
  // element sits within ~4px of the viewport top, and skips absolute
  // children entirely — so a bar painted directly on the fixed element
  // would drag the browser chrome to sage and break the paper backing that
  // `html` is there to supply. The child needs to be positioned rather
  // than in flow so it still paints above the wrapper's other content.
  if (variant === "reading") {
    return (
      <div aria-hidden className="fixed top-0 left-0 right-0 h-[3px] z-50">
        <div className="absolute inset-0 bg-sage-100" />
        <motion.div
          style={{ scaleX: readingScaleX, transformOrigin: "0% 50%" }}
          className="absolute inset-0 bg-terracotta-500 shadow-[0_0_8px_rgba(196,119,88,0.5)]"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="fixed top-0 left-0 right-0 h-[2px] z-50">
      <motion.div
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="absolute inset-0 bg-sage-500"
      />
    </div>
  );
}
