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

## Flows gallery (design process, horizontal scroll)

| File                  | Screen                                   |
| --------------------- | ---------------------------------------- |
| `home-hifi.png`       | Home — reused from the slider            |
| `screen-plants.png`   | My Plants — garden watering status       |
| `screen-detail.png`   | Plant detail (Monstera) — care info      |
| `screen-schedule.png` | Plant Schedule — daily tasks             |
| `screen-identify.png` | Identify Plant — guided camera           |
| `screen-lumaai.png`   | LumaAI — conversational care assistant   |

Gallery order and captions live in `content/projects/leaf/{es,en}.json`
(`process.flows`, matched by index to `media.screens` in `project.json`).
To add another screen: drop the file here, append an entry to
`media.screens`, and add its caption to both locale files.
