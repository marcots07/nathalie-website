import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import CaseStudy from "@/components/CaseStudy";
import LocalePersist from "@/components/LocalePersist";

const SLUGS = ["leaf", "cata"] as const;

export function generateStaticParams() {
  return ["es", "en"].flatMap((locale) =>
    SLUGS.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  if (!(SLUGS as readonly string[]).includes(slug)) return {};
  const dict = getDictionary(locale);
  const data = dict.caseStudy[slug as (typeof SLUGS)[number]];
  return {
    title: `${data.hero.title} — Nathalie González Pérez`,
    description: data.hero.tagline,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (!(SLUGS as readonly string[]).includes(slug)) notFound();
  const dict = getDictionary(locale);
  const typedSlug = slug as (typeof SLUGS)[number];

  return (
    <main>
      <LocalePersist locale={locale} />
      <ScrollProgress />
      <Navigation locale={locale} dict={dict} variant="sub" />
      <CaseStudy slug={typedSlug} dict={dict} locale={locale} />
      <Footer dict={dict} />
    </main>
  );
}
