"use client";

import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import { galleryHref } from "@/lib/i18n";
import { getPhotography, getArt } from "@/lib/galleries";
import SectionHeading from "./SectionHeading";
import TransitionLink from "./TransitionLink";
import { tornClipPath, type TornVariant } from "./TornEdgeDefs";

/**
 * Homepage teaser for the standalone Photography and Art pages. Two large
 * cards carry a `gateway-{photography|art}` view-transition-name so clicking
 * through morphs straight into that page's hero image instead of a hard
 * cut — the same trick `ProjectCard` uses for case studies.
 *
 * A hand-drawn thread stitches the two cards together, reusing the
 * sage-to-terracotta gradient from the About section's "three doors" path:
 * the same visual signature for "these are connected, not separate."
 */
export default function CreativeGateway({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const photos = getPhotography(locale).photos;
  const pieces = getArt(locale).pieces;
  const photoCover = photos.find((p) => p.feature) ?? photos[0];
  const artCover = pieces[0];

  if (!photoCover || !artCover) return null;

  return (
    <section id="creative" className="relative pt-24 pb-16 md:pt-36 md:pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={dict.gateway.eyebrow} heading={dict.gateway.heading}>
          {dict.gateway.intro}
        </SectionHeading>

        {/* Each card leans toward the outer half of its column and pulls back
            in a little (translate-x) so the gutter between them reads as a
            deliberate, moderate gap rather than a void — the vertical drop
            and opposite tilt do the work of making it diagonal instead of
            raw horizontal distance. */}
        <div className="relative mt-16 md:mt-20 grid md:grid-cols-2 gap-y-14 md:gap-x-6">
          <ThreadConnector />

          <GatewayCard
            href={galleryHref(locale, "photography")}
            viewTransitionName="gateway-photography"
            image={photoCover.src}
            index={dict.gateway.photography.index}
            title={dict.gateway.photography.title}
            tagline={dict.gateway.photography.tagline}
            cta={dict.gateway.photography.cta}
            alt={photoCover.title}
            torn={1}
            backing={3}
            tilt="-rotate-2"
            tape="sage"
            className="md:justify-self-start md:max-w-[400px] md:translate-x-10"
          />
          <GatewayCard
            href={galleryHref(locale, "art")}
            viewTransitionName="gateway-art"
            image={artCover.image}
            index={dict.gateway.art.index}
            title={dict.gateway.art.title}
            tagline={dict.gateway.art.tagline}
            cta={dict.gateway.art.cta}
            alt={artCover.title}
            torn={2}
            backing={1}
            tilt="rotate-2"
            tape="terracotta"
            className="md:justify-self-end md:max-w-[400px] md:-translate-x-10 md:mt-28"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * One card = a print mounted on a torn piece of the page's own paper. The
 * tear is in the paper, not the photograph: the image keeps a crisp
 * rectangular window and the caption sits in ink on the paper margin below
 * it, the way a print would be labelled. That's what makes the ragged edge
 * legible as paper instead of a wavy-cut photo, and it lets the dark scrim
 * that used to carry the text disappear entirely.
 *
 * A second torn sheet peeks out behind, and the whole card is laid down at a
 * slight angle that straightens on hover.
 */
const TAPE_COLOR: Record<"sage" | "terracotta", string> = {
  sage: "bg-sage-200/70",
  terracotta: "bg-terracotta-300/60",
};

function GatewayCard({
  href,
  viewTransitionName,
  image,
  index,
  title,
  tagline,
  cta,
  alt,
  torn,
  backing,
  tilt,
  tape,
  className = "",
}: {
  href: string;
  viewTransitionName: string;
  image: string;
  index: string;
  title: string;
  tagline: string;
  cta: string;
  alt: string;
  torn: TornVariant;
  backing: TornVariant;
  /** Tailwind rotation class for the resting angle, e.g. "-rotate-1". */
  tilt: string;
  /** Washi-tape accent tint, keyed to each card's thread color. */
  tape: "sage" | "terracotta";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 ${className}`}
    >
      <TransitionLink
        href={href}
        className="group block"
        style={{ viewTransitionName }}
      >
        <div
          className={`relative ${tilt} group-hover:rotate-0 transition-transform duration-700 ease-liminal`}
        >
          {/* A strip of washi tape "pins" the sheet down — a small scrapbook
              cue that reads as intentional, hand-placed, rather than a plain
              rectangle floating on the page. */}
          <span
            aria-hidden
            className={`absolute -top-3 left-9 w-16 h-6 -rotate-6 ${TAPE_COLOR[tape]} shadow-sm z-20`}
            style={{ clipPath: "polygon(4% 0,100% 8%,96% 100%,0% 92%)" }}
          />

          {/* A second sheet under the first, offset enough to read clearly as
              its own piece of paper rather than a soft edge artifact. */}
          <div
            aria-hidden
            style={{ clipPath: tornClipPath(backing) }}
            className="absolute inset-0 translate-x-3 translate-y-4 rotate-[2.5deg] bg-cream-300/90 drop-shadow-[0_8px_16px_rgba(70,60,40,0.15)]"
          />

          {/* The sheet itself: clip-path tears the edge, drop-shadow follows
              that ragged silhouette (box-shadow would trace the box). The
              paper margin has to stay wider than the tear is deep — ~1.6% of
              the box per side, see TornEdgeDefs — or the rip bites into the
              photo, and the top needs the most since the card is far taller
              than wide. */}
          <div
            style={{ clipPath: tornClipPath(torn) }}
            className="paper-fiber relative bg-cream-50 px-2.5 pt-4 pb-2.5 sm:px-3 sm:pt-5 sm:pb-3 drop-shadow-[0_14px_26px_rgba(70,60,40,0.26)]"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
              <img
                src={image}
                alt={alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-liminal group-hover:scale-[1.05]"
              />
            </div>

            <div className="px-1 pt-5 pb-4 sm:pt-6 sm:pb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display italic text-lg text-sage-600 tabular-nums">
                  {index}
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                  {title}
                </h3>
              </div>
              <p className="mt-2 text-ink-soft leading-relaxed">{tagline}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-sage-700 border-b border-sage-300 pb-0.5 group-hover:border-sage-600 transition-colors">
                {cta}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                >
                  <path
                    d="M3 8h10m0 0L9 4m4 4L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </TransitionLink>
    </motion.div>
  );
}

/**
 * Decorative stitch between the two sheets — desktop only, purely visual.
 * It spans the whole grid at z-0 while the cards sit at z-10, so the thread
 * disappears under each sheet and surfaces in the gutter: one stitch passing
 * behind both, rather than a squiggle floating on top. Reuses the
 * sage-to-terracotta gradient from the About section's "three doors" path —
 * the same signature for "these are connected, not separate."
 */
function ThreadConnector() {
  return (
    <>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
      >
        <defs>
          {/* Transparent at both ends so the thread dissolves instead of
              stopping dead wherever the sheets happen to end. */}
          <linearGradient id="gateway-thread" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="#7fa374" stopOpacity="0" />
            <stop offset="22%" stopColor="#7fa374" />
            <stop offset="70%" stopColor="#c47758" />
            <stop offset="100%" stopColor="#c47758" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Runs from the photography card's lower-right area to the art
            card's upper-left area — the two points nearest each other now
            that the cards lean toward the gutter. */}
        <path
          d="M 40 44 C 50 50, 42 60, 50 65 C 58 70, 52 78, 62 84"
          stroke="url(#gateway-thread)"
          strokeWidth="2"
          strokeDasharray="1 6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>
      {/* The pin, as a div rather than an SVG circle: the stretched viewBox
          above would squash a circle into an ellipse. A soft ring behind the
          dot gives it a little weight, like a pushpin holding the thread. */}
      <span
        aria-hidden
        className="hidden md:flex items-center justify-center absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-terracotta-200/50 pointer-events-none z-0"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
      </span>
    </>
  );
}
