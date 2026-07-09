# Cata — screenshots

Drop the web-app screenshots here. Desktop screens at 1440-wide
(≈ 1440 × 1024; the high-fi home is taller and crops from the bottom).
Referenced by `content/projects/cata/project.json`; until a file exists,
the site falls back to the drawn placeholder automatically.

## Before/after slider (design process)

| File            | What it is                            |
| --------------- | ------------------------------------- |
| `home-lofi.png` | Home / cellar, low-fidelity wireframe |
| `home-hifi.png` | Home / cellar, high-fidelity design   |

## Flows gallery (browser frames)

| File                  | Screen                                    |
| --------------------- | ----------------------------------------- |
| `home-hifi.png`       | Home — "A cellar worth savouring"         |
| `screen-discover.png` | Discover — search + "Ask Cata" assistant  |
| `screen-login.png`    | Log in — email + social auth              |

Gallery order and captions live in `content/projects/cata/{es,en}.json`
(`process.flows`, matched by index to `media.screens` in `project.json`).
These render in browser-window frames (`"screensFrame": "browser"`), not
phone bezels. To add a screen: drop the file here, append an entry to
`media.screens`, and add its caption to both locale files.
