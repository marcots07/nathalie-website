import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LOCALES, PROJECTS_SEGMENT } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Home per locale, with hreflang alternates.
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          es: `${SITE_URL}/es`,
          en: `${SITE_URL}/en`,
        },
      },
    });
  }

  // Case studies per locale (localized segment).
  const projects = getProjects();
  for (const locale of LOCALES) {
    for (const project of projects) {
      entries.push({
        url: `${SITE_URL}/${locale}/${PROJECTS_SEGMENT[locale]}/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
