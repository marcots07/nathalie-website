"use client";

import { useState } from "react";
import Placeholder from "./Placeholder";

type Props = {
  src: string;
  alt: string;
  aspect?: string;
  rounded?: string;
  /** CSS object-position, to control how the photo is framed when cropped. */
  position?: string;
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
}: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <Placeholder aspect={aspect} rounded={rounded} ariaLabel={alt} />;
  }

  return (
    <div className={`${aspect} ${rounded} overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ objectPosition: position }}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
