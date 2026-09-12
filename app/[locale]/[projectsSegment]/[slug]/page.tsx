import { notFound } from "next/navigation";
import {
  getDictionary,
  isLocale,
  PROJECTS_SEGMENT,
  LOCALES,
} from "@/lib/i18n";
import { getProject, getProjects } from "@/lib/projects";
import Navigation from "@/components/Navigation";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import LocalePersist from "@/components/LocalePersist";

export function generateStaticParams() {
  const projects = getProjects();
  // English case studies are served by the static app/[locale]/projects/[slug]
  // route. Only generate Spanish params here so there's no path collision.
  return LOCALES.filter((locale) => PROJECTS_SEGMENT[locale] !== "projects").flatMap(
    (locale) =>
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
    title: `${t.hero.title} — Nathalie Gonzalez Perez`,
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
    <main id="main">
      <a href="#main" className="skip-link">
        {dict.nav.skipToContent}
      </a>
      <LocalePersist locale={locale} />
      <Navigation locale={locale} dict={dict} />
      <ProjectSwitcher locale={locale} dict={dict} activeSlug={project.slug} />
      <CaseStudy project={project} dict={dict} locale={locale} />
      <Footer dict={dict} />
    </main>
  );
}
