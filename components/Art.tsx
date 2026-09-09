"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { getArt, type ArtPiece, type ArtLabels, type ArtTone } from "@/lib/galleries";
import DecorFlower from "./DecorFlower";
import SectionHeading from "./SectionHeading";
import { tornClipPath } from "./TornEdgeDefs";

const MotionImage = motion.create(Image);

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
  const railRef = useRef<HTMLUListElement>(null);
  const thumbRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Keep the active thumbnail centred in the rail. Scrolls the rail itself
  // rather than using scrollIntoView, which would also drag the page.
  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRefs.current[active];
    if (!rail || !thumb) return;
    const railBox = rail.getBoundingClientRect();
    const thumbBox = thumb.getBoundingClientRect();
    const offset =
      thumbBox.left - railBox.left - (railBox.width - thumbBox.width) / 2;
    rail.scrollTo({
      left: rail.scrollLeft + offset,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

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
      <div className="relative max-w-6xl mx-auto px-6 md:px-10">
        {/* Position lives in content/decor/positions.json — draggable via
            the "Mover flores" toggle. */}
        <div className="hidden lg:contents">
          <DecorFlower id="art-paintbrushes" />
        </div>
        <SectionHeading eyebrow={eyebrow} heading={heading}>
          {intro}
        </SectionHeading>

        {/* `order-*` (not separate mobile/desktop markup) reflows the same
            three blocks — image, thumbnails, label — into two different
            arrangements: image → thumbnails → label stacked below `lg`
            (phone and tablet), vs. the original image+label side by side
            with thumbnails spanning below at `lg` and up. Keeping one
            thumbnail rail instance matters — it carries the ref-based
            auto-scroll-to-center effect above, which would only track
            whichever copy rendered last if this were duplicated per
            breakpoint. */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* The work, matted */}
          <div className="order-1 lg:col-span-6">
            {/* The torn mat (clip-path + overflow-hidden) is its own inner
                layer, separate from this outer `relative` wrapper — the
                overlay arrows below anchor to the wrapper instead of
                living inside the clipped element. Chrome clips an
                absolutely positioned, elevated-z-index child to a parent's
                clip-path correctly; Safari doesn't reliably, so on iPad the
                arrow sat visibly straddling the mat's torn edge instead of
                staying inside it. Living outside the clipped element
                entirely sidesteps that inconsistency rather than just
                nudging the inset and hoping to dodge it. */}
            <div
              className="relative"
              style={
                heroViewTransitionName
                  ? { viewTransitionName: heroViewTransitionName }
                  : undefined
              }
            >
              {/* clip-path tears the mat's edge like a deckle-edge frame;
                  drop-shadow follows that silhouette instead of a plain box.
                  paper-fiber lays the page's own fiber over the tinted mat so it
                  reads as the same stock as the torn cards elsewhere. */}
              <div
                className="paper-fiber relative overflow-hidden p-6 sm:p-10 lg:p-12 drop-shadow-[0_20px_36px_rgba(60,50,35,0.4)]"
                style={{ clipPath: tornClipPath(1) }}
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
                <div className="relative w-full h-[38vh] sm:h-[46vh] lg:h-[52vh] max-h-[560px] min-h-[280px]">
                  <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    <MotionImage
                      key={piece.id}
                      src={piece.image}
                      alt={`${piece.title} — ${piece.medium}`}
                      fill
                      sizes="(min-width: 1024px) 40vw, 90vw"
                      priority
                      custom={direction}
                      variants={reduce ? imageVariantsReduced : imageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.55, ease: artEase }}
                      className="object-contain shadow-[0_16px_34px_-12px_rgba(30,25,15,0.45)]"
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Slider-style overlay arrows, pinned to the mat's own edge
                  (not the image's) so they never sit over the painting
                  itself, whatever its aspect ratio — same at every
                  breakpoint now. Living outside the clipped mat (see the
                  comment above) rather than a tighter inset is what keeps
                  this safe from Safari's clip-path/overflow-hidden
                  inconsistency, not the breakpoint. */}
              <div>
                <StepButton
                  direction="prev"
                  label={labels.prev}
                  onClick={() => select(active - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-50"
                />
                <StepButton
                  direction="next"
                  label={labels.next}
                  onClick={() => select(active + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-50"
                />
              </div>
            </div>
          </div>

          {/* Thumbnail rail — right under the image on phone/tablet
              (`order-2`), spanning full width below the image+label row on
              `lg` and up (`order-3`, `lg:col-span-12`). */}
          <div className="order-2 lg:order-3 lg:col-span-12 lg:border-t lg:border-sage-200 lg:pt-7">
            {/* Browse label + counter — `lg` and up only. Below `lg` both
                are dropped entirely. The step buttons used to live here
                too; they now overlay the image at every breakpoint (see
                above), so this row is just the label and count. */}
            <div className="hidden lg:flex items-center justify-between gap-6 mb-6">
              <p className="text-[10px] font-label uppercase tracking-[0.28em] text-sage-700">
                {labels.browse}
              </p>
              <p className="text-xs tracking-[0.2em] text-ink-muted tabular-nums">
                {pad(active + 1)}
                <span className="text-sage-400 mx-1.5">/</span>
                {pad(count)}
              </p>
            </div>

            {/* Bleeds past the page gutter on narrow screens so a scrolled rail
                reads as continuing off the edge rather than being clipped. */}
            <ul
              ref={railRef}
              className="hide-scrollbar flex gap-3 lg:gap-4 overflow-x-auto -mx-6 px-6 py-2 lg:mx-0 lg:px-0"
            >
              {pieces.map((p, i) => (
                <li
                  key={p.id}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  className="relative flex-none"
                >
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={i === active ? "true" : undefined}
                    aria-label={p.title}
                    className={`relative block w-16 h-16 lg:w-[76px] lg:h-[76px] rounded-xl overflow-hidden shadow-[0_6px_14px_-8px_rgba(30,25,15,0.5)] transition-opacity duration-500 ${
                      i === active ? "opacity-100" : "opacity-55 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="76px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </button>
                  {/* Slides between thumbnails instead of snapping, so the
                      active frame reads as one spotlight moving along the
                      wall rather than a border toggling on and off. */}
                  {i === active && (
                    <motion.span
                      layoutId="art-thumb-active"
                      aria-hidden
                      className="absolute -inset-1 rounded-2xl border-2 border-sage-600 pointer-events-none"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* The wall label */}
          <div className="order-3 lg:order-2 lg:col-span-6 lg:pt-4 overflow-hidden">
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
                <h3 className="font-display text-3xl lg:text-4xl text-ink leading-tight">
                  {piece.title}
                </h3>
                <p className="mt-2 text-ink-soft italic">{piece.medium}</p>

                <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-sage-200 py-5">
                  <Spec label={labels.year} value={piece.year} />
                  <Spec label={labels.size} value={piece.size} />
                </dl>

                <div className="mt-7">
                  <p className="text-[10px] font-label uppercase tracking-[0.28em] text-sage-700 mb-3">
                    {labels.story}
                  </p>
                  <p className="text-ink-soft leading-relaxed">{piece.story}</p>
                </div>

                <div className="mt-7">
                  <p className="text-[10px] font-label uppercase tracking-[0.28em] text-sage-700 mb-3">
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

/** Two-digit counter, so 1 / 11 doesn't jitter the width as it counts up. */
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-label uppercase tracking-[0.24em] text-ink-muted">
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
  className = "",
  style,
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={style}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-ink/70 hover:bg-ink/85 text-cream-50 backdrop-blur-sm ring-1 ring-cream-50/50 shadow-[0_4px_14px_rgba(0,0,0,0.5)] ${
        direction === "prev" ? "hover:-translate-x-0.5" : "hover:translate-x-0.5"
      } ${className}`}
    >
      <svg
        width="16"
        height="16"
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
