/**
 * Paper treatment — a torn deckle edge around the viewport, plus a lift
 * vignette, so the whole site reads as one sheet of handmade paper laid
 * on a surface. The fiber texture and crumple wash used to be separate
 * `position: fixed` + `mix-blend-mode` divs here; they moved onto
 * `html`'s own background (see globals.css) because that combination is
 * a known Chromium scroll-compositing bug — it can leave a translucent
 * ghost of whatever was underneath (the nav bar, in practice) frozen
 * partway down the page. Baking the blend into a normal element's own
 * background paints correctly on every scroll frame instead.
 *
 * Layer order (all fixed, pointer-events: none):
 *   z-43  mask  — covers the strip of page sitting behind the browser's
 *                 own translucent bottom bar, so text never shows through
 *                 it; zero-height whenever no chrome overlaps the page
 *   z-44  lift  — soft inner vignette that lifts the sheet off the backing
 *   z-45  edge  — backing-colored border displaced into a ragged tear;
 *                 sits above the nav (z-40) so the sheet frames everything
 *
 * The tear is a CSS border run through an SVG turbulence displacement: the
 * element is inset past the viewport so only the ragged inner boundary is
 * visible. Nothing animates, so the browser rasterizes the filter once.
 *
 * Both are sized in globals.css with `lvh` ("large viewport height" — the
 * viewport at its biggest, toolbar collapsed) rather than `dvh` or a JS
 * `visualViewport` listener: sizing to the maximum means there's nothing
 * to resize as Safari's bottom toolbar animates, so there's nothing for
 * it to fail to resize (the bug a `dvh`/JS-tracked height ran into) and
 * no per-scroll-tick repaint of an SVG-filtered element to cause jank.
 *
 * Below `md` this frame is only the two side strips. Both horizontal
 * tears belong to the paper rather than to the screen there, and live in
 * the document instead: `PaperEdgeTop` before `{children}` and
 * `PaperEdgeBottom` after it, in the locale layout. You pass the top tear
 * on the way down and reach the bottom one at the true end of the page,
 * the way you would going down a real sheet — and, just as importantly,
 * neither can be shoved around by iOS Safari's address bar sliding in and
 * out, which no `position: fixed` edge can avoid. Desktop keeps the plain
 * closed frame; there's no browser chrome moving under it there.
 */
export default function PaperBackdrop() {
  return (
    <>
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute" }}
        focusable="false"
      >
        <defs>
          <filter id="deckle-edge">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.011 0.015"
              numOctaves={5}
              seed={9}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={22}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Shallower tear for narrow screens — a 22px bite reads as huge
              next to 24px of gutter and would crowd the content.
              Three octaves rather than the desktop filter's five: octaves
              4–5 contribute detail an order of magnitude finer than the
              11px displacement can express, so they're invisible here
              while still costing a phone real time generating fractal
              noise across the whole viewport before first paint. */}
          <filter id="deckle-edge-sm">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.026"
              numOctaves={3}
              seed={9}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={11}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div aria-hidden className="paper-chrome-mask" />
      <div aria-hidden className="paper-lift" />
      <div aria-hidden className="paper-edge" />
    </>
  );
}
