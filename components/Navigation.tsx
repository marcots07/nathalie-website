"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary, Locale } from "@/lib/i18n";
import { otherLocale, PROJECTS_SEGMENT } from "@/lib/i18n";
import { tornClipPath, type TornVariant } from "./TornEdgeDefs";
import TransitionLink from "./TransitionLink";

type NavProps = {
  locale: Locale;
  dict: Dictionary;
};

const NAV_ITEMS = [
  { key: "experience" },
  { key: "projects" },
  { key: "photography" },
  { key: "art" },
  { key: "skills" },
  { key: "contact" },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"];

// One torn variant + resting lean per nav item, same device the Projects
// switcher uses, so the primary nav reads as the same handful of paper
// scraps rather than a plain link row — the site's signature, not a
// one-off. Rotation is a plain degree number (not a Tailwind class)
// because framer-motion drives it, layered with the hover/entrance state.
const TAG_STYLE: { torn: TornVariant; rotate: number }[] = [
  { torn: 1, rotate: -1.4 },
  { torn: 2, rotate: 1.0 },
  { torn: 3, rotate: -1.0 },
  { torn: 1, rotate: 1.5 },
  { torn: 2, rotate: -1.3 },
  { torn: 3, rotate: 1.1 },
];

export default function Navigation({ locale, dict }: NavProps) {
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
    // Swap locale prefix, then swap the localized projects segment so
    // /es/proyectos/slug → /en/projects/slug (not a 404).
    let nextPath = pathname.replace(/^\/(es|en)/, `/${next}`);
    nextPath = nextPath.replace(
      `/${PROJECTS_SEGMENT[locale]}/`,
      `/${PROJECTS_SEGMENT[next]}/`,
    );
    router.push(nextPath);
  };

  const navHref = (key: NavKey) => `/${locale}/${key}`;

  // Highlight the nav item whose route matches the current path.
  // "projects" also highlights when inside a case-study URL (/{locale}/{segment}/{slug}).
  const isActive = (key: NavKey) => {
    const href = navHref(key);
    if (pathname.startsWith(href)) return true;
    if (key === "projects") {
      const segHref = `/${locale}/${PROJECTS_SEGMENT[locale]}`;
      return pathname.startsWith(segHref);
    }
    return false;
  };

  const tagClass = (key: NavKey, size: "desktop" | "mobile") =>
    `font-label paper-fiber relative block bg-cream-50 whitespace-nowrap transition-colors duration-300 ${
      size === "desktop" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base"
    } ${
      isActive(key)
        ? "text-ink"
        : "text-ink-soft hover:text-sage-700"
    }`;

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
          className={`font-display text-lg md:text-xl tracking-tightest transition-colors editorial-link ${
            pathname === `/${locale}` ? "text-sage-700" : "text-ink hover:text-sage-700"
          }`}
        >
          Nathalie
        </Link>

        <nav className="hidden lg:flex items-center gap-2 lg:gap-3">
          {NAV_ITEMS.map((item, i) => {
            const style = TAG_STYLE[i % TAG_STYLE.length];
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: -10, rotate: style.rotate * 2.2 }}
                animate={{ opacity: 1, y: 0, rotate: style.rotate }}
                whileHover={{ rotate: 0, y: -2 }}
                whileTap={{ y: 0, scale: 0.96 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 16,
                  delay: 0.4 + i * 0.06,
                }}
              >
                <TransitionLink
                  href={navHref(item.key)}
                  style={{ clipPath: tornClipPath(style.torn) }}
                  className={tagClass(item.key, "desktop")}
                >
                  {dict.nav[item.key]}
                  {isActive(item.key) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      aria-hidden
                      src="/tape.png"
                      alt=""
                      className="absolute -top-2 left-1/2 z-10 w-8 h-auto -translate-x-1/2 -rotate-2 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(42,42,38,0.15)]"
                    />
                  )}
                </TransitionLink>
              </motion.div>
            );
          })}
          <button
            onClick={switchLocale}
            className="text-sm text-ink-soft hover:text-sage-700 transition-colors border border-sage-200 rounded-full px-3 py-1 ml-1"
            aria-label={dict.nav.switchLanguage}
          >
            <span className={locale === "es" ? "text-sage-700" : ""}>ES</span>
            <span className="mx-1 text-sage-300">/</span>
            <span className={locale === "en" ? "text-sage-700" : ""}>EN</span>
          </button>
        </nav>

        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
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
            className="lg:hidden bg-cream-50/95 backdrop-blur border-t border-sage-100/60 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col items-start gap-3">
              {NAV_ITEMS.map((item, i) => {
                const style = TAG_STYLE[i % TAG_STYLE.length];
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: i * 0.05,
                    }}
                    style={{ rotate: style.rotate }}
                    whileTap={{ scale: 0.96, rotate: 0 }}
                  >
                    <TransitionLink
                      href={navHref(item.key)}
                      onClick={() => setMobileOpen(false)}
                      style={{ clipPath: tornClipPath(style.torn) }}
                      className={tagClass(item.key, "mobile")}
                    >
                      {dict.nav[item.key]}
                      {isActive(item.key) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          aria-hidden
                          src="/tape.png"
                          alt=""
                          className="absolute -top-2.5 left-1/2 z-10 w-9 h-auto -translate-x-1/2 -rotate-2 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(42,42,38,0.15)]"
                        />
                      )}
                    </TransitionLink>
                  </motion.div>
                );
              })}
              <button
                onClick={() => {
                  switchLocale();
                  setMobileOpen(false);
                }}
                className="text-sm text-ink-soft self-start border border-sage-200 rounded-full px-3 py-1"
              >
                <span className={locale === "es" ? "text-sage-700" : ""}>ES</span>
                <span className="mx-1 text-sage-300">/</span>
                <span className={locale === "en" ? "text-sage-700" : ""}>EN</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
