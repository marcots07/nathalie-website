import { notFound } from "next/navigation";
import {
  getDictionary,
  isLocale,
  isProjectSlug,
  PROJECT_SLUGS,
  PROJECTS_SEGMENT,
  LOCALES,
} from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import LocalePersist from "@/components/LocalePersist";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PROJECT_SLUGS.map((slug) => ({
      locale,
      projectsSegment: PROJECTS_SEGMENT[locale],
      slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; projectsSegment: string; slug: string }>;
}) {
  const { locale, projectsSegment, slug } = await params;
  if (!isLocale(locale)) return {};
  if (projectsSegment !== PROJECTS_SEGMENT[locale]) return {};
  if (!isProjectSlug(slug)) return {};
  const dict = getDictionary(locale);
  const data = dict.caseStudy[slug];
  return {
    title: `${data.hero.title} — Nathalie González Pérez`,
    description: data.hero.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectsSegment: string; slug: string }>;
}) {
  const { locale, projectsSegment, slug } = await params;
  if (!isLocale(locale)) notFound();
  // Enforce the locale-matched segment so /es/projects/... and /en/proyectos/... 404.
  if (projectsSegment !== PROJECTS_SEGMENT[locale]) notFound();
  if (!isProjectSlug(slug)) notFound();
  const dict = getDictionary(locale);

  return (
    <main>
      <LocalePersist locale={locale} />
      <ScrollProgress />
      <Navigation locale={locale} dict={dict} variant="sub" />
      <CaseStudy slug={slug} dict={dict} locale={locale} />
      <Footer dict={dict} />
    </main>
  );
}
