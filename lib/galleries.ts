import type { Locale } from "./i18n";

// Meta (ids, file paths, aspect ratios) — locale-independent.
import photoMeta from "@/content/photography/gallery.json";
import artMeta from "@/content/art/pieces.json";

// Per-locale copy.
import photoEs from "@/content/photography/es.json";
import photoEn from "@/content/photography/en.json";
import artEs from "@/content/art/es.json";
import artEn from "@/content/art/en.json";

/**
 * Photography and art galleries follow the same split as `lib/projects.ts`:
 * a meta file holds everything language-neutral (ids, image paths, aspect
 * ratios) and one file per locale holds every piece of copy, keyed by id.
 *
 * Adding a photograph:
 *   1. Drop the image in `public/photography/`.
 *   2. Add an entry to `content/photography/gallery.json`.
 *   3. Add the matching `id` block to both `es.json` and `en.json`.
 *
 * Adding an artwork is the same, under `content/art/` and `public/art/`.
 * Items missing a translation are skipped rather than rendered blank.
 */

export type PhotoMeta = {
  id: string;
  src: string;
  /** CSS aspect-ratio, e.g. "7 / 5". Reserves space so images never shift. */
  aspect: string;
  /** Pulls the photo out of the mosaic into a full-width opening banner. */
  feature?: boolean;
  /** Crop used only in the banner slot, where a wider frame reads better. */
  wideAspect?: string;
};

export type PhotoCopy = {
  title: string;
  place: string;
  year: string;
};

export type Photo = PhotoMeta & PhotoCopy;

export type PhotographySection = {
  eyebrow: string;
  heading: string;
  intro: string;
  counterLabel: string;
  photos: Photo[];
};

export type ArtTone = "sage" | "terracotta" | "cream";

export type ArtMeta = {
  id: string;
  image: string;
  aspect: string;
  tone: ArtTone;
};

export type ArtCopy = {
  title: string;
  medium: string;
  size: string;
  year: string;
  story: string;
  materials: string[];
};

export type ArtPiece = ArtMeta & ArtCopy;

export type ArtLabels = {
  story: string;
  medium: string;
  size: string;
  year: string;
  materials: string;
  browse: string;
  prev: string;
  next: string;
};

export type ArtSection = {
  eyebrow: string;
  heading: string;
  intro: string;
  labels: ArtLabels;
  pieces: ArtPiece[];
};

type PhotoLocaleFile = {
  eyebrow: string;
  heading: string;
  intro: string;
  counterLabel: string;
  items: Record<string, PhotoCopy>;
};

type ArtLocaleFile = {
  eyebrow: string;
  heading: string;
  intro: string;
  labels: ArtLabels;
  items: Record<string, ArtCopy>;
};

const photoCopy: Record<Locale, PhotoLocaleFile> = {
  es: photoEs as PhotoLocaleFile,
  en: photoEn as PhotoLocaleFile,
};

const artCopy: Record<Locale, ArtLocaleFile> = {
  es: artEs as ArtLocaleFile,
  en: artEn as ArtLocaleFile,
};

export function getPhotography(locale: Locale): PhotographySection {
  const copy = photoCopy[locale];
  const photos = (photoMeta.items as PhotoMeta[]).flatMap((meta) => {
    const text = copy.items[meta.id];
    return text ? [{ ...meta, ...text }] : [];
  });
  return {
    eyebrow: copy.eyebrow,
    heading: copy.heading,
    intro: copy.intro,
    counterLabel: copy.counterLabel,
    photos,
  };
}

export function getArt(locale: Locale): ArtSection {
  const copy = artCopy[locale];
  const pieces = (artMeta.items as ArtMeta[]).flatMap((meta) => {
    const text = copy.items[meta.id];
    return text ? [{ ...meta, ...text }] : [];
  });
  return {
    eyebrow: copy.eyebrow,
    heading: copy.heading,
    intro: copy.intro,
    labels: copy.labels,
    pieces,
  };
}
