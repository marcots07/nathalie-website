"use client";

import { motion } from "framer-motion";
import { tornClipPath, type TornVariant } from "./TornEdgeDefs";

type Stage = {
  src: string;
  aspectRatio?: string;
  /** This stage is a photograph of an actual paper sketch, not a digital
   * screen — mount it on a torn cream sheet with the page's own paper-fiber
   * texture, the same treatment the Photography and Art cards use for real
   * prints, instead of forcing it into the flat rectangle the wireframe and
   * hi-fi stages use. A photographed sketch and a Figma export are
   * physically different objects; letting the frame say so reads as
   * intentional, where cropping both into identical boxes just reads as
   * a size mismatch. */
  paper?: boolean;
};

type Props = {
  stages: Stage[];
  labels?: string[];
  alt: string;
  /** Which torn-edge variant the paper stage uses, so consecutive
   * evolution rows on the same page don't repeat the exact same tear. */
  tornVariant?: TornVariant;
};

/**
 * A single screen's design story as a static, always-visible row of
 * stages — e.g. paper sketch → wireframe → high fidelity — instead of an
 * interactive reveal. Every stage renders at the same width, connected by
 * arrows, so the whole arc reads at a glance rather than requiring a drag
 * to compare just two of them.
 */
export default function EvolutionRow({
  stages,
  labels,
  alt,
  tornVariant = 1,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6">
      {stages.map((stage, i) => (
        <motion.div
          key={stage.src}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.12 }}
          className="flex items-center gap-2"
        >
          {i > 0 && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-sage-400 shrink-0"
              aria-hidden
            >
              <path
                d="M3 8h10m0 0L9 4m4 4L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {/* Deliberately small and uniform-width — the point of this row is
              to read as one continuous filmstrip (this screen's progress,
              stage after stage), not as three large, independently-sized
              images. Trading detail for that side-by-side rhythm is the
              goal, not a compromise. */}
          <div className="w-16 sm:w-28 md:w-36 lg:w-44">
            {stage.paper ? (
              // Paper margin has to outrun the tear depth (~1.6% of the box
              // per side, see TornEdgeDefs) or the rip bites into the photo —
              // same padding rule the Photography/Art cards follow.
              <div
                style={{ clipPath: tornClipPath(tornVariant) }}
                className="paper-fiber relative bg-cream-50 p-1.5 sm:p-2.5 -rotate-[1.5deg] drop-shadow-[0_10px_18px_rgba(70,60,40,0.26)]"
              >
                <div
                  className="overflow-hidden bg-cream-100"
                  style={{ aspectRatio: stage.aspectRatio ?? "4 / 3" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stage.src}
                    alt={labels?.[i] ? `${alt} — ${labels[i]}` : alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                className="rounded-md overflow-hidden border border-sage-100 bg-cream-100"
                style={{ aspectRatio: stage.aspectRatio ?? "4 / 3" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stage.src}
                  alt={labels?.[i] ? `${alt} — ${labels[i]}` : alt}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {labels?.[i] && (
              <p className="mt-2 text-center text-[9px] sm:text-[10px] font-label uppercase tracking-[0.14em] text-ink-muted leading-tight">
                {labels[i]}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
