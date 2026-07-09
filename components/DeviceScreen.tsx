"use client";

import { useState } from "react";
import Placeholder from "./Placeholder";

type Props = {
  src?: string;
  alt: string;
  /** CSS aspect-ratio value, e.g. "393 / 852" or "1440 / 1024". */
  aspectRatio?: string;
  /** Phone bezel (default) or browser window chrome. */
  frame?: "device" | "browser";
};

/**
 * One screen in the flows gallery: a real screenshot inside a phone bezel
 * or a browser window, matching the placeholder variants. If no src is
 * configured or the image fails to load, falls back to the placeholder so
 * a missing file never breaks the gallery.
 */
export default function DeviceScreen({
  src,
  alt,
  aspectRatio,
  frame = "device",
}: Props) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return frame === "browser" ? (
      <Placeholder aspect="aspect-[7/5]" variant="browser" rounded="rounded-2xl" />
    ) : (
      <Placeholder aspect="aspect-[9/16]" variant="device" rounded="rounded-3xl" />
    );
  }

  if (frame === "browser") {
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

  return (
    <div className="rounded-3xl overflow-hidden bg-ink/90 p-2 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        className="w-full rounded-xl object-cover"
        style={{ aspectRatio: aspectRatio ?? "9 / 16" }}
        onError={() => setErrored(true)}
      />
    </div>
  );
}
