/**
 * Canonical site URL, used for metadataBase, OG images, sitemap and robots.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL — set this once you have the final domain.
 *   2. VERCEL_URL — the per-deployment URL Vercel injects automatically.
 *   3. The current preview domain as a sensible default.
 */
export const SITE_URL: string = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://nathalie-website-three.vercel.app";
})();
