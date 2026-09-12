import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import LocalePersist from "@/components/LocalePersist";

export default async function HomePage({
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
      <Hero dict={dict} locale={locale} />
      <About dict={dict} />
      <Footer dict={dict} />
    </main>
  );
}
