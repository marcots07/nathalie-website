"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Placeholder from "./Placeholder";

type Props = {
  beforeLabel: string;
  afterLabel: string;
  dragHint: string;
  aspect?: string;
};

/**
 * Wireframe → high-fidelity slider: two overlaid placeholder frames revealed
 * by a draggable vertical divider. Works with mouse, touch, and keyboard.
 */
export default function BeforeAfterSlider({
  beforeLabel,
  afterLabel,
  dragHint,
  aspect = "aspect-[16/10]",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(0, Math.min(100, raw)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => {
      if (e instanceof TouchEvent) {
        if (e.touches[0]) updateFromClientX(e.touches[0].clientX);
      } else {
        updateFromClientX(e.clientX);
      }
    };
    const end = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, [dragging, updateFromClientX]);

  const startDrag = (clientX: number) => {
    updateFromClientX(clientX);
    setDragging(true);
  };

  return (
    <div>
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-3xl border border-sage-100 select-none ${aspect} cursor-ew-resize`}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => {
          if (e.touches[0]) startDrag(e.touches[0].clientX);
        }}
        role="img"
        aria-label={`${beforeLabel} / ${afterLabel}`}
      >
        {/* Before layer (bottom) — wireframe look */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cream-100">
            <svg
              viewBox="0 0 400 250"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full"
              aria-hidden
            >
              <rect x="24" y="24" width="120" height="14" rx="3" fill="#c6d9c0" />
              <rect x="24" y="48" width="200" height="10" rx="3" fill="#e2ecdf" />
              <rect x="24" y="80" width="352" height="90" rx="6" fill="none" stroke="#a3c199" strokeWidth="1.2" strokeDasharray="4 4" />
              <rect x="40" y="96" width="60" height="60" rx="4" fill="#c6d9c0" />
              <rect x="112" y="100" width="140" height="10" rx="3" fill="#e2ecdf" />
              <rect x="112" y="120" width="100" height="8" rx="3" fill="#e2ecdf" />
              <rect x="112" y="138" width="80" height="8" rx="3" fill="#e2ecdf" />
              <rect x="24" y="188" width="60" height="24" rx="12" fill="none" stroke="#a3c199" strokeWidth="1.2" />
              <rect x="96" y="188" width="60" height="24" rx="12" fill="none" stroke="#a3c199" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 text-xs uppercase tracking-[0.24em] text-sage-700 bg-cream-50/80 backdrop-blur px-2 py-1 rounded-full">
            {beforeLabel}
          </div>
        </div>

        {/* After layer (top, clipped) — high-fi look */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
        >
          <Placeholder aspect="w-full h-full" rounded="rounded-none" />
          <div className="absolute bottom-3 right-3 text-xs uppercase tracking-[0.24em] text-cream-50 bg-sage-700/90 backdrop-blur px-2 py-1 rounded-full">
            {afterLabel}
          </div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-px bg-cream-50"
          style={{ left: `${percent}%`, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}
          aria-hidden
        />
        <button
          type="button"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          aria-label={dragHint}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPercent((p) => Math.max(0, p - 4));
            if (e.key === "ArrowRight") setPercent((p) => Math.min(100, p + 4));
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            startDrag(e.clientX);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            if (e.touches[0]) startDrag(e.touches[0].clientX);
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-cream-50 border border-sage-300 shadow-md flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sage-500"
          style={{ left: `${percent}%` }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 6l-3 4 3 4M14 6l3 4-3 4"
              stroke="#496a41"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-muted text-center">{dragHint}</p>
    </div>
  );
}
