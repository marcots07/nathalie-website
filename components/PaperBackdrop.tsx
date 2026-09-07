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
 * Layer order (both fixed, pointer-events: none):
 *   z-44  lift  — soft inner vignette that lifts the sheet off the backing
 *   z-45  edge  — backing-colored border displaced into a ragged tear;
 *                 sits above the nav (z-40) so the sheet frames everything
 *
 * The tear is a CSS border run through an SVG turbulence displacement: the
 * element is inset past the viewport so only the ragged inner boundary is
 * visible. Nothing animates, so the browser rasterizes the filter once.
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
              next to 24px of gutter and would crowd the content. */}
          <filter id="deckle-edge-sm">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.026"
              numOctaves={5}
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

      <div aria-hidden className="paper-lift" />
      <div aria-hidden className="paper-edge" />
    </>
  );
}
