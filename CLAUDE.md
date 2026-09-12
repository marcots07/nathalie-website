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

Decorative `pointer-events: none` layers wrap every page, bottom to top:

| Component | z-index | What it does |
|---|---|---|
| `AmbientBackdrop` | 0 | Three slow CSS-animated aurora blobs (pure CSS, off main thread) |
| `paper-texture` class | 2 | Tileable paper PNG `multiply`-blended over aurora |
| Content (`<div className="relative z-10">`) | 10 | All page content |
| `paper-lift` | 44 | Inset box-shadow vignette |
| `paper-edge` | 45 | Backing-colored border run through SVG turbulence displacement — the torn deckle edge |
| `PaperEdgeTop` / `PaperEdgeBottom` | 45 | The sheet's horizontal tears on phones — **not** fixed |
| `.paper-edge-seal` | 46 | Unfiltered backing strip closing the bottom tear's lower boundary |

**The bands outside the viewport can only be painted by `html`'s `background-color`.** On iOS the screen is taller than the layout viewport ever gets — an iPhone 16 Pro measures 874pt of screen against 760pt of layout viewport — leaving roughly 114pt at the bottom and 60pt at the top that sit outside it completely. Nothing positioned reaches there: a fixed element deliberately hanging past the edge (`bottom: -140px`) is clipped at the viewport bound, which is why `body { background-color }` does nothing for it either. The canvas background is the only thing painted in that region, so it carries `--paper-backing` rather than `--bg`; see the comment on `html` in globals.css.

Five attempts went the other way first — `dvh` sizing, a `visualViewport` listener, `calc(100lvh - 100dvh)`, a `bottom`-anchored variant, and a `paper-foot` strip that was documented here before it was written and would not have worked either. Measured on an iPhone 16 Pro simulator, `lvh` is 760 and `dvh` is 678 with the bar showing, so `lvh - dvh` is 82px, not 0 as an earlier revision of this note claimed — but the number was never the point. Every one of those attempts sized *an element*, and no element can paint outside the layout viewport.

Safari's own bottom toolbar — the one carrying the address field on first load — is browser UI and cannot be styled or hidden by the page at all. `theme-color` was tried and reaches only the top status strip (verified with a magenta value); it is deliberately not set, since the canvas colour already tints that strip and a second hard-coded copy of the colour would only have to be kept in sync.

The horizontal tears are the one deliberate exception to "fixed": below `md`, `paper-edge` keeps only its two side strips, and the top and bottom tears become ordinary in-flow elements rendered before and after `{children}` in the locale layout. On iOS Safari a `position: fixed` element is anchored to the *visual* viewport, so the browser drags it down and back up every time its address bar slides in or out; an edge that lives in the document can't be moved that way, and passing the top tear on the way down and meeting the bottom one at the end is also what going down a sheet of paper actually looks like. From `md` up there's no such chrome, so the fixed frame simply closes on all four sides and both caps are `display: none`.

The bottom tear needs one extra piece the top one doesn't: `.paper-edge-seal`, rendered right after it by `PaperEdgeBottom`. The deckle filter ripples *both* boundaries of the band it's applied to, so the straight lower one came out ragged too, with `.paper-wash` — pinned to the viewport behind it — showing through every notch it opened; at the end of the page that read as a second torn edge starting below the first, the top of a next sheet. `.paper-edge-top` gets this for free from its negative `margin-top`, because 10px pushed past the document's start is unreachable, but scrollable overflow *grows* to include anything hanging off the bottom, so the matching `margin-bottom: -10px` never hid anything and is gone. The seal carries no filter, so its own edges stay straight: it laps 10px over the band (displacement reaches at most half the filter's 11px scale, and the tear line sits 26px up) and continues 14px past it, onto the same colour again on `html`.

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

Tailwind palette: `sage` (green), `cream`, `terracotta`, `ink` (with `ink-soft` and `ink-muted` variants). Typography is one typeface, Courier Prime (a typewriter face), carried under three CSS-variable tokens in `globals.css` so headings, body copy, and paper-tag labels can still diverge in weight/size (or typeface again) later without another sitewide sweep: `--font-serif` → `.font-display` utility (headings), `--font-sans` → the plain `body` rule (reading copy), `--font-mono` → `.font-label` utility (every torn-paper tag and small uppercase/tracked label — nav items, eyebrows, stat labels, pill tags, evolution-row captions). **No bold anywhere on the page, by design** — every rule/utility stays at `font-weight: 400`, and emphasis is carried by color (a darker or lighter shade of the existing sage/terracotta/ink tones) instead; don't reach for `font-medium`/`font-semibold`/`font-bold` for that job. Only one Google Fonts family is loaded (`app/layout.tsx`): Courier Prime, weight 400 only, normal and italic — no bold files requested since nothing uses them. Custom easing: `ease-liminal` → `cubic-bezier(0.22, 1, 0.36, 1)`.

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
