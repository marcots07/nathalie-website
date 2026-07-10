import type { MetadataRoute } from "next";
import { LOCALES, PROJECTS_SEGMENT } from "@/lib/i18n";
import { PROJECT_SLUGS } from "@/lib/projects";

const BASE_URL = "https://nathaliegonzalez.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}`])
        ),
      },
    });

    for (const slug of PROJECT_SLUGS) {
      entries.push({
        url: `${BASE_URL}/${locale}/${PROJECTS_SEGMENT[locale]}/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              `${BASE_URL}/${l}/${PROJECTS_SEGMENT[l]}/${slug}`,
            ])
          ),
        },
      });
    }
  }

  return entries;
}
