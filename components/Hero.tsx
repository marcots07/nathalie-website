"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import Portrait from "./Portrait";

const MotionTape = motion.create(Image);

const line = {
  initial: { y: "110%", opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      delay: 0.2 + i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const swingControls = useAnimation();

  useEffect(() => {
    swingControls.start({
      rotate: [-1.5, 1.5],
      transition: { repeat: Infinity, repeatType: "mirror", duration: 2.5, ease: "easeInOut" },
    });
  }, [swingControls]);

  const handleNudge = async () => {
    swingControls.stop();
    await swingControls.start({
      rotate: 2.5,
      transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
    });
    await swingControls.start({
      rotate: -1.5,
      transition: { type: "spring", stiffness: 55, damping: 10 },
    });
    swingControls.start({
      rotate: [-1.5, 1.5],
      transition: { repeat: Infinity, repeatType: "mirror", duration: 2.5, ease: "easeInOut" },
    });
  };

  // `svh` — the viewport at its *smallest*, with the browser's bar showing —
  // rather than `min-h-screen`/`vh`, which resolves to the viewport at its
  // largest (760pt against the 678pt actually on screen on an iPhone 16 Pro).
  // One screen tall should mean the screen the visitor has when the page
  // loads, not the one they'd have if the toolbar collapsed; sized in `vh`
  // this section is 82pt taller than what's visible, and the portrait it
  // centers rides that much lower than centered.
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-16">
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-14 items-center w-full">
        {/* Second on phones, left column from `md` up. The portrait opens the
            page on purpose — it's the first thing a visitor should meet, and
            the copy follows underneath. */}
        <div className="md:col-span-7 order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-xs font-label uppercase tracking-[0.28em] text-sage-700 mb-6"
          >
            {dict.hero.eyebrow}
          </motion.p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.98] text-ink">
            {[dict.hero.titleLine1, dict.hero.titleLine2, dict.hero.titleLine3].map(
              (text, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className={`inline-block ${
                      i === 1 ? "italic text-sage-700" : ""
                    }`}
                    variants={line}
                    initial="initial"
                    animate="animate"
                    custom={i}
                  >
                    {text}
                  </motion.span>
                </span>
              )
            )}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl leading-relaxed"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-2 bg-sage-700 hover:bg-sage-800 text-cream-50 px-6 py-3 rounded-full transition-all duration-500 hover:gap-3"
            >
              {dict.hero.ctaPrimary}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a
              href="/cv/nathalie-gonzalez-perez-cv.pdf"
              download
              className="inline-flex items-center gap-2 border border-sage-300 hover:border-sage-700 text-ink px-6 py-3 rounded-full transition-all duration-500 group"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-500 group-hover:translate-y-0.5"
              >
                <path
                  d="M8 2v9m0 0l-3.5-3.5M8 11l3.5-3.5M3 14h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {dict.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 order-1 md:order-2 relative"
        >
          {/* Held up by a single strip of washi tape across the top edge, laid
              at a slight angle: the portrait is the first thing a visitor sees,
              so it sets the paper language — torn stock, warm tape — that the
              Photography and Art cards carry through the rest of the page. The
              loosely-taped sheet sways gently from where it's fixed. */}
          <div className="relative max-w-md mx-auto pt-6">
            <motion.div
              className="relative"
              initial={{ rotate: -1.5 }}
              animate={swingControls}
              style={{ transformOrigin: "50% 0%" }}
              onHoverStart={handleNudge}
            >
              <Portrait
                src="/profile/nathalie.jpeg"
                alt={dict.hero.portraitAlt}
                aspect="aspect-[4/5]"
                position="50% 28%"
                torn={2}
                priority
              />

              {/* A single strip of real washi tape straddling the top edge,
                  centred and just barely askew. Drawn after the portrait so it
                  sits on top of it, and drops in with a slight overshoot —
                  as if it were just pressed down — once the portrait itself
                  has mostly settled. Horizontal centering moves into `x`
                  (rather than the usual `-translate-x-1/2` class) because
                  framer's own transform on y/rotate would otherwise
                  silently replace a class-based transform on this element. */}
              <MotionTape
                aria-hidden
                src="/tape.png"
                alt=""
                width={734}
                height={245}
                style={{ x: "-50%" }}
                initial={{ y: -34, opacity: 0, rotate: -20 }}
                animate={{ y: 0, opacity: 1, rotate: -3 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 14, mass: 0.6 }}
                className="absolute -top-3 left-1/2 z-20 w-28 h-auto select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(42,42,38,0.15)]"
              />

              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-terracotta-300/60 blur-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-sage-300/50 blur-2xl -z-10" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-sage-500 to-transparent" />
      </motion.div>
    </section>
  );
}
