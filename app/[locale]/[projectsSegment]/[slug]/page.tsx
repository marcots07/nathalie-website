import { notFound } from "next/navigation";
import {
  getDictionary,
  isLocale,
  PROJECTS_SEGMENT,
  LOCALES,
} from "@/lib/i18n";
import { getProject, getProjects } from "@/lib/projects";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import LocalePersist from "@/components/LocalePersist";

export function generateStaticParams() {
  const projects = getProjects();
  return LOCALES.flatMap((locale) =>
    projects.map((p) => ({
      locale,
      projectsSegment: PROJECTS_SEGMENT[locale],
      slug: p.slug,
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
  const project = getProject(slug);
  if (!project) return {};
  const t = project.translations[locale];
  return {
    title: `${t.hero.title} — Nathalie González Pérez`,
    description: t.hero.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; projectsSegment: string; slug: string }>;
}) {
  const { locale, projectsSegment, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (projectsSegment !== PROJECTS_SEGMENT[locale]) notFound();
  const project = getProject(slug);
  if (!project) notFound();
  const dict = getDictionary(locale);

  return (
    <main>
      <LocalePersist locale={locale} />
      <ScrollProgress />
      <Navigation locale={locale} dict={dict} variant="sub" />
      <CaseStudy project={project} dict={dict} locale={locale} />
      <Footer dict={dict} />
    </main>
  );
}
