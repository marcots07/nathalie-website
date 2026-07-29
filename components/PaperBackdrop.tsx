/**
 * Paper treatment — a seamless fiber texture over the aurora, plus a torn
 * deckle edge around the viewport so the whole site reads as one sheet of
 * handmade paper laid on a surface.
 *
 * Layer order (all fixed, all pointer-events: none):
 *   z-2   texture  — tileable PNG multiplied over the aurora, so it tints
 *                    the existing palette instead of covering it
 *   z-44  lift     — soft inner vignette that lifts the sheet off the backing
 *   z-45  edge     — backing-colored border displaced into a ragged tear;
 *                    sits above the nav (z-40) so the sheet frames everything
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

      <div aria-hidden className="paper-texture" />
      <div aria-hidden className="paper-lift" />
      <div aria-hidden className="paper-edge" />
    </>
  );
}
