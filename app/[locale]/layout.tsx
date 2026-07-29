import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, LOCALES, type Locale } from "@/lib/i18n";
import AmbientBackdrop from "@/components/AmbientBackdrop";
import PaperBackdrop from "@/components/PaperBackdrop";
import TornEdgeDefs from "@/components/TornEdgeDefs";
import MotionProvider from "@/components/MotionProvider";

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
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL("https://nathaliegonzalez.com"),
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "es" ? "es_LA" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_LA",
      type: "website",
      images: [
        {
          url: `/api/og?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`/api/og?locale=${locale}`],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <MotionProvider>
      <AmbientBackdrop />
      <PaperBackdrop />
      <TornEdgeDefs />
      <div className="relative z-10">{children}</div>
    </MotionProvider>
  );
}
