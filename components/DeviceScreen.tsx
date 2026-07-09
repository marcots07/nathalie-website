"use client";

import { useState } from "react";
import Placeholder from "./Placeholder";

type Props = {
  src?: string;
  alt: string;
  /** CSS aspect-ratio value, e.g. "393 / 852". */
  aspectRatio?: string;
};

/**
 * One screen in the flows gallery: a real screenshot inside the same dark
 * device frame used by the placeholder variant. If no src is configured
 * or the image fails to load, falls back to the device placeholder so a
 * missing file never breaks the gallery.
 */
export default function DeviceScreen({ src, alt, aspectRatio }: Props) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <Placeholder aspect="aspect-[9/16]" variant="device" rounded="rounded-3xl" />
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
