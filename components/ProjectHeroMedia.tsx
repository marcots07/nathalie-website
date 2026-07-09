"use client";

import { motion } from "framer-motion";
import DeviceScreen from "./DeviceScreen";
import PhoneFrame from "./PhoneFrame";

export type HeroMedia = {
  layout: "phone-triptych" | "single-phone" | "single-browser";
  screens: string[];
};

type Props = {
  hero: HeroMedia;
  alt: string;
  /** Aspect ratio for the browser layout (desktop screenshots). */
  aspectRatio?: string;
};

/**
 * Case-study hero visual, chosen per project via `media.hero`:
 *  - phone-triptych  → three iPhone frames, center raised, sides rotated.
 *  - single-phone    → one centered iPhone frame.
 *  - single-browser  → one browser-framed screenshot (for web apps).
 */
export default function ProjectHeroMedia({ hero, alt, aspectRatio }: Props) {
  if (hero.layout === "phone-triptych") {
    const [left, center, right] = hero.screens;
    return (
      <div className="flex justify-center items-end px-2">
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -8 }}
          animate={{ opacity: 1, y: 24, rotate: -6 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-[30%] sm:w-[27%] -mr-5 sm:-mr-8 z-0"
        >
          <PhoneFrame src={left} alt={alt} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-[38%] sm:w-[34%] z-20 relative"
        >
          <PhoneFrame src={center} alt={alt} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 8 }}
          animate={{ opacity: 1, y: 24, rotate: 6 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-[30%] sm:w-[27%] -ml-5 sm:-ml-8 z-0"
        >
          <PhoneFrame src={right} alt={alt} />
        </motion.div>
      </div>
    );
  }

  if (hero.layout === "single-phone") {
    return (
      <div className="max-w-[280px] mx-auto">
        <PhoneFrame src={hero.screens[0]} alt={alt} />
      </div>
    );
  }

  // single-browser
  return (
    <DeviceScreen
      src={hero.screens[0]}
      alt={alt}
      frame="browser"
      aspectRatio={aspectRatio}
    />
  );
}
