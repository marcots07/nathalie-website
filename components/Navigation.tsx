"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import { otherLocale, galleryHref } from "@/lib/i18n";
import TransitionLink from "./TransitionLink";

type NavProps = {
  locale: Locale;
  dict: Dictionary;
  variant?: "home" | "sub";
};

// Most items scroll to an in-page section; photography and art moved out to
// their own standalone pages, so those two navigate instead.
const NAV_ITEMS = [
  { key: "about", kind: "anchor" },
  { key: "experience", kind: "anchor" },
  { key: "projects", kind: "anchor" },
  { key: "photography", kind: "page" },
  { key: "art", kind: "page" },
  { key: "skills", kind: "anchor" },
  { key: "contact", kind: "anchor" },
] as const;

export default function Navigation({ locale, dict, variant = "home" }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    const next = otherLocale(locale);
    try {
      window.localStorage.setItem("locale", next);
    } catch {
      // ignore
    }
    const nextPath = pathname.replace(/^\/(es|en)/, `/${next}`);
    router.push(nextPath);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/80 backdrop-blur-md border-b border-sage-100/60"
          : "bg-transparent"
      }`}
    >
      {/* pt clears the torn paper edge so the wordmark is never clipped. */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-4 md:pt-6 h-20 md:h-28 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-display text-xl md:text-2xl tracking-tightest text-ink hover:text-sage-700 transition-colors"
        >
          Nathalie<span className="text-sage-500">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 lg:gap-8">
          {variant === "home"
            ? NAV_ITEMS.map((item) =>
                item.kind === "anchor" ? (
                  <a
                    key={item.key}
                    href={`#${item.key}`}
                    className="text-sm text-ink-soft hover:text-sage-700 transition-colors editorial-link"
                  >
                    {dict.nav[item.key]}
                  </a>
                ) : (
                  <TransitionLink
                    key={item.key}
                    href={galleryHref(locale, item.key)}
                    className="text-sm text-ink-soft hover:text-sage-700 transition-colors editorial-link"
                  >
                    {dict.nav[item.key]}
                  </TransitionLink>
                )
              )
            : (
                <Link
                  href={`/${locale}`}
                  className="text-sm text-ink-soft hover:text-sage-700 transition-colors editorial-link"
                >
                  ← {dict.nav.back}
                </Link>
              )}
          <button
            onClick={switchLocale}
            className="text-sm font-medium text-ink-soft hover:text-sage-700 transition-colors border border-sage-200 rounded-full px-3 py-1"
            aria-label={dict.nav.switchLanguage}
          >
            <span className={locale === "es" ? "text-sage-700 font-semibold" : ""}>ES</span>
            <span className="mx-1 text-sage-300">/</span>
            <span className={locale === "en" ? "text-sage-700 font-semibold" : ""}>EN</span>
          </button>
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={dict.nav.toggleMenu}
          aria-expanded={mobileOpen}
        >
          <span
            className={`block w-6 h-px bg-ink transition-transform ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-ink transition-opacity ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-px bg-ink transition-transform ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-cream-50/95 backdrop-blur border-t border-sage-100/60 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {variant === "home" ? (
                NAV_ITEMS.map((item) =>
                  item.kind === "anchor" ? (
                    <a
                      key={item.key}
                      href={`#${item.key}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-base text-ink hover:text-sage-700 transition-colors"
                    >
                      {dict.nav[item.key]}
                    </a>
                  ) : (
                    <TransitionLink
                      key={item.key}
                      href={galleryHref(locale, item.key)}
                      onClick={() => setMobileOpen(false)}
                      className="text-base text-ink hover:text-sage-700 transition-colors"
                    >
                      {dict.nav[item.key]}
                    </TransitionLink>
                  )
                )
              ) : (
                <Link
                  href={`/${locale}`}
                  className="text-base text-ink hover:text-sage-700 transition-colors"
                >
                  ← {dict.nav.back}
                </Link>
              )}
              <button
                onClick={() => {
                  switchLocale();
                  setMobileOpen(false);
                }}
                className="text-sm font-medium text-ink-soft self-start border border-sage-200 rounded-full px-3 py-1"
              >
                <span className={locale === "es" ? "text-sage-700 font-semibold" : ""}>ES</span>
                <span className="mx-1 text-sage-300">/</span>
                <span className={locale === "en" ? "text-sage-700 font-semibold" : ""}>EN</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
