"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  aspectRatio?: string;
  scrollable?: boolean;
  viewFullSizeLabel: string;
  /** Short eyebrow + one sentence of context, styled like the flow
      gallery's "design decision" note — without it a reference diagram
      lands with no explanation of what it is or why it's here. */
  label?: string;
  caption?: string;
};

/**
 * A single supporting figure for a case study — a diagram or reference
 * sheet (sitemap, design-system export), not a device screen. Rendered as a
 * plain rounded panel matching the site's other media frames, with no
 * phone/browser chrome. Missing or broken images collapse to nothing rather
 * than showing a placeholder — this is decorative supporting material, not
 * a slot that must always render something.
 */
export default function ProjectFigure({
  src,
  alt,
  aspectRatio,
  scrollable,
  viewFullSizeLabel,
  label,
  caption,
}: Props) {
  const [imgError, setImgError] = useState(false);
  if (imgError) return null;

  return (
    <div>
      {(label || caption) && (
        <div className="mb-4 border-l-2 border-sage-500 pl-5">
          {label && (
            <p className="text-[10px] font-label uppercase tracking-[0.28em] text-sage-700 mb-2">
              {label}
            </p>
          )}
          {caption && (
            <p className="text-ink-soft leading-relaxed">{caption}</p>
          )}
        </div>
      )}
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-2xl overflow-hidden border border-sage-100 bg-cream-100 shadow-sm"
      >
        <div
          className={scrollable ? "max-h-[32rem] overflow-y-auto" : "relative"}
          style={!scrollable && aspectRatio ? { aspectRatio } : undefined}
        >
          {scrollable ? (
            // Natural height, scrolls to its real size — no fixed box to
            // hand `fill` a target, so this one stays a plain <img>.
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-auto"
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              onError={() => setImgError(true)}
              className="object-cover object-top"
            />
          )}
        </div>
        <span className="flex items-center gap-2 px-4 py-2.5 text-xs font-label uppercase tracking-[0.2em] text-sage-700 border-t border-sage-100 bg-cream-100 group-hover:text-sage-800 transition-colors">
          {viewFullSizeLabel}
          <svg
            width="11"
            height="11"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path
              d="M4 12L12 4M12 4H5M12 4V11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </div>
  );
}
