import positions from "@/content/decor/positions.json";

/**
 * One decorative flower's placement, editable live at `/?editDecor=1`
 * (dev only — see `components/DecorEditor.tsx`) instead of hand-tuned
 * Tailwind classes. `top`/`left` are percentages of the flower's
 * positioning container (the section's inner content div); `width` is a
 * pixel value; `rotate` is degrees.
 */
export type DecorPosition = {
  section: string;
  src: string;
  top: number;
  left: number;
  width: number;
  rotate: number;
  flip?: boolean;
};

export type DecorId = keyof typeof positions;

const POSITIONS = positions as Record<DecorId, DecorPosition>;

export function getDecorPosition(id: DecorId): DecorPosition {
  const pos = POSITIONS[id];
  if (!pos) {
    throw new Error(`No decor position registered for id "${id}" — add it to content/decor/positions.json`);
  }
  return pos;
}
