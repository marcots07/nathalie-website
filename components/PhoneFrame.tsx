"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  /** CSS aspect-ratio of the screen area, e.g. "393 / 852". */
  aspectRatio?: string;
  className?: string;
};

/**
 * iPhone-style device frame: dark rounded body, and a black dynamic-island
 * pill at top center that reads as the camera/notch. The screenshots have
 * a little white space added at the top so the island sits over blank
 * space rather than covering UI. Falls back to a soft sage block when no
 * image is set or it fails to load.
 */
export default function PhoneFrame({
  src,
  alt,
  aspectRatio = "393 / 852",
  className = "",
}: Props) {
  const [errored, setErrored] = useState(false);
  const showImg = src && !errored;

  return (
    <div
      className={`relative rounded-[2rem] bg-ink p-[3px] shadow-[0_20px_45px_-15px_rgba(42,42,38,0.45)] ring-1 ring-black/10 ${className}`}
    >
      <div className="relative rounded-[1.75rem] bg-ink p-1.5">
        <div
          className="relative overflow-hidden rounded-[1.4rem] bg-cream-100"
          style={{ aspectRatio }}
        >
          {showImg ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt}
              draggable={false}
              loading="lazy"
              className="w-full h-full object-cover object-top"
              onError={() => setErrored(true)}
            />
          ) : (
            <div
              className="w-full h-full bg-sage-100/70"
              role="img"
              aria-label={alt}
            />
          )}

          {/* Dynamic island / camera */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[1.6%] -translate-x-1/2 h-[3.2%] min-h-[10px] w-[26%] rounded-full bg-black/90"
          />
        </div>
      </div>
    </div>
  );
}
