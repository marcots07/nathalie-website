import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import LocalePersist from "@/components/LocalePersist";
import ScrollProgress from "@/components/ScrollProgress";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: `${dict.projects.eyebrow} — Nathalie Gonzalez Perez`,
    description: dict.projects.intro,
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main id="main">
      <a href="#main" className="skip-link">
        {dict.nav.skipToContent}
      </a>
      <LocalePersist locale={locale} />
      <ScrollProgress />
      <Navigation locale={locale} dict={dict} />
      <Projects dict={dict} locale={locale} />
      <Footer dict={dict} />
    </main>
  );
}
