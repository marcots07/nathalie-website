/**
 * The sheet's top edge, on phones. Rendered as the first thing in the
 * document (before `{children}` in the locale layout) and left in normal
 * flow on purpose: the top of a sheet of paper belongs to the paper, so
 * you scroll past it on the way down and leave it behind, instead of it
 * riding along at the top of the screen forever.
 *
 * The other half of why it's not `position: fixed`: on iOS Safari a fixed
 * element is pinned to the *visual* viewport, so it gets pushed down and
 * pulled back up every time the browser's address bar slides in or out —
 * which is exactly the "top edge moves up and down while I scroll"
 * problem. An edge that lives in the document can't be moved by browser
 * chrome at all.
 *
 * Pairs with `PaperEdgeBottom` at the other end. Phones only — see
 * globals.css; from `md` up `.paper-edge` closes on all four sides and
 * both caps are hidden.
 */
export default function PaperEdgeTop() {
  return <div aria-hidden className="paper-edge-top" />;
}
