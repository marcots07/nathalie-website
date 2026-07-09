"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  ariaLabel?: string;
};

type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/**
 * Client-side link that wraps navigation in `document.startViewTransition`
 * when the browser supports it, so any shared `view-transition-name`
 * element (project card → case study hero image) morphs across the page
 * transition instead of hard-cutting. Falls back to a plain Next.js Link
 * everywhere else.
 */
export default function TransitionLink({
  href,
  children,
  className,
  style,
  onClick,
  ariaLabel,
}: Props) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Respect ⌘/Ctrl-click, middle click, target="_blank", etc.
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    if (e.currentTarget.getAttribute("target") === "_blank") return;

    onClick?.();

    const doc =
      typeof document !== "undefined"
        ? (document as DocumentWithVT)
        : undefined;

    if (doc?.startViewTransition) {
      e.preventDefault();
      doc.startViewTransition(() => {
        router.push(href);
      });
    }
    // Otherwise let <Link> handle the navigation itself.
  };

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
