import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nathalie Gonzalez Perez",
  description:
    "Registered Behavior Technician transitioning into UX design and applied AI — the same mission, rebuilt.",
};

/**
 * Both entries here exist to push the paper backing colour as far into the
 * browser's own chrome as a page is allowed to reach. Neither is a layout
 * concern — `width`/`initialScale` are just Next's defaults, restated
 * because declaring `viewport` at all replaces them.
 *
 * `viewportFit: "cover"` is the precondition for Safari 26+ tinting its
 * bottom toolbar from the page instead of painting a flat white bar in the
 * gap below the content. Safari looks for a `fixed`/`sticky` element with
 * a `background-color` against the relevant viewport edge and falls back
 * to `html`'s, which is `--paper-backing` — so the bars come out the
 * colour the sheet rests on. Nothing on the page needs safe-area padding
 * to go with it: measured on an iPhone 16 Pro, a regular Safari tab
 * reports every `env(safe-area-inset-*)` as 0px with or without `cover`,
 * and the layout viewport doesn't change size either. It only starts
 * insetting for home-screen web apps.
 *
 * `themeColor` is the older mechanism and duplicates `--paper-backing` as
 * a literal, since a viewport export can't read a CSS custom property —
 * keep the two in sync. Safari 26+ parses it and ignores the value, and
 * on iOS 15–18 it only ever reached the top status strip, which the canvas
 * background already tints. It's here for Android Chrome, where the
 * address bar is browser UI that no page background can reach.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#9c8a6c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
