# Project JSON schema

Every case study is a folder under `content/projects/<slug>/` containing
three files: shared meta and one file per language. The homepage grid and
the case study pages are generated from these files — no code change is
required to add or edit a project.

## Where things live

```
content/
  projects/
    leaf/
      project.json      ← meta (slug, order, status, feature flags, metrics)
      es.json           ← Spanish content
      en.json           ← English content
    cata/
      project.json
      es.json
      en.json
lib/
  projects.ts           ← loader + types
messages/
  es.json               ← shared UI copy (section labels, button text)
  en.json               ← same, for English
```

Content per language lives in its own file so you can write or edit
Spanish without opening the English file, and vice versa. Feature flags
that control section visibility live in `project.json` only, so they never
drift between languages.

## Adding a new project

1. Create the folder `content/projects/<new-slug>/`.
2. Copy `leaf/project.json` into it and change `slug`, `order`, and any
   feature flags or metrics you need.
3. Copy `leaf/es.json` and `leaf/en.json` in, and rewrite the copy for the
   new project. Leave keys with the same shape — the case study page uses
   whatever it finds.
4. Register the new project in `lib/projects.ts` — three imports plus one
   entry in the `sources` array:

    ```ts
    import newMeta from "@/content/projects/<new-slug>/project.json";
    import newEs   from "@/content/projects/<new-slug>/es.json";
    import newEn   from "@/content/projects/<new-slug>/en.json";

    const sources: ProjectSource[] = [
      // ...leaf, cata...
      {
        meta: newMeta as ProjectMeta,
        translations: {
          es: newEs as ProjectTranslation,
          en: newEn as ProjectTranslation,
        },
      },
    ];
    ```

5. Rebuild — Next.js generates the routes automatically for both locales:
    - Spanish: `/es/proyectos/<new-slug>`
    - English: `/en/projects/<new-slug>`

## `project.json` — shared meta

```jsonc
{
  "slug": "leaf",              // unique URL slug
  "order": 1,                  // controls order in Projects grid and "Next project" link
  "status": "complete",        // "complete" | "in_progress"

  "features": {
    "showBeforeAfterSlider": true,  // wireframe → high-fi comparison slider
    "showResearchGrid": true,       // 4-tile research artifacts board
    "showFlowsGallery": true,       // horizontally scrolling device mockups
    "showSusGauge": true            // animated SUS score gauge
  },

  "metrics": {
    "susScore": 76,           // integer or null
    "susOutOf": 100           // integer or null
  },

  "media": {                  // optional — real imagery
    "beforeAfter": {          // real screenshots for the comparison slider
      "before": "/projects/leaf/home-lofi.png",   // public/-relative path
      "after": "/projects/leaf/home-hifi.png",
      "aspectRatio": "393 / 852"                  // CSS aspect-ratio value
    },
    "screens": [              // flat flows gallery, matched by INDEX to
      { "src": "/projects/leaf/home-hifi.png" }   // per-locale process.flows
    ],
    "screenGroups": [         // grouped variant — takes precedence over
      {                       // "screens"; one row per group, matched to
        "key": "onboarding",  // process.flowGroups in the locale files
        "screens": [{ "src": "/projects/leaf/screen-onboarding-welcome.png" }]
      }
    ],
    "screensAspectRatio": "393 / 852",
    "screensFrame": "device"  // "device" (phone bezel, default) or
  }                           // "browser" (window chrome, for web apps)
}
```

When using `screenGroups`, add matching captions per locale:

```jsonc
// es.json / en.json → process
"flowGroups": [
  {
    "title": "Onboarding y primer uso",
    "flows": ["Bienvenida — propuesta de valor", "..."]
  }
]
```

Image files live under `public/projects/<slug>/`. If a referenced image
is missing or fails to load, the slider falls back to its drawn
placeholder — a missing file never breaks the page. Portrait aspect
ratios (phone screens) are automatically constrained to a centered
column.

## `es.json` and `en.json` — per-language content

Both files share the same shape; only the copy differs.

```jsonc
{
  "card": {
    "title":   "Leaf",
    "tagline": "App de cuidado de plantas",       // subtitle under the card title
    "summary": "1-2 sentence summary shown on the Projects grid.",
    "tags":    ["UX Research", "Figma", "..."]
  },

  "hero": {
    "title":   "Leaf",                            // case study H1
    "tagline": "Cuidar tus plantas sin adivinar cuándo regarlas.",
    "tags":    ["UX Research", "Figma", "..."]
  },

  "overview": {                                   // 4-column overview grid
    "role":     "Diseño UX de principio a fin",
    "tools":    "Figma · Claude Code (MCP)",
    "duration": "Proyecto de portafolio",
    "type":     "Google UX Design Certificate"
  },

  "problem":    { "heading": "...", "body": "..." },
  "research":   { "heading": "...", "body": "...", "bullets": ["..."] },   // bullets is optional
  "process":    { "heading": "...", "body": "...", "flows": ["..."] },     // flows label each device mockup
  "results":    { "heading": "...", "body": "...", "learnings": ["..."] },
  "reflection": { "heading": "...", "body": "..." }
}
```

## Feature-flag reference

| Flag                    | When `true`                                                            | When `false`                                          |
| ----------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------- |
| `showBeforeAfterSlider` | Renders the wireframe → high-fidelity draggable slider in **Process**. | Hides the slider entirely.                            |
| `showResearchGrid`      | 4-tile research artifacts board next to the **Research** narrative.    | Research narrative spans full width.                  |
| `showFlowsGallery`      | Horizontally scrolling device mockups labeled by `process.flows`.      | Hides the mockup gallery.                             |
| `showSusGauge`          | Animated SUS gauge next to the **Results** narrative.                  | Results narrative spans full width, no gauge.         |

## Status

`status: "in_progress"` renders a small "En construcción / In progress" pill in three places:

1. Top-left corner of the project card on the homepage.
2. Next to the eyebrow on the case study hero.
3. Next to the tagline in the "Next project" footer link.

It does **not** automatically flip any feature flags — pair it with the flags that match the current state. Cata for example sets `showBeforeAfterSlider: false` and `showSusGauge: false` while keeping the low-fidelity flows visible.

## Shared UI copy

Labels used across all case studies live in `messages/{es,en}.json` under `caseStudy`:
`overview`, `role`, `tools`, `duration`, `type`, `problem`, `research`, `process`, `results`, `reflection`, `next`, `back`, `flowsLabel`, `researchArtifacts.*`, `slider.*`, `status.inProgress`. If you add a new shared label, add both the ES and EN key.

The homepage grid uses `messages.projects.eyebrow`, `.heading`, `.intro`, `.viewCase`, and `.inProgress`.

## Style is fixed

Cards, hero, gauges, sliders, and grids reuse the same components in `components/`. Editing a JSON file changes content and section visibility; it does not change layout or palette. If you need a new visual pattern, add a new component and expose it via a new feature flag rather than customizing per-project styling.
