"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";
import Portrait from "./Portrait";

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

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-14 items-center w-full">
        <div className="md:col-span-7 order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-6"
          >
            {dict.hero.eyebrow}
          </motion.p>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.98] text-ink">
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
            <a
              href="#projects"
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
            </a>
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
          <div className="relative max-w-md mx-auto">
            <Portrait
              src="/profile/nathalie.jpeg"
              alt={dict.hero.portraitAlt}
              aspect="aspect-[4/5]"
              rounded="rounded-[2rem]"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-terracotta-300/60 blur-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-sage-300/50 blur-2xl -z-10" />
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
