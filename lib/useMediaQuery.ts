"use client";

import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query client-side, for the handful of cases where a
 * behavior (not just a style) needs to branch on viewport/device — e.g.
 * skipping a mouse-only effect on touch, or toning down an animation on
 * small screens. Starts `false` on the server/first paint and updates
 * after mount, same as every other client-only measurement in this
 * codebase (avoids a hydration mismatch).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
