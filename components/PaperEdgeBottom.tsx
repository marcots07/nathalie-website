/**
 * The sheet's bottom edge, drawn once at the true end of the page instead
 * of fixed to the bottom of the viewport. Rendered as the last thing in
 * the document (after `{children}` in the locale layout) — being a plain
 * static element rather than `position: fixed` is the whole point: it
 * only ever appears once you've actually scrolled to the end of the
 * content, which is what "torn sheet of paper" is supposed to look like,
 * instead of a bottom border hovering at the bottom of whatever's on
 * screen the entire time you scroll. Pairs with `PaperEdgeTop` at the
 * other end. Phones only — see globals.css, `.paper-edge` keeps its full
 * fixed frame (both horizontal sides included) at `md` and up.
 *
 * Two elements, not one. The tear is a bordered band run through the
 * deckle displacement filter, and that filter ripples *both* of the
 * band's boundaries — so the straight lower one came out ragged too, with
 * `.paper-wash` (pinned to the viewport behind it) showing through every
 * notch it opened. At the end of the page that read as a
 * second torn edge starting just below the first: the top of the next
 * sheet. The second element seals it — an unfiltered strip of the same
 * backing colour, so its edges stay straight, lapping over the tear's
 * lower boundary and carrying on past it. A filtered element can't seal
 * its own edge, and a child of one would be filtered with it, which is
 * why this is a sibling.
 */
export default function PaperEdgeBottom() {
  return (
    <>
      <div aria-hidden className="paper-edge-bottom" />
      <div aria-hidden className="paper-edge-seal" />
    </>
  );
}
