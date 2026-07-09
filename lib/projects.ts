import type { Locale } from "./i18n";

// Meta (slug, order, status, feature flags, metrics)
import leafMeta from "@/content/projects/leaf/project.json";
import cataMeta from "@/content/projects/cata/project.json";

// Per-locale content files
import leafEs from "@/content/projects/leaf/es.json";
import leafEn from "@/content/projects/leaf/en.json";
import cataEs from "@/content/projects/cata/es.json";
import cataEn from "@/content/projects/cata/en.json";

/**
 * Adding a new project:
 * 1. Create a folder `content/projects/<slug>/`.
 * 2. Add three files: `project.json` (meta), `es.json`, `en.json`.
 * 3. Register the trio in the `sources` array below.
 * 4. Rebuild — routes are generated automatically for both locales.
 *
 * See `docs/PROJECTS.md` for the schema of each file.
 */

export type ProjectStatus = "complete" | "in_progress";

export type ProjectFeatures = {
  showBeforeAfterSlider: boolean;
  showResearchGrid: boolean;
  showFlowsGallery: boolean;
  showSusGauge: boolean;
};

export type ProjectMetrics = {
  susScore: number | null;
  susOutOf: number | null;
};

export type ProjectMedia = {
  /** Landing-page card preview: a framed screenshot on a tinted panel.
      Omit to fall back to the neutral placeholder block. */
  card?: {
    frame: "phone" | "browser";
    screen: string;
    tint?: "sage" | "terracotta" | "cream";
  };
  /** Case-study hero visual. `phone-triptych` shows three iPhone frames,
      `single-phone` one, `single-browser` a browser window (for web apps).
      Omit to fall back to the neutral browser placeholder. */
  hero?: {
    layout: "phone-triptych" | "single-phone" | "single-browser";
    screens: string[];
  };
  /** Real screenshots for the wireframe → high-fi comparison slider.
      Paths are public/-relative; aspectRatio is a CSS value ("393 / 852").
      Omit (or leave null) to render the drawn-placeholder fallback. */
  beforeAfter?: {
    before: string;
    after: string;
    aspectRatio?: string;
  } | null;
  /** Real screenshots for the flows gallery, matched by index to the
      per-locale `process.flows` captions. Missing entries (or files
      that fail to load) fall back to the device placeholder. */
  screens?: { src: string }[];
  /** Grouped variant: one row per flow group, matched by index to the
      per-locale `process.flowGroups`. Takes precedence over `screens`. */
  screenGroups?: { key: string; screens: { src: string }[] }[];
  /** CSS aspect-ratio for every gallery screen (they share a device). */
  screensAspectRatio?: string;
  /** Frame drawn around gallery screenshots: phone bezel ("device",
      default) or a browser window with a title bar ("browser"). */
  screensFrame?: "device" | "browser";
};

export type ProjectMeta = {
  slug: string;
  order: number;
  status: ProjectStatus;
  features: ProjectFeatures;
  metrics: ProjectMetrics;
  media?: ProjectMedia;
};

export type ProjectCard = {
  title: string;
  tagline: string;
  summary: string;
  tags: string[];
};

export type ProjectHero = {
  title: string;
  tagline: string;
  tags: string[];
};

export type ProjectOverview = {
  role: string;
  tools: string;
  duration: string;
  type: string;
};

export type ProjectTextBlock = {
  heading: string;
  body: string;
};

export type ProjectResearch = ProjectTextBlock & {
  bullets?: string[];
};

export type ProjectProcess = ProjectTextBlock & {
  flows: string[];
  /** Optional design-decision note per screen, matched by index to
      `flows` (flat gallery). */
  flowNotes?: string[];
  /** Grouped captions for the gallery; matched by index to
      media.screenGroups. When present, rendering prefers groups.
      `notes` are per-screen design decisions, matched by index to
      the group's `flows`. */
  flowGroups?: { title: string; flows: string[]; notes?: string[] }[];
};

export type ProjectResults = ProjectTextBlock & {
  learnings: string[];
};

export type ProjectTranslation = {
  card: ProjectCard;
  hero: ProjectHero;
  overview: ProjectOverview;
  problem: ProjectTextBlock;
  research: ProjectResearch;
  process: ProjectProcess;
  results: ProjectResults;
  reflection: ProjectTextBlock;
};

export type Project = ProjectMeta & {
  translations: Record<Locale, ProjectTranslation>;
};

type ProjectSource = {
  meta: ProjectMeta;
  translations: Record<Locale, ProjectTranslation>;
};

const sources: ProjectSource[] = [
  {
    meta: leafMeta as ProjectMeta,
    translations: {
      es: leafEs as ProjectTranslation,
      en: leafEn as ProjectTranslation,
    },
  },
  {
    meta: cataMeta as ProjectMeta,
    translations: {
      es: cataEs as ProjectTranslation,
      en: cataEn as ProjectTranslation,
    },
  },
];

const registry: Project[] = sources
  .map(({ meta, translations }) => ({ ...meta, translations }))
  .sort((a, b) => a.order - b.order);

export function getProjects(): Project[] {
  return registry;
}

export function getProject(slug: string): Project | undefined {
  return registry.find((p) => p.slug === slug);
}

export function getProjectTranslation(
  project: Project,
  locale: Locale
): ProjectTranslation {
  return project.translations[locale];
}

export function getNextProject(current: Project): Project {
  const idx = registry.findIndex((p) => p.slug === current.slug);
  return registry[(idx + 1) % registry.length];
}

export const PROJECT_SLUGS: readonly string[] = registry.map((p) => p.slug);

/**
 * Rough reading-time estimate (minutes) for a case study, from the word
 * count of every text field a reader actually scans. ~200 wpm, floored
 * at 1 minute.
 */
export function estimateReadMinutes(t: ProjectTranslation): number {
  const parts: string[] = [
    t.hero.tagline,
    t.problem.heading,
    t.problem.body,
    t.research.heading,
    t.research.body,
    ...(t.research.bullets ?? []),
    t.process.heading,
    t.process.body,
    t.results.heading,
    t.results.body,
    ...t.results.learnings,
    t.reflection.heading,
    t.reflection.body,
  ];
  if (t.process.flowGroups && t.process.flowGroups.length > 0) {
    for (const g of t.process.flowGroups) {
      parts.push(g.title, ...g.flows, ...(g.notes ?? []));
    }
  } else {
    parts.push(...t.process.flows, ...(t.process.flowNotes ?? []));
  }
  const words = parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
