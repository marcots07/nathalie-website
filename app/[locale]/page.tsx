import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
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
      <Hero dict={dict} />
      <About dict={dict} />
      <Experience dict={dict} />
      <Projects dict={dict} locale={locale} />
      <Skills dict={dict} />
      <Contact dict={dict} locale={locale} />
      <Footer dict={dict} />
    </main>
  );
}
