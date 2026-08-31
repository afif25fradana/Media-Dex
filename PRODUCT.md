# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Primary curator: Fradana (@afif_fradana), Solo, ID. He builds and maintains the dex for his own reference and enjoyment.
- Secondary audience: his followers, friends, and anyone who lands on the public page and browses his taste.

## Product Purpose

A personal media collection "dex": a curated, public catalog of the games, manga/manhwa, movies & series, and music he loves. It works as both a personal archive he enjoys maintaining and a public showcase others can browse. Success means the dex is a satisfying, complete record of his taste that visitors enjoy exploring.

## Positioning

The meaning of the product is carried equally by two things:

1. The curation itself — what he chooses to include, how it's organized by category, and how recently items were added.
2. The "dex" persona — a Persona 5-inspired identity that frames the collection as a game-like catalog rather than a plain list.

Neither is allowed to dominate; a redesign or extension must serve both.

## Operating Context

- Must be served over HTTP; `file://` breaks the app (ES modules + `fetch('data.json')`). Run with `python -m http.server` or `npx serve` from repo root.
- All content is edited by hand in `data.json` (profile, socials, categories with items). Cover art `.webp` files live in `Asset/<Category>/` and are referenced repo-root-relative.
- Dark/light theme persisted in `localStorage` under key `dex-theme`.
- Loading screen and scroll reveals are part of the experience and respect `prefers-reduced-motion`.
- Responsive, single-page layout: hero, category overview, per-category detail sections, recently added, footer.

## Capabilities and Constraints

- Four fixed categories: Games, Manga & Manhwa, Movies & Series, Music. Each item has `title`, `subtitle`, `image`, `dateAdded`.
- `dateAdded` (ISO date) drives "Recently Added" sorting.
- Social links: Instagram, Steam, GitHub.
- **Static/no-backend is binding.** No build tooling, no framework, no backend; plain HTML/CSS/vanilla JS ES modules served over HTTP. Do not introduce a server, database, or build step.
- Image assets are WebP; filenames may contain spaces, apostrophes, `&`, and parentheses (handled via `encodeURI`).
- Custom elements use shadow DOM; `src/ui.js` and `src/components/DexEmptyState.js` share a circular import that must not become init-time.

## Brand Commitments

- Name/wordmark: "PERSONAL DEX — My Media Collection"; profile handle `@afif_fradana`; quote "Living a life surrounded by stories I love."
- Voice is a system/dex tone: machine-styled labels like "LOADING", "System Error", "connection data".
- Incumbent identity is Persona 5-inspired (Anton/Permanent Marker/Caveat display type, red `#D80000` on cream/black, hard offset shadows, halftone textures). The user chose not to mark this binding, but the "dex" persona is half of the product's meaning and must be preserved or deliberately evolved, never dropped.
- Persona 5 is a trademark of SEGA/Atlus; inspiration only, no licensed assets.

## Evidence on Hand

- `data.json`: 4 categories, 8 items each (31 media items), with real titles, subtitles, and `dateAdded`.
- Social URLs: Instagram `@afif_fradana`, Steam profile, GitHub `afif25fradana`.
- Cover art present under `Asset/Games/`, `Asset/ManhwaManga Cover/`, `Asset/Movie&TV/`, `Asset/Music/`, plus profile/hero art.
- No testimonials, press, case studies, or analytics — future work must not fabricate these.

## Product Principles

- **The collection is the content.** Product work starts and ends with the data in `data.json`; the UI is a lens on it.
- **Persona and curation are inseparable.** Every design decision must honor both the curated taste and the game-like dex identity.
- **Stay handcrafted.** Keep the static, dependency-free, data-driven architecture; it is a stated constraint and a feature.
- **Personal authenticity over polish.** This is one person's real taste — honest, specific entries beat generic filler.
- **Accessible by default.** Keep semantic markup, a skip link, keyboard reachability, and reduced-motion support in any change.
