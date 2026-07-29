"use client";

import { motion } from "framer-motion";
import TransitionLink from "./TransitionLink";
import { tornClipPath } from "./TornEdgeDefs";

/**
 * Closing link at the bottom of the Photography and Art pages, pointing to
 * the other one. Carries the destination page's `gateway-*` view-transition
 * name, so the thumbnail here morphs into that page's hero image on click —
 * mirroring the homepage → gallery transition and closing the loop between
 * the two creative pages.
 */
export default function GalleryConnector({
  href,
  viewTransitionName,
  previewSrc,
  eyebrow,
  title,
  tagline,
}: {
  href: string;
  viewTransitionName: string;
  previewSrc: string;
  eyebrow: string;
  title: string;
  tagline: string;
}) {
  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 mt-8 md:mt-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <TransitionLink
          href={href}
          className="group flex items-center gap-6 md:gap-8 border-t border-sage-100 pt-10"
          style={{ viewTransitionName }}
        >
                  {/* Same torn-paper mount as the gallery cards, scaled down:
                      a cream margin carries the tear, the photo stays crisp. */}
                  <div
                    style={{ clipPath: tornClipPath(2) }}
                    className="paper-fiber relative w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-cream-50 p-1.5 md:p-2 -rotate-2 group-hover:rotate-0 transition-transform duration-700 ease-liminal drop-shadow-[0_10px_20px_rgba(70,60,40,0.35)]"
                  >
                    <div className="relative w-full h-full overflow-hidden bg-cream-100">
                      <img
                        src={previewSrc}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-liminal group-hover:scale-[1.08]"
                      />
                    </div>
                  </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-sage-700 mb-2">
              {eyebrow}
            </p>
            <div className="flex items-baseline justify-between gap-6 flex-wrap">
              <div>
                <h3 className="font-display text-3xl md:text-5xl text-ink italic group-hover:text-sage-700 transition-colors">
                  {title}
                </h3>
                <p className="text-ink-muted mt-1">{tagline}</p>
              </div>
              <svg
                width="28"
                height="28"
                viewBox="0 0 16 16"
                fill="none"
                className="text-sage-700 transition-transform duration-500 group-hover:translate-x-2 flex-shrink-0"
              >
                <path
                  d="M3 8h10m0 0L9 4m4 4L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </TransitionLink>
      </motion.div>
    </section>
  );
}
