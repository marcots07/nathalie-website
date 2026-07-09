import es from "@/messages/es.json";
import en from "@/messages/en.json";

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = {
  es: es as Dictionary,
  en: en as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

/**
 * Localized URL segment for the case-study collection.
 * ES → /es/proyectos/... · EN → /en/projects/...
 */
export const PROJECTS_SEGMENT: Record<Locale, string> = {
  es: "proyectos",
  en: "projects",
};

export const PROJECT_SLUGS = ["leaf", "cata"] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}

export function projectHref(locale: Locale, slug: ProjectSlug): string {
  return `/${locale}/${PROJECTS_SEGMENT[locale]}/${slug}`;
}
