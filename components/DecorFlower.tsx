"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getDecorPosition, type DecorId } from "@/lib/decor";
import { useDecorEdit } from "./DecorEditContext";

const MIN_WIDTH = 48;
// High enough that a full "behind the text" paper scrap (see Skills.tsx)
// can be scaled up to cover a whole card, not just a small flower cutout.
const MAX_WIDTH = 1200;

// A stable per-id "personality" for the idle sway — small hash of the id
// string picks a duration/delay/amplitude so a page with several flowers
// doesn't have them all swinging in perfect unison, which would read as
// mechanical rather than like loose paper catching a breeze.
function swayParams(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  return {
    delay: (h % 1000) / 1000, // seconds, staggers the loop start
    duration: 2.2 + (h % 16) / 8, // seconds for one rotate half-cycle
    rotateAmp: 4 + (h % 4), // degrees, peak deviation
    bobAmp: 4 + (h % 5), // px, peak deviation
  };
}

/**
 * A pressed flower / dried botanical PNG, tucked into a section as pure
 * decoration — the same "taped to the page" idea as the Hero portrait's
 * washi tape, applied in small doses across the site instead of once.
 *
 * Position comes from `content/decor/positions.json` (via `lib/decor.ts`),
 * keyed by `id`, instead of being hard-coded per call site — so it can be
 * dragged into place live (see DecorEditToggle) instead of hand-tuned
 * Tailwind classes and a round trip through chat every time it needs to
 * move a few pixels.
 *
 * Outside edit mode it also sways continuously — a small infinite
 * rotation + vertical bob loop, independent of scrolling, with a per-id
 * duration/delay (see `swayParams`) so a page with several flowers doesn't
 * move as one rigid unit. Off entirely when the visitor prefers reduced
 * motion, and paused (falls back to the static angle) while actively
 * dragging so it never fights the edit-mode interactions.
 *
 * Paints ABOVE the section's content (`z-20`) by default, not below it —
 * a pressed flower taped onto a scrapbook page sits on top of the photo
 * it's next to. Stays under the fixed nav (`z-40`) and the page's torn
 * edge (`z-45`) so it can never cover site chrome. Pass `behind` for a
 * decoration meant to sit under the surrounding text instead (e.g. a
 * paper scrap a heading + list reads as written on) — it drops to `z-0`
 * outside edit mode, then lifts above the text while edit mode is on so
 * it stays grabbable instead of getting shadowed by the content sitting
 * on top of it.
 *
 * Outside edit mode this is purely visual: `aria-hidden`, empty alt, and
 * `pointer-events-none` so it never intercepts a click. In edit mode it
 * becomes interactive (drag to move, scroll to resize, Shift+scroll to
 * rotate) and persists every change to disk through `/api/decor-positions`
 * — a dev-only route, so this whole interaction path is inert in
 * production even if `editMode` somehow got set.
 */
export default function DecorFlower({ id, behind }: { id: DecorId; behind?: boolean }) {
  const base = getDecorPosition(id);
  const flip = base.flip ?? false;
  const { editMode } = useDecorEdit();
  const reducedMotion = useReducedMotion();
  const [pos, setPos] = useState({
    top: base.top,
    left: base.left,
    width: base.width,
    rotate: base.rotate,
  });
  const [saved, setSaved] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    parentRect: DOMRect;
    startX: number;
    startY: number;
    startTop: number;
    startLeft: number;
  } | null>(null);

  const { delay, duration: baseDuration, rotateAmp: baseRotateAmp, bobAmp: baseBobAmp } = swayParams(id);
  // `behind` decorations (e.g. the Skills paper scraps) read as a fixed
  // sheet the text is written on, not a loose hanging flower — a full
  // bob-and-swing loop read as the whole card drifting, so these get a
  // slower, smaller, purely horizontal drift instead of the flowers'
  // vertical bob + rotation.
  const duration = behind ? baseDuration * 2.2 : baseDuration;
  const rotateAmp = behind ? baseRotateAmp * 0.3 : baseRotateAmp;
  const bobAmp = behind ? baseBobAmp * 0.6 : baseBobAmp;
  const swayEnabled = !editMode && !reducedMotion;

  const persist = (next: typeof pos) => {
    fetch("/api/decor-positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...next }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.ok) {
          setSaved(true);
          window.setTimeout(() => setSaved(false), 1200);
        }
      })
      .catch(() => {
        // Non-critical — the visual position already updated locally;
        // a failed save just means it won't survive a reload.
      });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editMode) return;
    const parent = wrapRef.current?.offsetParent as HTMLElement | null;
    if (!parent) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      parentRect: parent.getBoundingClientRect(),
      startX: e.clientX,
      startY: e.clientY,
      startTop: pos.top,
      startLeft: pos.left,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editMode || !dragState.current) return;
    const { parentRect, startX, startY, startTop, startLeft } = dragState.current;
    const dxPct = ((e.clientX - startX) / parentRect.width) * 100;
    const dyPct = ((e.clientY - startY) / parentRect.height) * 100;
    setPos((p) => ({ ...p, top: startTop + dyPct, left: startLeft + dxPct }));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!editMode || !dragState.current) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragState.current = null;
    setPos((p) => {
      persist(p);
      return p;
    });
  };

  // Wheel adjustments don't have a discrete "end" event like pointerup, so
  // the save is debounced (persist once scrolling pauses for a beat).
  // Computing `next` here and handing that exact object to both setPos and
  // the debounced persist — rather than letting the debounce read `pos`
  // from a later render's closure — matters for rapid ticks: two wheel
  // events firing before React re-renders would otherwise let the second
  // event's timeout fire holding a stale `pos` snapshot missing the first
  // event's own change.
  const wheelSaveTimer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!editMode) return;
    return () => window.clearTimeout(wheelSaveTimer.current);
  }, [editMode]);
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!editMode) return;
    e.preventDefault();
    setPos((p) => {
      const next = e.shiftKey
        ? { ...p, rotate: p.rotate + e.deltaY * 0.06 }
        : {
            ...p,
            width: Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, p.width - e.deltaY * 0.12)),
          };
      window.clearTimeout(wheelSaveTimer.current);
      wheelSaveTimer.current = window.setTimeout(() => persist(next), 400);
      return next;
    });
  };

  return (
    <>
      {/* Two concentric layers so the position (drag) and the idle sway
          never fight over the same transform:
          - outer plain <div>: position (top/left/width), z-index, and the
            drag/wheel handlers.
          - sway <motion.div>: the infinite rotate + bob loop.
          Flip is a static mirror, kept on the innermost plain <img> so it
          can never end up mixed into the sway layer's `animate` object
          (that silently killed the sway once already — see below). */}
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={onWheel}
        className={`absolute max-w-none select-none ${
          behind ? (editMode ? "z-30" : "z-0") : "z-20"
        } ${
          editMode
            ? "cursor-grab active:cursor-grabbing outline outline-2 outline-dashed outline-terracotta-500 outline-offset-4"
            : "pointer-events-none"
        }`}
        style={{
          top: `${pos.top}%`,
          left: `${pos.left}%`,
          width: `${pos.width}px`,
          touchAction: editMode ? "none" : undefined,
        }}
      >
        <motion.div
          className="max-w-none select-none"
          animate={
            swayEnabled
              ? {
                  rotate: [pos.rotate - rotateAmp, pos.rotate + rotateAmp],
                  x: behind ? [-bobAmp, bobAmp] : 0,
                  y: behind ? 0 : [-bobAmp, bobAmp],
                }
              : { rotate: pos.rotate, x: 0, y: 0 }
          }
          transition={
            swayEnabled
              ? {
                  rotate: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration,
                    ease: "easeInOut",
                    delay,
                  },
                  [behind ? "x" : "y"]: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: duration * 1.3,
                    ease: "easeInOut",
                    delay: delay + 0.4,
                  },
                }
              : { duration: 0.3 }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden
            alt=""
            src={base.src}
            className="block w-full h-auto max-w-none select-none drop-shadow-[0_14px_26px_rgba(70,60,40,0.20)]"
            style={{ transform: flip ? "scaleX(-1)" : undefined }}
          />
        </motion.div>
      </div>
      {editMode && (
        <div
          className="absolute z-40 pointer-events-none font-label text-[10px] uppercase tracking-[0.1em] text-cream-50 bg-ink/80 rounded px-1.5 py-0.5 whitespace-nowrap"
          style={{ top: `calc(${pos.top}% - 1.4rem)`, left: `${pos.left}%` }}
        >
          {id} · {Math.round(pos.width)}px · {Math.round(pos.rotate)}° {saved ? "· ✓ guardado" : ""}
        </div>
      )}
    </>
  );
}
