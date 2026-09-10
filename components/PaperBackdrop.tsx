/**
 * Paper treatment — the creased sheet, a lift vignette, and a torn deckle
 * edge around the viewport, so the whole site reads as one sheet of
 * handmade paper laid on a surface.
 *
 * Layer order (all fixed, pointer-events: none):
 *   z-0   wash  — crumple gradients + tiled fiber over the backing colour
 *   z-44  lift  — soft inner vignette that lifts the sheet off the backing
 *   z-45  edge  — backing-colored band displaced into a ragged tear; sits
 *                 above the nav (z-40) so the sheet frames everything
 *
 * The wash spent a while on `html`'s own background with
 * `background-attachment: fixed`, which iOS Safari ignores by design —
 * it degrades to `scroll`, which stretched the crease gradients across
 * the whole document and slid them under the content as you scrolled. It
 * is a real fixed element again, but with the blend baked into its own
 * background stack (`background-blend-mode`, not `mix-blend-mode`) so it
 * never has to re-composite against scrolling content; that combination
 * is the Chromium ghosting bug the earlier version was running from.
 * globals.css carries the full reasoning and the measurements.
 *
 * The tear is a backing-coloured band run through an SVG turbulence
 * displacement, inset past the viewport so only the ragged inner boundary
 * is visible. Nothing animates, so the browser rasterizes each filter
 * once — and below `md` the filters are attached to two thin strips
 * rather than to a viewport-sized box, so the region they have to
 * generate noise across is a fraction of the screen. That is what the
 * third filter here is for: the two strips can't share one, because an
 * HTML filter's coordinate space is the element's own box and they would
 * come out identical.
 *
 * Below `md` this frame is only those two side strips. Both horizontal
 * tears belong to the paper rather than to the screen there, and live in
 * the document instead: `PaperEdgeTop` before `{children}` and
 * `PaperEdgeBottom` after it, in the locale layout. You pass the top tear
 * on the way down and reach the bottom one at the true end of the page,
 * the way you would going down a real sheet — and, just as importantly,
 * neither can be shoved around by iOS Safari's address bar sliding in and
 * out, which no `position: fixed` edge can avoid. Desktop keeps the plain
 * closed frame; there's no browser chrome moving under it there.
 *
 * This component renders before `AmbientBackdrop` in the locale layout:
 * the wash and the aurora are both z-0, so DOM order is what keeps the
 * aurora drifting on top of the paper rather than under it.
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

          {/* Same tear, different seed — for the right-hand strip, which
              would otherwise be handed the exact same noise as the left
              one and tear in lockstep with it. */}
          <filter id="deckle-edge-sm-alt">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.026"
              numOctaves={3}
              seed={23}
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

      <div aria-hidden className="paper-wash" />
      <div aria-hidden className="paper-lift" />
      <div aria-hidden className="paper-edge" />
    </>
  );
}
