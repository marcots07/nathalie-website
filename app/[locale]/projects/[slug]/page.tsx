import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import { getProject, getProjects } from "@/lib/projects";
import Navigation from "@/components/Navigation";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import LocalePersist from "@/components/LocalePersist";

export function generateStaticParams() {
  const projects = getProjects();
  return LOCALES.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
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
