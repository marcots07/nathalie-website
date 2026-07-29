import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES, galleryHref } from "@/lib/i18n";
import { getPhotography, getArt } from "@/lib/galleries";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import Photography from "@/components/Photography";
import GalleryConnector from "@/components/GalleryConnector";
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
  const { eyebrow, heading, intro } = getPhotography(locale);
  return {
    title: `${heading.replace(/\.$/, "")} — ${eyebrow} — Nathalie Gonzalez Perez`,
    description: intro,
  };
}

export default async function PhotographyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const artCover = getArt(locale).pieces[0];

  return (
    <main id="main">
      <a href="#main" className="skip-link">
        {dict.nav.skipToContent}
      </a>
      <LocalePersist locale={locale} />
      <ScrollProgress />
      <Navigation locale={locale} dict={dict} variant="sub" />

      <div className="pt-28 md:pt-32">
        <Photography locale={locale} heroViewTransitionName="gateway-photography" />

        {artCover && (
          <GalleryConnector
            href={galleryHref(locale, "art")}
            viewTransitionName="gateway-art"
            previewSrc={artCover.image}
            eyebrow={dict.galleryConnector.toArt.eyebrow}
            title={dict.galleryConnector.toArt.title}
            tagline={dict.galleryConnector.toArt.tagline}
          />
        )}
      </div>

      <Footer dict={dict} />
    </main>
  );
}
