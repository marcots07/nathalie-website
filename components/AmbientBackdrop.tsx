/**
 * Site-wide aurora backdrop — pure CSS, zero JavaScript.
 *
 * Three overlapping radial-gradient fields drift on very slow keyframe
 * loops (45–80 s, translate + rotate only — never scale, so the
 * composition never appears to shrink or pump). The keyframes live in
 * globals.css (`aurora-a/b/c`); CSS transform animations composite off
 * the main thread, so this runs at 60 fps with no JS on the page at all.
 *
 * Layer order (bottom → top):
 *   1. base wash      — faint vertical gradient, guarantees continuity
 *   2. aurora blobs   — the moving color fields
 *   3. veil           — translucent cream layer that melts the blobs
 *                       together into one soft aurora (the "mesh" look)
 *
 * `prefers-reduced-motion` is handled in CSS: the blobs simply stop.
 */
export default function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* 1 — base wash */}
      <div className="absolute inset-0 aurora-base" />

      {/* 2 — aurora fields */}
      <div className="aurora-blob aurora-a" />
      <div className="aurora-blob aurora-b" />
      <div className="aurora-blob aurora-c" />

      {/* 3 — veil that fuses the fields into one soft mesh */}
      <div className="absolute inset-0 aurora-veil" />
    </div>
  );
}
