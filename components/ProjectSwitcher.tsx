"use client";

import type { Dictionary, Locale } from "@/lib/i18n";
import { projectHref } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import { tornClipPath, type TornVariant } from "./TornEdgeDefs";
import TransitionLink from "./TransitionLink";

type Props = {
  locale: Locale;
  dict: Dictionary;
  /** Slug of the project whose case study is currently open, so its tag
   * can be marked current. Omit on the listing page itself — there,
   * "All" is the one that reads as current. */
  activeSlug?: string;
};

// One torn variant + resting lean per tag position, so a row of four never
// repeats the same tear or leans the same way twice in a row — a handful
// of paper scraps set down one after another, not a printed strip. Hover
// straightens the tag back to level, the same "picked up" affordance the
// Photography cards use.
const TAG_STYLE: { torn: TornVariant; rotate: string }[] = [
  { torn: 1, rotate: "-rotate-[1.6deg]" },
  { torn: 2, rotate: "rotate-[1.1deg]" },
  { torn: 3, rotate: "-rotate-[0.9deg]" },
  { torn: 2, rotate: "rotate-[1.7deg]" },
];

/**
 * A row of small torn-paper tags right under the main header, on the
 * Projects listing page and every case-study page — lets a visitor jump
 * from Leaf to Cata directly instead of scrolling back up first.
 *
 * Styled as loose paper scraps — torn edge, fiber texture, a slight
 * independent lean per tag — rather than a rounded-pill toolbar, so it
 * reads as part of the site's own paper-and-tape language instead of a
 * generic UI widget bolted on top of it. The current tag gets an actual
 * strip of washi tape instead of a solid fill, the same "you are here"
 * device the Hero portrait uses to mark itself as the one thing pinned
 * down.
 *
 * Scrolls away with the rest of the page (not pinned/sticky) — it sits
 * once, right below the header, like any other row of content.
 */
export default function ProjectSwitcher({ locale, dict, activeSlug }: Props) {
  const projects = getProjects();
  // The listing page itself lives at the fixed, untranslated "/projects"
  // segment in both locales — only individual case-study slugs get the
  // localized PROJECTS_SEGMENT (see Navigation's navHref for "projects").
  const allHref = `/${locale}/projects`;
  const onListing = !activeSlug;

  const entries = [
    {
      key: "__all",
      href: allHref,
      label: dict.projects.switcherAll,
      active: onListing,
    },
    ...projects.map((project) => ({
      key: project.slug,
      href: projectHref(locale, project.slug),
      label: project.translations[locale].card.title,
      active: project.slug === activeSlug,
    })),
  ];

  return (
    <div className="relative z-30 pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center gap-2 sm:gap-4 overflow-x-auto">
        {/* Dropped below sm: on a narrow phone this label alone can cost a
            third of the viewport, forcing every tag into a horizontal
            scroll it doesn't need to be visible. */}
        <span className="hidden sm:inline-flex shrink-0 items-center gap-2 text-[10px] font-label uppercase tracking-[0.28em] text-sage-700/80">
          <span className="w-4 h-px bg-sage-400" />
          {dict.projects.eyebrow}
        </span>
        {entries.map((entry, i) => {
          const style = TAG_STYLE[i % TAG_STYLE.length];
          return (
            <TransitionLink
              key={entry.key}
              href={entry.href}
              style={{ clipPath: tornClipPath(style.torn) }}
              className={`font-label paper-fiber relative shrink-0 inline-flex items-center bg-cream-50 px-3 sm:px-4 py-1.5 sm:py-2 text-sm whitespace-nowrap drop-shadow-[0_8px_16px_rgba(70,60,40,0.22)] transition-all duration-300 ease-liminal hover:-translate-y-0.5 hover:rotate-0 hover:drop-shadow-[0_10px_20px_rgba(70,60,40,0.28)] ${
                style.rotate
              } ${
                entry.active
                  ? "text-ink"
                  : "text-ink-soft hover:text-sage-700"
              }`}
            >
              {entry.label}
              {entry.active && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  aria-hidden
                  src="/tape.png"
                  alt=""
                  className="absolute -top-2.5 left-1/2 z-10 w-10 h-auto -translate-x-1/2 -rotate-2 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(42,42,38,0.15)]"
                />
              )}
            </TransitionLink>
          );
        })}
      </div>
    </div>
  );
}
