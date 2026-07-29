"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { getPhotography, type Photo } from "@/lib/galleries";
import SectionHeading from "./SectionHeading";
import { tornClipPath, type TornVariant } from "./TornEdgeDefs";

/**
 * Photography mosaic — a masonry of frames where the picture carries the
 * section and the chrome stays out of the way. Captions live under a scrim
 * that only appears on hover or keyboard focus, so a resting gallery is
 * nothing but photographs.
 *
 * Layout is CSS multi-column so portrait and landscape frames can share a
 * column without row-span math; each tile declares its aspect ratio from
 * JSON, which reserves the space and keeps the mosaic free of layout shift
 * while the images decode.
 */
export default function Photography({
  locale,
  heroViewTransitionName,
}: {
  locale: Locale;
  /** Set only when rendered as the standalone /photography page, so the
   * featured banner can morph from the homepage gateway card that linked here. */
  heroViewTransitionName?: string;
}) {
  const { eyebrow, heading, intro, counterLabel, photos } =
    getPhotography(locale);

  if (photos.length === 0) return null;

  // One photo may open the section full width; the rest fall into the mosaic.
  const banner = photos.find((p) => p.feature);
  const mosaic = photos.filter((p) => p !== banner);

  return (
    <section id="photography" className="relative py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <SectionHeading eyebrow={eyebrow} heading={heading}>
          {intro}
        </SectionHeading>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 text-xs uppercase tracking-[0.28em] text-ink-muted"
        >
          {String(photos.length).padStart(2, "0")} {counterLabel}
        </motion.p>

        {banner && (
          <div
            className="mt-6 md:mt-8"
            style={
              heroViewTransitionName
                ? { viewTransitionName: heroViewTransitionName }
                : undefined
            }
          >
            <Frame photo={banner} index={0} wide torn={3} />
          </div>
        )}

        <div className="mt-6 md:mt-8 columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6 [column-fill:_balance]">
          {mosaic.map((photo, i) => (
            <Frame
              key={photo.id}
              photo={photo}
              index={i}
              torn={((i % 3) + 1) as TornVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Frame({
  photo,
  index,
  wide = false,
  torn,
}: {
  photo: Photo;
  index: number;
  wide?: boolean;
  torn: TornVariant;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative ${wide ? "" : "mb-5 md:mb-6 break-inside-avoid"}`}
      tabIndex={0}
    >
      {/* Each print is mounted on a torn piece of the page's own paper: the
          tear lives in the cream margin so the photograph itself stays a crisp
          rectangle. clip-path (not overflow-hidden) carves that edge, and
          drop-shadow follows the ragged silhouette a box-shadow would miss.
          The margin must outrun the tear depth (~1.6% of the box per side, see
          TornEdgeDefs), which is why the full-width banner needs a wider one
          than a mosaic tile. */}
      <div
        style={{ clipPath: tornClipPath(torn) }}
        className={`paper-fiber relative bg-cream-50 drop-shadow-[0_14px_26px_rgba(70,60,40,0.26)] transition-transform duration-700 ease-liminal group-hover:rotate-0 group-focus-visible:rotate-0 ${
          wide
            ? "p-3 sm:p-4 md:p-5"
            : `p-2.5 sm:p-3 ${index % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]"}`
        }`}
      >
        {/* The window owns the aspect ratio and the image fills it absolutely.
            Reserving the box here (rather than on the <img>) keeps the mosaic
            from reflowing as images decode. */}
        <div
          style={{
            aspectRatio: wide ? photo.wideAspect ?? photo.aspect : photo.aspect,
          }}
          className="relative overflow-hidden bg-cream-100"
        >
          <img
            src={photo.src}
            alt={`${photo.title} — ${photo.place}`}
            loading={wide ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-liminal group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
          />

          {/* Caption scrim — hidden until hover/focus so the photo leads. */}
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent opacity-0 translate-y-2 transition-all duration-700 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
            <figcaption className="flex items-end justify-between gap-4">
              <span>
                <span className="block font-display italic text-xl text-cream-50 leading-tight">
                  {photo.title}
                </span>
                <span className="block text-xs uppercase tracking-[0.2em] text-cream-100/80 mt-1">
                  {photo.place}
                </span>
              </span>
              <span className="text-xs tabular-nums text-cream-100/70 flex-shrink-0">
                {photo.year}
              </span>
            </figcaption>
          </div>
        </div>
      </div>
    </motion.figure>
  );
}
