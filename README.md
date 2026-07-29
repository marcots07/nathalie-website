# Nathalie Gonzalez Perez — Personal Website

Single-page personal website with case study subpages, built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion. Bilingual (Spanish/English).

## Getting started

```bash
npm install
cp .env.example .env.local  # fill in RESEND_API_KEY when ready
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/es` by default and remembers the last language you used in `localStorage`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run typecheck` — TypeScript type check
- `npm run lint` — ESLint

## Structure

- `app/[locale]/page.tsx` — homepage (Hero → About → Experience → Projects → Skills → Contact)
- `app/[locale]/projects/[slug]/page.tsx` — case studies (Leaf, Cata)
- `app/api/contact/route.ts` — contact form endpoint using Resend
- `app/api/og/route.tsx` — dynamic Open Graph image
- `messages/{es,en}.json` — translation dictionaries
- `components/` — UI components (Navigation, sections, case study modules)
- `public/cv/` — CV PDF (drop the real file at `nathalie-gonzalez-perez-cv.pdf`)

## Deploying to Vercel

1. Push the branch.
2. Import the repo in Vercel.
3. Set the environment variables from `.env.example` (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`).
4. Deploy.

## Content source

All copy is sourced from `Nathalie_Website_Content_Brief.md` (the content brief). The Spanish text mirrors the brief; the English text is a faithful translation of the same content.

## Assets

Image placeholders are rendered as neutral blocks with the right aspect ratio. Replace them by dropping real images into `public/` and updating the `src` prop on each `<Placeholder />` occurrence.

## CV download

Place the real PDF at `public/cv/nathalie-gonzalez-perez-cv.pdf`. The "Download CV / Descargar CV" button links to it directly.
