# AGENTS.md

Personal media collection dex — static HTML/CSS/vanilla-JS site. No build tooling, no tests, no linter. Just serve the files.

## Running

- Must be served over HTTP; opening `index.html` via `file://` breaks the app (ES modules + `fetch('data.json')` are blocked).
- e.g. `python -m http.server` or `npx serve` from the repo root. `data.json` and all image paths are relative to repo root.

## Repo layout

- **Root holds the served/content layer only:** `index.html`, `data.json`, `Asset/`.
- **`src/` holds all code:** `style.css`, `script.js`, `store.js`, `ui.js`, `events.js`, `animations.js`, `components/`.
- `src/` mirrors the pre-reorg root structure exactly, so every ES-module relative import was preserved verbatim. New JS goes under `src/`.

## Architecture

- `index.html` is a shell of empty sections; everything is rendered client-side by JS on `DOMContentLoaded` (`src/script.js:16`).
- `src/script.js` entry point / init orchestration. `src/store.js` fetches and caches `data.json` (`DataStore`). `src/ui.js` all render functions. `src/events.js` delegated click/keydown handlers. `src/animations.js` loading screen + scroll reveals (respects `prefers-reduced-motion`).
- `src/components/DexCard.js` and `src/components/DexEmptyState.js` are custom elements using shadow DOM.
- No build step: files are loaded directly as ES modules (`<script type="module" src="src/script.js">`). New JS must be an ES module.

## Adding content (most common change)

- Edit `data.json` only. Structure: `profile`, `socials`, `categories[].items[]`. Each item has `title`, `subtitle`, `image`, `dateAdded` (ISO date — drives "Recently Added" sorting in `src/store.js:24`).
- Drop a cover `.webp` into the matching `Asset/<Category>/` folder and reference it with a repo-root-relative path. Filenames with spaces/apostrophes/`&`/parentheses are fine — `DexCard` calls `encodeURI()` on the src.
- Do NOT hand-edit the rendered sections in `index.html`; the render functions in `src/ui.js` (e.g. `renderCategories`, `renderHero`) own them.

## Conventions / gotchas

- `src/ui.js` and `src/components/DexEmptyState.js` import each other (circular). Works only because the cross-import is used at runtime, not module-init time. Don't restructure into init-time usage.
- Use `esc()` (src/ui.js:45) for any user-controlled string interpolated into HTML, and the `h()` hyperscript helper for DOM construction. `innerHTML` is only safe for hardcoded/escaped content.
- Add new category icons to `CATEGORY_ICONS` and social icons to `SOCIAL_ICONS` in `src/ui.js`.
- Theme is persisted in `localStorage` under key `dex-theme`.
- No commit conventions beyond conventional-style prefixes used in history (e.g. `refactor:`, `feat:`).
