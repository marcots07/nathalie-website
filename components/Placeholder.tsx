type PlaceholderProps = {
  aspect?: string;
  className?: string;
  rounded?: string;
  variant?: "default" | "device" | "browser";
  ariaLabel?: string;
};

/**
 * Neutral placeholder block used everywhere real imagery will land later.
 * No text or icon inside — pure surface, so it reads as a considered gap
 * rather than a "coming soon" sticker.
 */
export default function Placeholder({
  aspect = "aspect-[4/3]",
  className = "",
  rounded = "rounded-2xl",
  variant = "default",
  ariaLabel,
}: PlaceholderProps) {
  if (variant === "browser") {
    return (
      <div
        role="img"
        aria-label={ariaLabel ?? "Image placeholder"}
        className={`${rounded} overflow-hidden border border-sage-100 bg-cream-100 shadow-sm ${className}`}
      >
        <div className="flex items-center gap-1.5 px-4 py-2 bg-cream-200/60 border-b border-sage-100">
          <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
        </div>
        <div className={`${aspect} bg-sage-100/70`} />
      </div>
    );
  }

  if (variant === "device") {
    return (
      <div
        role="img"
        aria-label={ariaLabel ?? "Image placeholder"}
        className={`${rounded} overflow-hidden bg-ink/90 p-2 shadow-sm ${className}`}
      >
        <div className={`${aspect} bg-sage-100/70 rounded-xl`} />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? "Image placeholder"}
      className={`${aspect} ${rounded} bg-sage-100/70 ${className}`}
    />
  );
}
