import type { Locale } from "./i18n";

import leaf from "@/content/projects/leaf.json";
import cata from "@/content/projects/cata.json";

/**
 * Adding a new project:
 * 1. Create a JSON file under `content/projects/<slug>.json` matching the
 *    Project shape below.
 * 2. Import it here and add it to the `registry` array.
 * 3. Rebuild — routes at /es/proyectos/<slug> and /en/projects/<slug>
 *    are generated automatically by `PROJECT_SLUGS`.
 *
 * See `docs/PROJECTS.md` for the schema and each feature flag's effect.
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

export type Project = {
  slug: string;
  order: number;
  status: ProjectStatus;
  features: ProjectFeatures;
  metrics: ProjectMetrics;
  translations: Record<Locale, ProjectTranslation>;
};

const registry: Project[] = ([leaf, cata] as unknown as Project[]).slice().sort(
  (a, b) => a.order - b.order
);

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
