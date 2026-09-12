import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import LocalePersist from "@/components/LocalePersist";

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
    title: `${dict.skills.eyebrow} — Nathalie Gonzalez Perez`,
    description: dict.skills.heading,
  };
}

export default async function SkillsPage({
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
      <Navigation locale={locale} dict={dict} />
      <Skills dict={dict} />
      <Footer dict={dict} />
    </main>
  );
}
