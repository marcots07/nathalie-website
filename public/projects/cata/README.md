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

## Flows gallery — group 1: Getting in & exploring

| File                  | Screen                                   |
| --------------------- | ---------------------------------------- |
| `screen-login.png`    | Log in — email + social auth             |
| `home-hifi.png`       | Home — "A cellar worth savouring"        |
| `screen-discover.png` | Discover — search + "Ask Cata" assistant |

## Flows gallery — group 2: The cellar in use

| File                    | Screen                                     |
| ----------------------- | ------------------------------------------ |
| `screen-add-wine.png`   | Add wine — search / scan label / manual    |
| `screen-collection.png` | Collection view — "Mexican wines"          |
| `screen-pair.png`       | Pair — photo of your dish → suggestions    |
| `screen-tonight.png`    | What to drink today — tonight's pick       |

Group structure and image paths live in `media.screenGroups` in
`project.json`; captions live in `process.flowGroups` in the per-locale
`{es,en}.json`, matched group-by-group and index-by-index. These render
in browser-window frames (`"screensFrame": "browser"`). To add a screen:
drop the file here, append it to the right group in `project.json`, and
add its caption to both locale files.
