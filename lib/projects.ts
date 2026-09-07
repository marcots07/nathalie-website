import type { Locale } from "./i18n";

// Meta (slug, order, status, feature flags, metrics)
import leafMeta from "@/content/projects/leaf/project.json";
import cataMeta from "@/content/projects/cata/project.json";
import portfolioMeta from "@/content/projects/portfolio/project.json";

// Per-locale content files
import leafEs from "@/content/projects/leaf/es.json";
import leafEn from "@/content/projects/leaf/en.json";
import cataEs from "@/content/projects/cata/es.json";
import cataEn from "@/content/projects/cata/en.json";
import portfolioEs from "@/content/projects/portfolio/es.json";
import portfolioEn from "@/content/projects/portfolio/en.json";

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

/** One stage in a paper → wireframe → hi-fi evolution row. `paper: true`
    marks a stage that's a photograph of an actual hand-drawn sketch, so it
    renders mounted on a torn cream sheet instead of a flat digital-screen
    box — see `EvolutionRow`. */
export type EvolutionStage = {
  src: string;
  aspectRatio?: string;
  paper?: boolean;
};

export type ProjectFeatures = {
  showBeforeAfterSlider: boolean;
  showResearchGrid: boolean;
  showFlowsGallery: boolean;
  showSusGauge: boolean;
  /** Renders the Testing section (between Process and Results) — needs
      `translations[locale].testing` to be present too. Optional so
      existing project.json files don't need updating. */
  showTesting?: boolean;
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
    /** Mobile companion for `single-browser`'s screens[0] — when present,
        the browser and phone frames render side by side as a responsive
        comparison, proof the product actually adapts, not desktop only. */
    mobileScreen?: string;
  };
  /** Real screenshots for the wireframe → high-fi comparison slider.
      Paths are public/-relative; aspectRatio is a CSS value ("393 / 852").
      Omit (or leave null) to render the drawn-placeholder fallback. */
  beforeAfter?: {
    before: string;
    after: string;
    aspectRatio?: string;
    /** Chrome around the slider: browser window or phone bezel. */
    frame?: "browser" | "phone";
  } | null;
  /** A single screen's design story as a static, always-visible row of
      stages (e.g. paper sketch → wireframe → high fidelity) rather than an
      interactive reveal — use this instead of `beforeAfter` when a fixed
      side-by-side comparison reads better than a drag-to-reveal slider.
      Stages render left to right (stacking on narrow screens) with an
      arrow between each; labels come from `process.evolutionLabels`,
      matched by index. All images render plain, no device chrome. */
  evolution?: {
    stages: EvolutionStage[];
  } | null;
  /** Multiple evolution rows — one per screen — each with its own small
      heading (e.g. "Home", "My Plants"). Use instead of `evolution` when
      several screens each have a full paper→wireframe→hi-fi trail worth
      showing, rather than spotlighting just one. Headings come from
      `process.evolutionsLabels`, matched by index. */
  evolutions?: {
    stages: EvolutionStage[];
  }[];
  /** One paper-sketch photo containing several flows (e.g. three phone
      screens sketched on one notebook page) shown whole — not cropped
      apart — above one or two rows of the real screens it became. An
      arrow per screen points down to its next stage. Captions come from
      `process.sketchToScreensCaptions`, matched by index to `screens`;
      row labels (e.g. "Wireframe" / "High fidelity") come from
      `process.sketchToScreensStageLabels`. */
  sketchToScreens?: {
    sketch: string;
    sketchAspectRatio?: string;
    /** Optional middle stage (e.g. digital wireframes), matched by index
        to `screens`. Omit until that stage exists. */
    midScreens?: { src: string; aspectRatio?: string }[];
    screens: { src: string; aspectRatio?: string }[];
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
  /** A process artifact — a diagram or reference sheet, not a device
      screen. Rendered plain (no phone/browser chrome) under the Research
      section. `scrollable` caps the height and lets the frame scroll
      internally, for a tall reference sheet; the image also opens
      full-size in a new tab. */
  researchFigure?: ProjectFigure | null;
  /** Same shape as `researchFigure`, rendered under the Process section. */
  processFigure?: ProjectFigure | null;
};

export type ProjectFigure = {
  src: string;
  /** CSS aspect-ratio value, e.g. "1920 / 632". */
  aspectRatio?: string;
  /** Caps the frame's height and scrolls internally — for a reference
      sheet much taller than it is wide (e.g. a full design-system export). */
  scrollable?: boolean;
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

/** Caption for an optional supporting figure (media.researchFigure /
    media.processFigure) — a short eyebrow label plus a descriptive
    sentence, styled like the flow gallery's "design decision" note so a
    reference diagram doesn't land unexplained. */
export type ProjectFigureCaption = {
  label: string;
  caption: string;
};

/** A named persona anchoring the research — kept lightweight (no fake
    demographics grid), just enough to show the design decisions had a
    specific person behind them. */
export type ProjectPersona = {
  name: string;
  role: string;
  goals: string;
  frustrations: string;
  /** The "X needs Y because Z" problem statement. */
  statement: string;
};

export type ProjectResearch = ProjectTextBlock & {
  bullets?: string[];
  figure?: ProjectFigureCaption;
  /** Single persona — for a project built around one primary user. */
  persona?: ProjectPersona;
  /** Multiple personas — for a project whose research produced several
      distinct archetypes (e.g. one per core use case). Takes precedence
      over `persona` when both are present. */
  personas?: ProjectPersona[];
  /** A realization that reframed the product partway through — rendered
      as a distinct callout, not folded into `body`, so the pivot reads as
      a pivot. */
  insight?: string;
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
  figure?: ProjectFigureCaption;
  /** One label per `media.evolution.stages` entry, e.g.
      ["Paper sketch", "Wireframe", "High fidelity"]. */
  evolutionLabels?: string[];
  /** One small heading per `media.evolutions` row, e.g.
      ["Home", "My Plants", "Plant detail"]. */
  evolutionsLabels?: string[];
  /** Eyebrow shown above `media.sketchToScreens`, plus one caption per
      screen, matched by index. */
  sketchToScreensLabel?: string;
  sketchToScreensCaptions?: string[];
  /** Row labels for sketchToScreens when `midScreens` is present, e.g.
      ["Wireframe", "High fidelity"] — one per row, top to bottom. */
  sketchToScreensStageLabels?: string[];
};

export type ProjectResults = ProjectTextBlock & {
  learnings: string[];
};

/** One finding from a usability study — a claim backed by what participants
    actually did or said, not just a design opinion. `quote` is optional
    since not every finding has a clean verbatim line to point to. */
export type ProjectFinding = {
  title: string;
  quote?: string;
  severity: string;
  recommendation: string;
};

export type ProjectTesting = ProjectTextBlock & {
  /** Headline metrics, e.g. [{label:"Task completion", value:"100%"}]. */
  stats: { label: string; value: string }[];
  findings: ProjectFinding[];
  /** Closing synthesis — the one thing the study actually showed. */
  insight: string;
};

/** A short, specific story about a judgment call made mid-project — a bug
    caught, a setback turned into a better decision, a cleanup pass that
    mattered. Concrete moments like this read as evidence of process; a
    generic reflection paragraph alone doesn't. */
export type ProjectMoment = {
  title: string;
  body: string;
};

export type ProjectReflection = ProjectTextBlock & {
  moments?: ProjectMoment[];
};

export type ProjectTranslation = {
  card: ProjectCard;
  hero: ProjectHero;
  overview: ProjectOverview;
  problem: ProjectTextBlock;
  research: ProjectResearch;
  process: ProjectProcess;
  /** Optional — renders only when `features.showTesting` is also true. */
  testing?: ProjectTesting;
  results: ProjectResults;
  reflection: ProjectReflection;
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
  {
    meta: portfolioMeta as ProjectMeta,
    translations: {
      es: portfolioEs as ProjectTranslation,
      en: portfolioEn as ProjectTranslation,
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
    t.research.insight ?? "",
    t.research.persona?.statement ?? "",
    t.process.heading,
    t.process.body,
    t.results.heading,
    t.results.body,
    ...t.results.learnings,
    t.reflection.heading,
    t.reflection.body,
  ];
  if (t.reflection.moments) {
    for (const m of t.reflection.moments) parts.push(m.title, m.body);
  }
  if (t.process.flowGroups && t.process.flowGroups.length > 0) {
    for (const g of t.process.flowGroups) {
      parts.push(g.title, ...g.flows, ...(g.notes ?? []));
    }
  } else {
    parts.push(...t.process.flows, ...(t.process.flowNotes ?? []));
  }
  if (t.testing) {
    parts.push(t.testing.heading, t.testing.body, t.testing.insight);
    for (const f of t.testing.findings) {
      parts.push(f.title, f.quote ?? "", f.recommendation);
    }
  }
  const words = parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
