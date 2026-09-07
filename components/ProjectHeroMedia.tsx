"use client";

import { motion } from "framer-motion";
import DeviceScreen from "./DeviceScreen";
import PhoneFrame from "./PhoneFrame";

export type HeroMedia = {
  layout: "phone-triptych" | "single-phone" | "single-browser";
  screens: string[];
  /** Mobile companion for `single-browser`'s screens[0] — when present,
      the desktop and mobile screens render side by side as a responsive
      comparison instead of the plain single browser frame. */
  mobileScreen?: string;
};

type Props = {
  hero: HeroMedia;
  alt: string;
  /** Aspect ratio for the browser layout (desktop screenshots). */
  aspectRatio?: string;
  /** Labels shown under the desktop/mobile pair when `hero.mobileScreen`
      is present. */
  viewLabels?: { desktop: string; mobile: string };
};

/**
 * Case-study hero visual, chosen per project via `media.hero`:
 *  - phone-triptych  → three iPhone frames, center raised, sides rotated.
 *  - single-phone    → one centered iPhone frame.
 *  - single-browser  → one browser-framed screenshot (for web apps); with
 *    a `mobileScreen` companion, the browser frame and a phone frame sit
 *    side by side as a responsive comparison — proof a "responsive" claim
 *    in the copy actually holds, not just a desktop screenshot.
 */
export default function ProjectHeroMedia({
  hero,
  alt,
  aspectRatio,
  viewLabels,
}: Props) {
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
  if (hero.mobileScreen) {
    return (
      <SingleBrowserComparison
        desktopSrc={hero.screens[0]}
        mobileSrc={hero.mobileScreen}
        alt={alt}
        aspectRatio={aspectRatio}
        labels={viewLabels}
      />
    );
  }

  return (
    <DeviceScreen
      src={hero.screens[0]}
      alt={alt}
      frame="browser"
      aspectRatio={aspectRatio}
    />
  );
}

/**
 * Desktop and mobile side by side: the browser frame anchors the left
 * (most of the width), the phone frame nestles against its bottom-right
 * corner at a scale that reads clearly as "the same screen, responsive" —
 * a comparison, not a switcher, so both are visible at once. Stacks
 * vertically, phone centered under the browser, below the md breakpoint.
 */
function SingleBrowserComparison({
  desktopSrc,
  mobileSrc,
  alt,
  aspectRatio,
  labels,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  aspectRatio?: string;
  labels?: { desktop: string; mobile: string };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-center gap-8 md:gap-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full md:w-[74%]"
      >
        <DeviceScreen
          src={desktopSrc}
          alt={alt}
          frame="browser"
          aspectRatio={aspectRatio}
        />
        {labels && (
          <p className="mt-3 text-center text-xs font-label uppercase tracking-[0.24em] text-ink-muted">
            {labels.desktop}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-[52%] sm:w-[38%] md:w-[22%] mx-auto md:mx-0 md:-ml-10 z-10"
      >
        <PhoneFrame src={mobileSrc} alt={alt} />
        {labels && (
          <p className="mt-3 text-center text-xs font-label uppercase tracking-[0.24em] text-ink-muted">
            {labels.mobile}
          </p>
        )}
      </motion.div>
    </div>
  );
}
