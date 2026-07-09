# Leaf — screenshots

Drop the app screenshots here. All are phone screens at 393 × 852.
Referenced by `content/projects/leaf/project.json`; until a file exists,
the site falls back to the drawn placeholder automatically — a missing
image never breaks the page.

## Before/after slider (design process)

| File            | What it is                          |
| --------------- | ----------------------------------- |
| `home-lofi.png` | Home screen, low-fidelity wireframe |
| `home-hifi.png` | Home screen, high-fidelity design   |

## Flows gallery — group 1: Onboarding & first run

| File                             | Screen                                     |
| -------------------------------- | ------------------------------------------ |
| `screen-onboarding-welcome.png`  | Welcome — "Care for your plants…"          |
| `screen-onboarding-identify.png` | Onboarding — "Identify plants instantly"   |
| `screen-onboarding-reminders.png`| Onboarding — smart reminders + guest access|
| `screen-first-plant.png`         | First run — "Let's identify your first plant" |

## Flows gallery — group 2: The app in use

| File                  | Screen                                   |
| --------------------- | ---------------------------------------- |
| `home-hifi.png`       | Home — reused from the slider            |
| `screen-plants.png`   | My Plants — garden watering status       |
| `screen-detail.png`   | Plant detail (Monstera) — care info      |
| `screen-water.png`    | Watering — "Needs Water" status + action |
| `screen-schedule.png` | Plant Schedule — daily tasks             |
| `screen-identify.png` | Identify Plant — guided camera           |
| `screen-lumaai.png`   | LumaAI — conversational care assistant   |

Group structure and image paths live in `media.screenGroups` in
`project.json`; captions live in `process.flowGroups` in the per-locale
`{es,en}.json`, matched group-by-group and index-by-index. To add a
screen: drop the file here, append it to the right group in
`project.json`, and add its caption to both locale files.
