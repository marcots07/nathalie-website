"use client";

import PhoneFrame from "./PhoneFrame";
import DeviceScreen from "./DeviceScreen";

export type CardMedia = {
  frame: "phone" | "browser";
  screen: string;
  tint?: "sage" | "terracotta" | "cream";
};

const TINTS: Record<NonNullable<CardMedia["tint"]>, string> = {
  sage: "from-sage-200 via-sage-100 to-cream-100",
  terracotta: "from-terracotta-300/70 via-cream-200 to-sage-100",
  cream: "from-cream-200 via-cream-100 to-sage-100",
};

/**
 * Landing-page project card preview: a framed device screenshot floating on
 * a soft tinted gradient, cropped so the top of the app peeks out — an
 * invitation to open the full case study. The device lifts gently on hover
 * (driven by the card's `group` hover state). Falls back to an empty frame
 * on a tinted panel when the screenshot isn't present yet.
 */
export default function ProjectCardPreview({
  card,
  alt,
}: {
  card: CardMedia;
  alt: string;
}) {
  const tint = TINTS[card.tint ?? "sage"];
  return (
    <div className={`aspect-[5/4] w-full overflow-hidden bg-gradient-to-br ${tint}`}>
      <div className="relative w-full h-full">
        {/* Soft light bloom behind the device */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-cream-50/50 blur-3xl" />

        {card.frame === "phone" ? (
          <div className="absolute left-1/2 top-[15%] -translate-x-1/2 w-[42%] rotate-[-4deg] drop-shadow-xl transition-transform duration-[900ms] ease-liminal group-hover:-translate-y-2 group-hover:rotate-[-2deg]">
            <PhoneFrame src={card.screen} alt={alt} />
          </div>
        ) : (
          <div className="absolute left-1/2 top-[13%] -translate-x-1/2 w-[80%] drop-shadow-xl transition-transform duration-[900ms] ease-liminal group-hover:-translate-y-2">
            <DeviceScreen
              src={card.screen}
              alt={alt}
              frame="browser"
              aspectRatio="1440 / 1024"
            />
          </div>
        )}
      </div>
    </div>
  );
}
