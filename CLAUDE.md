# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript type-check (no emit)
npm run lint       # ESLint
```

No test suite — verify UI changes manually in the browser.

## Architecture

### Routing and i18n

Next.js 15 App Router. All locale-aware pages live under `app/[locale]/`. There is **no i18n middleware** — the locale is part of the URL path and persisted to `localStorage`.

- Root `app/page.tsx` — client redirect; checks `localStorage.getItem("locale")` then `navigator.language`, falls back to `"es"`.
- `app/[locale]/layout.tsx` — locale guard (`isLocale`), SEO metadata, wraps content in the background layer stack.
- `app/[locale]/page.tsx` — the single scrollable homepage.
- `app/[locale]/[projectsSegment]/[slug]/page.tsx` — case study pages. The URL segment is **locale-specific**: `/es/proyectos/leaf` vs `/en/projects/leaf` — see `PROJECTS_SEGMENT` in `lib/i18n.ts`.
- `app/[locale]/photography/page.tsx` and `app/[locale]/art/page.tsx` — standalone gallery pages (fixed slug, not translated).

The locale switcher in `Navigation` updates `localStorage` and calls `router.push` with the path swapped.

### Background layer stack (locale layout)

Four fixed, `pointer-events: none` layers wrap every page, bottom to top:

| Component | z-index | What it does |
|---|---|---|
| `AmbientBackdrop` | 0 | Three slow CSS-animated aurora blobs (pure CSS, off main thread) |
| `paper-texture` class | 2 | Tileable paper PNG `multiply`-blended over aurora |
| Content (`<div className="relative z-10">`) | 10 | All page content |
| `paper-lift` | 44 | Inset box-shadow vignette |
| `paper-edge` | 45 | Backing-colored border run through SVG turbulence displacement — the torn deckle edge |

`TornEdgeDefs` injects three `<clipPath>` elements (`#torn-1/2/3`) with objectBoundingBox paths used by gallery cards and portraits. `PaperBackdrop` injects `#deckle-edge` and `#deckle-edge-sm` displacement filters used by `.paper-edge`. These SVG defs must be rendered before any element that references them.

`MotionProvider` wraps all locale content with `<MotionConfig reducedMotion="user">` so Framer Motion respects the OS setting. The CSS side is handled in `globals.css` with `@media (prefers-reduced-motion: reduce)`.

### Content system

All content is JSON, loaded at build time — no CMS, no runtime fetches.

**Projects** (`lib/projects.ts`):
- `content/projects/<slug>/project.json` — slug, order, status, feature flags, metrics, media paths
- `content/projects/<slug>/es.json` + `en.json` — all copy (card, hero, overview, problem, research, process, results, reflection)
- Adding a project requires: creating the three JSON files + registering three imports and one entry in the `sources` array in `lib/projects.ts`. See `docs/PROJECTS.md` for the full schema.

**Galleries** (`lib/galleries.ts`):
- `content/photography/gallery.json` + `es.json` + `en.json`
- `content/art/pieces.json` + `es.json` + `en.json`
- Items missing a matching locale translation are silently skipped.
- Adding a photo or artwork only requires editing JSON — no code registration.

**UI copy** (`messages/es.json`, `messages/en.json`): section labels, button text, nav items, case study chrome labels. The `Dictionary` type is inferred from `es.json` — keep both files in sync.

### View transitions

`TransitionLink` wraps `<Link>` and calls `document.startViewTransition()` when supported. Shared-element morphing is wired via `style={{ viewTransitionName: "..." }}` inline props — e.g. `project-<slug>` for case study cards → hero images, `gateway-photography` / `gateway-art` for homepage cards → gallery page banners. The CSS for these transition names lives in `globals.css` under `@supports (view-transition-name: root)`.

### Design tokens

Tailwind palette: `sage` (green), `cream`, `terracotta`, `ink` (with `ink-soft` and `ink-muted` variants). Typography: `font-display` (Cormorant Garamond, defined as a CSS utility in `globals.css`) for headings, Inter for body. Custom easing: `ease-liminal` → `cubic-bezier(0.22, 1, 0.36, 1)`.

The paper aesthetic uses three mechanisms:
1. `.paper-fiber::after` — fiber texture over any element (e.g. torn cards)
2. `clipPath: tornClipPath(1|2|3)` — ragged torn edge on cards; import `tornClipPath` from `TornEdgeDefs`
3. `filter: url(#deckle-edge)` — displacement filter for the page-level border

Keep `drop-shadow` (not `box-shadow`) on clipped elements — `box-shadow` traces the bounding box, not the torn silhouette.

## API routes

- `app/api/contact/route.ts` — POST handler for the contact form; sends email via Resend. Requires `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in `.env.local`.
- `app/api/og/route.tsx` — dynamic Open Graph image via `@vercel/og`. Accepts `?locale=es|en`.

## Adding content

**New project**: follow `docs/PROJECTS.md`. Feature flags in `project.json` toggle which case study sections render — adding a new visual pattern means adding a component + a new flag, not per-project styling.

**New photo**: drop image in `public/photography/`, add entry to `content/photography/gallery.json`, add matching id to `content/photography/es.json` and `en.json`.

**New artwork**: same pattern under `content/art/` and `public/art/`.

**CV**: place PDF at `public/cv/nathalie-gonzalez-perez-cv.pdf`.
