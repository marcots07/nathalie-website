"use client";

import { useState } from "react";
import Image from "next/image";
import Placeholder from "./Placeholder";
import { tornClipPath, type TornVariant } from "./TornEdgeDefs";

type Props = {
  src: string;
  alt: string;
  aspect?: string;
  rounded?: string;
  /** CSS object-position, to control how the photo is framed when cropped. */
  position?: string;
  /** Mount the photo on a torn sheet of the page's paper instead of a rounded
   * box, matching the Photography and Art cards. Picks the tear variant. */
  torn?: TornVariant;
  /** The Hero portrait is the page's LCP element — skip lazy-loading and
   * hint the browser to fetch it first. Every other use stays lazy. */
  priority?: boolean;
};

/**
 * Real photograph with the site's placeholder as fallback: until the file
 * exists (or if it fails to load), the clean placeholder block renders
 * instead — no broken-image icon, no layout shift.
 */
export default function Portrait({
  src,
  alt,
  aspect = "aspect-[4/5]",
  rounded = "rounded-[2rem]",
  position = "50% 35%",
  torn,
  priority = false,
}: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <Placeholder aspect={aspect} rounded={rounded} ariaLabel={alt} />;
  }

  const photo = (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 28rem, 90vw"
      priority={priority}
      className="object-cover"
      style={{ objectPosition: position }}
      onError={() => setErrored(true)}
    />
  );

  if (torn) {
    // The paper margin has to outrun the tear depth (~1.6% of the box per
    // side, see TornEdgeDefs) or the rip bites into the photo.
    return (
      <div
        style={{ clipPath: tornClipPath(torn) }}
        className="paper-fiber relative bg-cream-50 p-3 sm:p-4 drop-shadow-[0_16px_30px_rgba(70,60,40,0.26)]"
      >
        <div className={`${aspect} relative overflow-hidden bg-cream-100`}>{photo}</div>
      </div>
    );
  }

  return <div className={`${aspect} ${rounded} relative overflow-hidden`}>{photo}</div>;
}
