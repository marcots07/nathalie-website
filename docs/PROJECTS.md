# Project JSON schema

Every case study is a JSON file under `content/projects/<slug>.json`. The
homepage grid and the case study pages are generated from these files —
no code change is required to add or edit a project.

## Where things live

```
content/
  projects/
    leaf.json     ← full project
    cata.json     ← in-progress project
lib/
  projects.ts     ← loader + types
messages/
  es.json         ← shared UI copy (section labels, button text)
  en.json         ← same, for English
```

## Adding a new project

1. Duplicate `content/projects/leaf.json` to `content/projects/<new-slug>.json`.
2. Change `slug`, `order`, and the copy in `translations.es` and `translations.en`.
3. Register the new file in `lib/projects.ts`:

    ```ts
    import newProject from "@/content/projects/<new-slug>.json";
    // ...
    const registry: Project[] = [leaf, cata, newProject]
      .slice()
      .sort((a, b) => a.order - b.order);
    ```

4. Rebuild — Next.js generates the routes automatically for both locales:
    - Spanish: `/es/proyectos/<new-slug>`
    - English: `/en/projects/<new-slug>`

## Schema

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

  "translations": {
    "es": { /* see below */ },
    "en": { /* see below */ }
  }
}
```

### `translations.<locale>`

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

It does **not** automatically flip any feature flags — pair it with the flags that match the current state (Cata for example sets `showBeforeAfterSlider: false` and `showSusGauge: false` while keeping the low-fidelity flows visible).

## Shared UI copy

Labels used across all case studies live in `messages/{es,en}.json` under `caseStudy`:
`overview`, `role`, `tools`, `duration`, `type`, `problem`, `research`, `process`, `results`, `reflection`, `next`, `back`, `flowsLabel`, `researchArtifacts.*`, `slider.*`, `status.inProgress`. If you add a new shared label, add both the ES and EN key.

The homepage grid uses `messages.projects.eyebrow`, `.heading`, `.intro`, `.viewCase`, and `.inProgress`.

## Style is fixed

Cards, hero, gauges, sliders and grids reuse the same components in `components/`. Editing a JSON file changes content and section visibility; it does not change layout or palette. If you need a new visual pattern, add a new component and expose it via a new feature flag rather than customizing per-project styling.
