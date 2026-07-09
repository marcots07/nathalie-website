"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let target = DEFAULT_LOCALE as string;
    try {
      const stored = window.localStorage.getItem("locale");
      if (stored && isLocale(stored)) {
        target = stored;
      } else {
        const nav = navigator.language.toLowerCase();
        if (nav.startsWith("en")) target = "en";
      }
    } catch {
      // localStorage disabled — fall back to default.
    }
    router.replace(`/${target}`);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="w-8 h-8 rounded-full border-2 border-sage-300 border-t-sage-600 animate-spin" />
    </main>
  );
}
