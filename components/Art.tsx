"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { getArt, type ArtPiece, type ArtLabels, type ArtTone } from "@/lib/galleries";
import SectionHeading from "./SectionHeading";
import { tornClipPath } from "./TornEdgeDefs";

/**
 * Art showcase built like a museum wall: the piece hangs on a tinted mat on
 * one side, its wall label sits on the other. The label carries what a
 * gallery card would — medium, dimensions, year — plus the story of how the
 * piece was made and the materials it took.
 *
 * Selecting a thumbnail crossfades both the work and its label together, so
 * the pairing never reads as mismatched mid-transition. The slide direction
 * tracks whether the visitor moved forward or back through the collection
 * (including the short way around when jumping straight to a thumbnail), so
 * browsing the wall feels like flipping through a stack of prints rather
 * than a generic fade.
 */
const MATS: Record<ArtTone, string> = {
  sage: "from-sage-200 via-sage-100 to-cream-100",
  terracotta: "from-terracotta-300/60 via-cream-200 to-cream-100",
  cream: "from-cream-200 via-cream-100 to-sage-50",
};

const artEase = [0.22, 1, 0.36, 1] as const;

const imageVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 44,
    rotate: dir * 2.2,
    scale: 0.96,
    filter: "blur(6px)",
  }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -36,
    rotate: dir * -1.6,
    scale: 0.97,
    filter: "blur(4px)",
  }),
};

const imageVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const labelVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 18, y: 6 }),
  center: { opacity: 1, x: 0, y: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -14, y: -6 }),
};

const labelVariantsReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Art({
  locale,
  heroViewTransitionName,
}: {
  locale: Locale;
  /** Set only when rendered as the standalone /art page, so the mat can
   * morph from the homepage gateway card that linked here. */
  heroViewTransitionName?: string;
}) {
  const { eyebrow, heading, intro, labels, pieces } = getArt(locale);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  if (pieces.length === 0) return null;

  const count = pieces.length;
  const piece = pieces[active];
  const select = (i: number) => {
    const next = ((i % count) + count) % count;
    // Shortest path around the collection, so jumping from the last
    // thumbnail to the first still slides forward instead of backtracking
    // across the whole wall.
    let delta = next - active;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    setDirection(delta < 0 ? -1 : 1);
    setActive(next);
  };

  return (
    <section id="art" className="relative py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={eyebrow} heading={heading}>
          {intro}
        </SectionHeading>

        <div className="mt-16 md:mt-20 grid md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* The work, matted */}
          <div className="md:col-span-6">
            {/* clip-path tears the mat's edge like a deckle-edge frame;
                drop-shadow follows that silhouette instead of a plain box.
                paper-fiber lays the page's own fiber over the tinted mat so it
                reads as the same stock as the torn cards elsewhere. */}
            <div
              className="paper-fiber relative overflow-hidden p-6 sm:p-10 md:p-12 drop-shadow-[0_20px_36px_rgba(60,50,35,0.4)]"
              style={{
                clipPath: tornClipPath(1),
                ...(heroViewTransitionName
                  ? { viewTransitionName: heroViewTransitionName }
                  : undefined),
              }}
            >
              {/* The mat's tint crossfades only when the piece's tone
                  actually changes, so same-tone neighbours don't flicker. */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={piece.tone}
                  className={`absolute inset-0 bg-gradient-to-br ${MATS[piece.tone]}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: artEase }}
                />
              </AnimatePresence>
              {/* Fixed height, not the piece's own aspect ratio — portrait and
                  landscape pieces share one frame so switching between them
                  doesn't resize the mat and bounce the page underneath it.
                  object-contain still shows each piece uncropped inside it. */}
              <div className="relative w-full h-[38vh] sm:h-[46vh] md:h-[52vh] max-h-[560px] min-h-[280px]">
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.img
                    key={piece.id}
                    src={piece.image}
                    alt={`${piece.title} — ${piece.medium}`}
                    loading="lazy"
                    decoding="async"
                    custom={direction}
                    variants={reduce ? imageVariantsReduced : imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: artEase }}
                    className="absolute inset-0 w-full h-full object-contain shadow-[0_16px_34px_-12px_rgba(30,25,15,0.45)]"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-sage-700 mb-3">
                {labels.browse}
              </p>
              <div className="flex items-center gap-3">
                <ul className="flex gap-3 flex-1 min-w-0">
                  {pieces.map((p, i) => (
                    <li key={p.id} className="relative min-w-0">
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-current={i === active ? "true" : undefined}
                        aria-label={p.title}
                        className={`block w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-transparent transition-opacity duration-500 ${
                          i === active ? "opacity-100" : "opacity-55 hover:opacity-90"
                        }`}
                      >
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                      {/* Slides between thumbnails instead of snapping, so the
                          active frame reads as one spotlight moving along the
                          wall rather than a border toggling on and off. */}
                      {i === active && (
                        <motion.span
                          layoutId="art-thumb-active"
                          aria-hidden
                          className="absolute inset-0 rounded-xl border-2 border-sage-600 pointer-events-none"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 flex-shrink-0">
                  <StepButton
                    direction="prev"
                    label={labels.prev}
                    onClick={() => select(active - 1)}
                  />
                  <StepButton
                    direction="next"
                    label={labels.next}
                    onClick={() => select(active + 1)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* The wall label */}
          <div className="md:col-span-6 md:pt-4 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={piece.id}
                custom={direction}
                variants={reduce ? labelVariantsReduced : labelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: artEase }}
              >
                <h3 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                  {piece.title}
                </h3>
                <p className="mt-2 text-ink-soft italic">{piece.medium}</p>

                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-sage-200 py-5">
                  <Spec label={labels.year} value={piece.year} />
                  <Spec label={labels.size} value={piece.size} />
                </dl>

                <div className="mt-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-sage-700 mb-3">
                    {labels.story}
                  </p>
                  <p className="text-ink-soft leading-relaxed">{piece.story}</p>
                </div>

                <div className="mt-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-sage-700 mb-3">
                    {labels.materials}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {piece.materials.map((material) => (
                      <li
                        key={material}
                        className="text-xs text-ink-soft border border-sage-200 bg-cream-50/50 rounded-full px-3 py-1.5"
                      >
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.24em] text-ink-muted">
        {label}
      </dt>
      <dd className="mt-1 text-ink tabular-nums">{value}</dd>
    </div>
  );
}

function StepButton({
  direction,
  label,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
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
