"use client";

import { useEffect } from "react";

/**
 * Keeps a `--vvh` custom property on <html> in sync with the *visual*
 * viewport height, in pixels — for the handful of `position: fixed`,
 * full-screen decorations in globals.css (`.paper-edge`, `.paper-lift`,
 * `.grain::before`) that are supposed to always exactly cover the screen.
 *
 * `100dvh` alone isn't enough on iOS Safari: fixed elements sized by a
 * CSS length don't reliably repaint when the bottom toolbar animates
 * between its expanded and collapsed states mid-scroll (a long-standing
 * WebKit bug, independent of which viewport unit is used) — the frame
 * stays pinned to whatever height it last painted at, leaving a gap the
 * size of the toolbar. `100dvh` stays in globals.css as the fallback for
 * the instant before this effect runs and for browsers without
 * `visualViewport`.
 *
 * Debounced, and `resize` only — not `scroll`. `.paper-edge` carries an
 * SVG turbulence filter, one of the most expensive things a mobile GPU
 * can be asked to repaint; writing `--vvh` on every `scroll` tick (the
 * visual viewport also fires that as the toolbar's collapse pans the
 * offset, not just on an actual height change) forced that repaint
 * continuously through the whole gesture and was the actual cause of the
 * janky scrolling — far worse than the brief, real gap this is fixing.
 * Waiting until 150ms after `resize` calls have stopped means the repaint
 * happens once, after the toolbar has settled into its new size, instead
 * of on every intermediate frame of its animation.
 */
export default function ViewportHeightSync() {
  useEffect(() => {
    const vv = window.visualViewport;
    let timer: number | undefined;

    const commit = () => {
      const height = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${height}px`);
    };

    commit();

    const scheduleCommit = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(commit, 150);
    };

    vv?.addEventListener("resize", scheduleCommit);
    window.addEventListener("resize", scheduleCommit);

    return () => {
      window.clearTimeout(timer);
      vv?.removeEventListener("resize", scheduleCommit);
      window.removeEventListener("resize", scheduleCommit);
    };
  }, []);

  return null;
}
