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
 */
export default function PaperEdgeBottom() {
  return <div aria-hidden className="paper-edge-bottom" />;
}
