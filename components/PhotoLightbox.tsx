"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Photo, PhotoLabels } from "@/lib/galleries";
import { tornClipPath } from "./TornEdgeDefs";

const lightboxEase = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen viewer for the photography mosaic — a torn print floated on
 * a dark scrim, big enough to actually look at instead of squinting at a
 * grid tile. Opened from `Frame` in Photography.tsx; `index` is the
 * position within the section's full photo list (banner first, then the
 * mosaic in DOM order) so prev/next and the counter agree with what's on
 * the page, and `null` means closed — one prop instead of a second boolean
 * that could drift out of sync with it.
 *
 * Escape closes, arrow keys step, a horizontal drag past a small threshold
 * steps the same way for touch (mouse drag works too, harmless). Clicking
 * the backdrop closes; clicking the print doesn't, because the backdrop
 * and the print are siblings here, not ancestor and descendant, so a hit
 * on the print's pixels never reaches the backdrop's click handler
 * underneath it — no `stopPropagation` needed to keep the two apart.
 */
export default function PhotoLightbox({
  photos,
  index,
  onNavigate,
  onClose,
  labels,
}: {
  photos: Photo[];
  index: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
  labels: PhotoLabels;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<Element | null>(null);
  const count = photos.length;
  const open = index !== null;
  const photo = open ? photos[index] : null;

  const go = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      onNavigate(((index + delta) % count + count) % count);
    },
    [index, count, onNavigate],
  );

  // Escape and the arrow keys, only while actually open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, go]);

  // Lock the page behind the overlay, and move focus onto it — remembering
  // what had focus so it can go back there on close instead of leaving a
  // keyboard user stranded at the top of the document.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.3, ease: lightboxEase }}
        >
          <button
            type="button"
            aria-label={labels.close}
            onClick={onClose}
            className="absolute inset-0 bg-ink/90 backdrop-blur-sm cursor-zoom-out"
          />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center bg-ink/70 hover:bg-ink/85 text-cream-50 ring-1 ring-cream-50/40 backdrop-blur-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {count > 1 && (
            <>
              <ArrowButton
                direction="prev"
                label={labels.prev}
                onClick={() => go(-1)}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10"
              />
              <ArrowButton
                direction="next"
                label={labels.next}
                onClick={() => go(1)}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10"
              />
            </>
          )}

          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={photo.id}
              className="relative z-[1] w-full max-w-4xl"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: reduce ? 0.01 : 0.35, ease: lightboxEase }}
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) go(1);
                else if (info.offset.x > 80) go(-1);
              }}
            >
              <div
                style={{ clipPath: tornClipPath(2) }}
                className="paper-fiber relative bg-cream-50 p-3 sm:p-5 drop-shadow-[0_24px_50px_rgba(0,0,0,0.5)]"
              >
                {/* Fixed slot per breakpoint, same device the Art viewer
                    uses — portrait and landscape prints share one frame
                    via `object-contain` instead of resizing the dialog
                    around each photo's own aspect ratio. */}
                <div className="relative w-full h-[46vh] sm:h-[58vh] lg:h-[68vh] max-h-[640px] min-h-[220px]">
                  <Image
                    src={photo.src}
                    alt={`${photo.title} — ${photo.place}`}
                    fill
                    sizes="90vw"
                    className="object-contain pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
                <figcaption className="mt-3 sm:mt-4 flex items-end justify-between gap-4 px-1">
                  <span>
                    <span className="block font-display italic text-lg sm:text-xl text-ink leading-tight">
                      {photo.title}
                    </span>
                    <span className="block text-xs font-label uppercase tracking-[0.2em] text-ink-muted mt-1">
                      {photo.place}
                    </span>
                  </span>
                  <span className="text-xs tabular-nums text-ink-muted flex-shrink-0">
                    {photo.year}
                  </span>
                </figcaption>
              </div>
            </motion.figure>
          </AnimatePresence>

          {count > 1 && (
            <p className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 text-xs tracking-[0.2em] text-cream-100/80 tabular-nums">
              {pad(index + 1)}
              <span className="mx-1.5 text-cream-100/50">/</span>
              {pad(count)}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ArrowButton({
  direction,
  label,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 bg-ink/70 hover:bg-ink/85 text-cream-50 backdrop-blur-sm ring-1 ring-cream-50/40 ${
        direction === "prev" ? "hover:-translate-x-0.5" : "hover:translate-x-0.5"
      } ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
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
