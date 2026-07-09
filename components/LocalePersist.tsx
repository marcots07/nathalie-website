"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Persist the currently viewed locale to localStorage so the next visit's
 * root redirect lands on the right language.
 */
export default function LocalePersist({ locale }: { locale: Locale }) {
  useEffect(() => {
    try {
      window.localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
    } catch {
      // ignore
    }
  }, [locale]);
  return null;
}
