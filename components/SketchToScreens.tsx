"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Screen = {
  src: string;
  aspectRatio?: string;
};

type Props = {
  sketch: string;
  sketchAspectRatio?: string;
  midScreens?: Screen[];
  screens: Screen[];
  captions?: string[];
  stageLabels?: string[];
  alt: string;
};

/**
 * One paper-sketch photo, shown whole, above one or two rows of the real
 * screens it became — an arrow per screen points down to its next stage.
 * Used when several flows were sketched together on one notebook page:
 * cropping the photo apart to pair each sketch individually can clip into
 * the drawings, so the source photo stays intact and the connection is
 * made with layout (grid columns shared across every row) instead.
 */
export default function SketchToScreens({
  sketch,
  sketchAspectRatio,
  midScreens,
  screens,
  captions,
  stageLabels,
  alt,
}: Props) {
  const cols = { gridTemplateColumns: `repeat(${screens.length}, minmax(0, 1fr))` };
  const rows = midScreens ? [midScreens, screens] : [screens];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="relative w-full rounded-lg overflow-hidden border border-sage-100 bg-cream-100"
        style={{ aspectRatio: sketchAspectRatio }}
      >
        <Image src={sketch} alt={`${alt} — sketches`} fill sizes="(min-width: 1024px) 42rem, 90vw" className="object-cover" />
      </motion.div>

      {rows.map((row, rowIndex) => (
        <div key={rowIndex}>
          <div className="grid mt-4" style={cols}>
            {row.map((s) => (
              <div key={s.src} className="flex justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-sage-400"
                  aria-hidden
                >
                  <path
                    d="M8 3v10m0 0l4-4m-4 4L4 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>

          {stageLabels?.[rowIndex] && (
            <p className="mt-2 text-center text-xs font-label uppercase tracking-[0.2em] text-sage-700">
              {stageLabels[rowIndex]}
            </p>
          )}

          <div className="grid gap-x-4 mt-3" style={cols}>
            {row.map((s, i) => (
              <motion.div
                key={s.src}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              >
                <div
                  className="relative w-full rounded-lg overflow-hidden border border-sage-100 bg-cream-100"
                  style={{ aspectRatio: s.aspectRatio ?? "393 / 852" }}
                >
                  <Image
                    src={s.src}
                    alt={alt}
                    fill
                    sizes={`${Math.round(100 / screens.length)}vw`}
                    className="object-cover object-top"
                  />
                </div>
                {rowIndex === rows.length - 1 && captions?.[i] && (
                  <p className="mt-3 text-center text-xs text-ink-muted leading-relaxed">
                    {captions[i]}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
