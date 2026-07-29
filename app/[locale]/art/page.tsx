import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES, galleryHref } from "@/lib/i18n";
import { getArt, getPhotography } from "@/lib/galleries";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";
import Art from "@/components/Art";
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
  const { eyebrow, heading, intro } = getArt(locale);
  return {
    title: `${heading.replace(/\.$/, "")} — ${eyebrow} — Nathalie Gonzalez Perez`,
    description: intro,
  };
}

export default async function ArtPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const photoCover = (() => {
    const photos = getPhotography(locale).photos;
    return photos.find((p) => p.feature) ?? photos[0];
  })();

  return (
    <main id="main">
      <a href="#main" className="skip-link">
        {dict.nav.skipToContent}
      </a>
      <LocalePersist locale={locale} />
      <ScrollProgress />
      <Navigation locale={locale} dict={dict} variant="sub" />

      <div className="pt-28 md:pt-32">
        <Art locale={locale} heroViewTransitionName="gateway-art" />

        {photoCover && (
          <GalleryConnector
            href={galleryHref(locale, "photography")}
            viewTransitionName="gateway-photography"
            previewSrc={photoCover.src}
            eyebrow={dict.galleryConnector.toPhotography.eyebrow}
            title={dict.galleryConnector.toPhotography.title}
            tagline={dict.galleryConnector.toPhotography.tagline}
          />
        )}
      </div>

      <Footer dict={dict} />
    </main>
  );
}
