"use client";

import { useState } from "react";
import Placeholder from "./Placeholder";
import PhoneFrame from "./PhoneFrame";

type Props = {
  src?: string;
  alt: string;
  /** CSS aspect-ratio value, e.g. "393 / 852" or "1440 / 1024". */
  aspectRatio?: string;
  /** Phone bezel (default) or browser window chrome. */
  frame?: "device" | "browser";
};

/**
 * One screen in a gallery: a real screenshot inside a phone bezel (with the
 * dynamic-island notch, via PhoneFrame) or a browser window. If no src is
 * configured or the image fails to load, falls back to a placeholder so a
 * missing file never breaks the layout.
 */
export default function DeviceScreen({
  src,
  alt,
  aspectRatio,
  frame = "device",
}: Props) {
  const [errored, setErrored] = useState(false);

  if (frame === "browser") {
    if (!src || errored) {
      return (
        <Placeholder aspect="aspect-[7/5]" variant="browser" rounded="rounded-2xl" />
      );
    }
    return (
      <div className="rounded-2xl overflow-hidden border border-sage-100 bg-cream-100 shadow-sm">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-cream-200/60 border-b border-sage-100">
          <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          loading="lazy"
          className="w-full object-cover object-top"
          style={{ aspectRatio: aspectRatio ?? "7 / 5" }}
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  // Phone bezel — PhoneFrame handles its own image / fallback + the notch.
  return <PhoneFrame src={src} alt={alt} aspectRatio={aspectRatio} />;
}
