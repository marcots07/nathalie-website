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
 * size of the toolbar. The `visualViewport` API reports the *actual*
 * on-screen height and fires its own `resize`, so writing that straight
 * into a custom property forces a real, immediately-applied style change
 * every time the toolbar moves, instead of waiting on a CSS recalculation
 * that Safari may not schedule on its own.
 *
 * `100dvh` stays in globals.css as the fallback for the instant before
 * this effect runs and for browsers without `visualViewport`.
 */
export default function ViewportHeightSync() {
  useEffect(() => {
    const vv = window.visualViewport;

    const setVvh = () => {
      const height = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--vvh", `${height}px`);
    };

    setVvh();

    // `resize` fires as the toolbar animates; `scroll` catches the cases
    // where the visual viewport shifts (offsetTop changes) without a
    // height change being reported separately.
    vv?.addEventListener("resize", setVvh);
    vv?.addEventListener("scroll", setVvh);
    window.addEventListener("resize", setVvh);

    return () => {
      vv?.removeEventListener("resize", setVvh);
      vv?.removeEventListener("scroll", setVvh);
      window.removeEventListener("resize", setVvh);
    };
  }, []);

  return null;
}
