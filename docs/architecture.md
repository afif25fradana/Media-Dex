# Media-Dex — Codebase Architecture

Reverse-engineered audit. All line references are against the **current working tree**
(`main` @ `eceaeca` plus an uncommitted WIP pass — see the "Working tree vs git" note at the
end of the dependency section and `task_state.md`).

---

## 1. Overview & data flow

This is a **static, server-served, client-rendered single page**. There is no backend, no
build step, no framework. `index.html` is an empty shell of placeholder sections; every
pixel is rendered into the DOM by vanilla JS ES modules on `DOMContentLoaded`.

### Boot sequence (the only meaningful "runtime")

1. `index.html:100` loads `<script type="module" src="src/script.js">`.
2. `src/script.js:16` `DOMContentLoaded` handler calls `initTheme()` (`src/ui.js:76`) — reads
   `localStorage["dex-theme"]`, falls back to `prefers-color-scheme`, sets `data-theme` on
   `<html>` and updates the `theme-color` meta (`src/ui.js:84`).
3. Fetches `data.json` via `DataStore.fetch()` wrapped in a **10 s timeout race**
   (`src/script.js:19-29`, timeout defined at `src/script.js:22`).
4. On success, renders all sections in order (`src/script.js:34-40`):
   `renderNavbar → renderMobileMenu → renderHero → renderExploreCategories →
   renderCategories → renderRecentlyAdded → renderFooter`.
5. Sets `window.__dexBooted = true` (`src/script.js:42`) — this is the flag the inline boot
   watchdog in `index.html:44-56` polls to detect a hung module graph and swap in an error
   screen after 8 s (`index.html:45`).
6. Wires up non-render behavior: navbar scroll state (`src/script.js:112-129`), scroll-spy
   (`src/script.js:131-180`), deep-link hash arrival (`src/script.js:48-56`), mobile-menu
   open/close + focus memory (`src/script.js:64-81`), delegated events (`initEvents`,
   `src/script.js:83-87`), then dismisses the loading screen and kicks off page-entrance +
   scroll-reveal animations (`src/script.js:89-92`).
7. On fetch failure the catch block sets `__dexBooted`, replaces the loader with a "System
   Error" panel with a retry button (`src/script.js:94-108`).

### Data shape

`data.json` is the single source of truth: `profile` (name, tagline, quote, location,
avatar, heroImage), `socials[]` (platform/url/label), and `categories[]`, each with `id`,
`title`, `accentLabel`, `description`, `icon`, and `items[]` (`title`, `subtitle`, `image`,
`dateAdded` ISO date). Current content: 4 categories, 31 items (8 games + 8 manga/manhwa +
7 movies&series + 8 music).

### State management

There is **no shared global state object**. State lives in a few narrowly-scoped places:

- **`DataStore`** (`src/store.js`): a module singleton (IIFE) that caches the parsed
  `data.json` (`cachedData`, `src/store.js:2`) and a pre-sorted/flattened "recent items"
  array (`cachedRecent`, `src/store.js:3`, built at `src/store.js:14-33`). Recent sorting is
  by `dateAdded` descending, missing dates treated as epoch (`src/store.js:24-28`).
- **Theme**: `data-theme` attribute on `<html>` + `localStorage["dex-theme"]`
  (`src/ui.js:76-106`).
- **Boot flag**: `window.__dexBooted` (`src/script.js:42,96`, checked at `index.html:46`).
- **Scroll-spy**: `window.isNavScrolling` + a `Map` of intersecting ratios inside
  `setupScrollSpy` (`src/script.js:148-166`), plus a `WeakMap` of section→cards in
  `src/animations.js:72`.
- **Modal**: module-level `activeModal` singleton guard (`src/modal.js:5`, checked at
  `src/modal.js:15`).
- **Search**: intentionally stateless — DOM visibility is toggled inline on each `input`
  event (`src/ui.js:455-489`).

Everything else is one-way render: read `data.json` (or the store) → build DOM → attach one
set of delegated listeners. No re-render cycle, no diffing.

---

## 2. File / folder structure

```
Media-Dex/
├── index.html                  # Empty shell + loading screen + noscript + boot watchdog + module entry
├── data.json                   # All content: profile, socials, categories[].items[]
├── README.md                   # 1-line repo description
├── docs/                       # Markdown docs (AGENTS.md, DESIGN.md, PRODUCT.md, architecture.md, task_state.md)
├── .gitattributes              # `* text=auto` line-ending normalization
├── .gitignore                  # node_modules, .impeccable live/critique, .opencode, etc.
├── Asset/                      # All images (repo-root-relative paths from data.json)
│   ├── monochrome-overlay-background.webp   # UNTRACKED: hero-left foil, multiply-blended over cream (background-blend-mode)
│   ├── Games/                 # 8 game covers
│   ├── ManhwaManga Cover/     # 8 covers (spaces & apostrophes in filenames)
│   ├── Movie&TV/              # 7 covers (`&` in folder name)
│   ├── Music/                 # 8 covers
│   └── Profile/               # hero/avatar art (Wisadel_Skin.webp)
├── src/                        # All code
│   ├── script.js               # Entry / init orchestration, navbar scroll, scroll-spy, menu wiring
│   ├── store.js                # DataStore singleton: fetch + cache + recent-items sort
│   ├── ui.js                   # ALL render functions + theme + esc()/h() helpers + icon/logo SVGs
│   ├── events.js               # One delegated document click/keydown/popstate handler set
│   ├── animations.js           # Loading-screen dismiss + page-entrance + scroll-reveal logic
│   ├── modal.js                # Detail modal (open/close, focus trap, Esc) — NOT in AGENTS.md
│   ├── style.css               # Entire design system: tokens, layout, motion, reduced-motion
│   └── components/
│       ├── DexCard.js          # <dex-card> custom element (shadow DOM, skeleton, fallback letter)
│       └── DexEmptyState.js    # <dex-empty-state> custom element (shadow DOM, CTA → 'action-click')
├── .impeccable/                # IGNORED (mostly): design-tool artifacts, design.json + config.json tracked
│   ├── design.json             # Token snapshot consumed by the impeccable tooling
│   └── critique/*.md           # Two prior design critiques (Aug 30 & Aug 31) — see task_state.md
└── .opencode/                  # IGNORED: opencode skill/tooling (impeccable skill, node_modules)
```

---

## 3. Established patterns & conventions

### Naming & module style

- **Plain named ES module exports.** Every file exports one or more named things; no default
  exports anywhere.
- **Render function convention:** `render<Area>(data)` reads the element by id and
  overwrites `innerHTML` / `replaceChildren` — e.g. `renderNavbar`, `renderHero`,
  `renderFooter`, `renderMobileMenu` (`src/ui.js:109,147,166,211`). `renderCategories` and
  `renderExploreCategories` are the exceptions (build a `DocumentFragment`, then
  `replaceChildren`, `src/ui.js:290,351`).
- **Component convention:** custom elements named `dex-*`, shadow DOM `open`, styles inline
  in a `<template>` (DexCard template `src/components/DexCard.js:1-225`, DexEmptyState
  template `src/components/DexEmptyState.js:3-96`), observed attributes in
  `observedAttributes`, `_render()` triggered from `connectedCallback` +
  `attributeChangedCallback`, event listeners bound in the constructor and removed in
  `disconnectedCallback`.
- **Constants uppercase snake:** `CARD_ROTATIONS`, `ENTRANCE_DIRS`, `NAV_LINKS`,
  `MAX_CATEGORY_CARDS`, `TIMING` (`src/ui.js:33-41`, `src/animations.js:1-6`).
- **Private-by-underscore methods** on components: `_render`, `_handleImageLoad`, etc.

### Rendering discipline (the big one)

Two complementary helpers in `src/ui.js`:

- **`esc(str)`** (`src/ui.js:44-48`) — creates a span, sets `textContent`, reads back
  `innerHTML`, then escapes `"` and `'`. Used for **every** user-controlled string that goes
  into `innerHTML`. Rule of thumb from AGENTS.md: `innerHTML` is only safe for
  hardcoded/escaped content.
- **`h(tag, props, ...children)`** (`src/ui.js:51-74`) — hyperscript helper for DOM
  construction without innerHTML. Special props: `className`, `innerHTML`, `textContent`,
  `style` (string → `cssText`); everything else becomes an attribute. Children may be
  strings/numbers (`createTextNode`), `Node`s, or nested arrays. Null children are skipped.

Pattern: newer, more structured render paths (category sections, explore grid, recently
added, search bar, overview) use `h()`; older paths (navbar, hero, footer, mobile menu,
modal) use template literals + `esc()`. The modal is the only place a full `innerHTML`
template is built at runtime with mixed content (`src/modal.js:37-51`) — every interpolated
value there passes through `esc()`, and the image src through `esc(encodeURI(...))`
(`src/modal.js:32`).

### State & events

- **One delegated `document` click listener** (`src/events.js:12-90`) dispatches on
  `closest()` matches, in priority order: theme toggle → menu open → menu close/link →
  `dex-card` (opens modal) → `[data-scroll-to]` → `a[href^="#"]`. This is why `createCard`
  can attach data as an expando property (`card.itemData`, `src/ui.js:252`) instead of
  wiring per-card listeners.
- **Custom event for component→page communication:** `dex-empty-state` dispatches a
  composed, bubbling `action-click` (`src/components/DexEmptyState.js:146-151`); the page
  listens for it in `src/events.js:92-95` and scrolls to `#explore-categories`.
- **Accessibility is treated as a first-class constraint**, not an afterthought: skip link
  (`index.html:23`, `src/style.css:2152-2169`), `aria-live` regions on search count and
  no-results (`src/ui.js:436,447`), `role="dialog"` + `aria-modal` + focus trap + focus
  return on the modal (`src/modal.js:26-28,57-93`), `inert` on the closed mobile menu
  (`index.html:67`, toggled at `src/script.js:66,76`), `aria-expanded` on menu buttons,
  `prefers-reduced-motion` honored in both JS (`src/animations.js:8-12`,
  `src/events.js:4-8`) and CSS (`src/style.css:2073-2150,2518-2532`), `:focus-visible`
  styling (`src/style.css:2171-2174`).

### Styling approach

- **Single stylesheet** (`src/style.css`, 2538 lines) plus **scoped styles inside the two
  custom-element templates**. No CSS modules, no preprocessor, no CSS-in-JS.
- **Design tokens as CSS custom properties** on `:root` (`src/style.css:2-61`) with a dark
  overrides block on `[data-theme="dark"]` (`src/style.css:69-78`). Components reach for
  tokens via `var(--token, fallback)` — the fallbacks inside the shadow DOM components are
  deliberate (see the sync note at `src/style.css:4`).
- **Progressive-enhancement animation:** default DOM is visible and static; animation
  classes (`hero-entrance`, `panel-enter`, `card-will-animate`, `revealed`, `card-visible`,
  `card-ready`) are added by JS only. CSS for the pre-animation state lives next to the
  class that enables it (e.g. `src/style.css:1394-1407`).
- **`content-visibility: auto` + `contain-intrinsic-size`** on the big sections
  (`src/style.css:1027-1028, 1321-1322, 1420-1421`) for render skipping.
- **Mobile-first but written desktop-first:** base rules are desktop, breakpoints at
  1200px (grid density up), 1024px (hero/overview stack), 768px (nav hamburger, grids
  two-up), 480px (explore one-up, CTA column) — `src/style.css:1826-2057`.

---

## 4. Design tokens

### Color variables (`src/style.css:2-78`)

**Red family — the only accent.** Four semantically distinct reds, *not* interchangeable:

| Token | Value | Semantics | Used for |
|---|---|---|---|
| `--red` | `#D80000` | **Fixed brand red.** Never theme-shifts. | Buttons, banners, tags, underlines, focus rings, hover flashes, stat icons, footer heart (`src/style.css:5`) |
| `--red-dark` | `#CC0000` | Fixed **pressed/hover** shade of `--red`. | Button/menu hover backgrounds, hero eyebrow (`src/style.css:6`) |
| `--red-text` | light `#CC0000` / dark `#FF3333` | **Theme-shifting link/text red** (semantic swap in `[data-theme="dark"]`, `src/style.css:71`). | Nav-link hover color, wordmark accent, section-accent label, hero headline accent, view-all hover |
| `--red-on-dark` | `#FF3333` | **Constant bright red for anything that always sits on void**, kept ≥4.5:1 on `#0C0C0C` (documented rationale at `src/style.css:1090-1093`, `src/style.css:1125-1129`). | Explore-eyebrow, overview eyebrow (`src/ui.js:412`), "more" card count, mobile-menu link hover, footer socials, modal `dt`, search icon |

**Neutrals:**

| Token | Value | Role |
|---|---|---|
| `--black` | `#0C0C0C` | "Void" — dark ground: hero right panel, explore bg, card-cover ground, dark-theme bg |
| `--cream` | `#F0ECE2` | "Dex cream" — light ground, text-on-dark, hero left panel, explore-card face |
| `--white` | `#FFFFFF` | Paper — light-theme surface (recent cards) |
| `--color-surface-dark` | `#1A1A20` | "Charcoal" — card faces, ID card, overview panel, footer, search bar, modal |
| `--placeholder-deep` | `#1a1a2e` | Indigo-tinted fallback gradient only (`src/style.css:24`) |
| `--skeleton-base`/`--skeleton-shine` | `#333`/`#444` | Cover skeleton shimmer (`src/style.css:25-26`) |
| `--color-border` | `#D4D0C8` | Light-theme hairlines |
| `--color-border-dark` | `#3A3A42` | Dark-theme hairlines + theme-toggle track |

**Semantic tokens that swap by theme** (`:root` light defaults `src/style.css:16-30`,
dark block `src/style.css:69-78`): `--color-bg`, `--color-surface`, `--color-text`,
`--color-text-muted`, `--color-text-on-dark`, `--color-text-muted-on-dark`,
`--color-border`, `--navbar-bg`, `--halftone`.

**Dormant legacy tokens (must stay unused — DESIGN.md "One-Accent Rule", `DESIGN.md:158`):**
`--cyan #00FFFF`, `--magenta #FF00FF`, `--yellow #FFE600` (`src/style.css:12-14`).
Also present but currently unused: `--ease-hard` (`src/style.css:40`), `--dur-normal`
(`src/style.css:42`), and the `--in-oklch` oklch flag (`src/style.css:60-67` — declared but
never consumed).

### Typography scale (`src/style.css:32-36`, fonts loaded `index.html:19`)

Four families, each with a strict role (from `DESIGN.md:162-183`):

- `--font-display: 'Anton'` — every heading; **always uppercase** (Anton lowercase reads
  broken). Display `clamp(2.8rem,5.5vw,5rem)` hero only; headline `clamp(1.8rem,4vw,2.8rem)`;
  title 0.85–0.95rem card level.
- `--font-body: 'Schibsted Grotesk'` — paragraphs, buttons, meta, labels, quotes.
- `--font-messy: 'Caveat'` — handwritten accents only: card subtitles, section accent labels.
- `--font-mono: 'JetBrains Mono'` — the "system voice": eyebrows, ID codes, indices, menu
  labels, tags, scroll indicators, search input/count, modal `dt`.

Hierarchy rule (`DESIGN.md:183`): a surface uses display + at most one expressive secondary
voice; mono is exempt (labels data).

### Spacing

No formal spacing scale is tokenized in CSS (DESIGN.md frontmatter documents
`xs .25rem / sm .5rem / md 1rem / lg 1.5rem / xl 2rem / section 4rem`). In practice the
codebase uses: section padding 4–5rem (`src/style.css:1025`, hero `8rem 4rem 4rem 5rem`
`src/style.css:602`), category sections `2rem 2rem 3rem` (`src/style.css:1318`), grid gaps
1.5–2.5rem, small paddings in .25/.5rem steps. `clamp()` is used everywhere for fluid type.

### Shadows / elevation (`src/style.css:45-48`, spec `DESIGN.md:197-210`)

- `--shadow-card: 6px 6px 0 #000, -4px -4px 0 var(--red)` — two-tone hard offset (black +
  red). Hover deepens to `10px 10px`/`-6px -6px`; active presses to `2px 2px`/`-2px -2px`
  (`src/components/DexCard.js:38,83,92`).
- Explore card: `4px 4px 0 rgba(0,0,0,.6)` → hover `8px 8px 0 rgba(0,0,0,.7), -4px -4px 0
  var(--red)` (`src/style.css:1156,1167`).
- ID card: `drop-shadow(4px 4px 0 rgba(0,0,0,.5))` — the *only* true drop shadow
  (`src/style.css:851`).
- Navbar scrolled: `0 2px 12px rgba(0,0,0,.15)` — the *only* soft shadow
  (`src/style.css:279`).
- Rule: interactive elements lift with hard offset shadows; static surfaces use tonal
  layering (`DESIGN.md:208`).

---

## 5. Animation & transition patterns

### Easing & duration tokens (`src/style.css:38-43`)

- `--ease-snap: cubic-bezier(0.1, 0.9, 0.2, 1)` — the house easing (fast start, punchy snap,
  no overshoot). Used for nearly every interactive and reveal transition. (Was
  `cubic-bezier(0.175,0.885,0.32,1.275)` before commit `e15a2e4` unified it.)
- `--ease-hard: cubic-bezier(0.7, 0, 0.3, 1)` — declared for the loading-screen swipe-out
  per `design.json`, but the loader actually uses `var(--ease-snap)`
  (`src/style.css:173`); effectively unused.
- `--dur-fast: 150ms` (hover/state), `--dur-normal: 250ms` (unused), `--dur-entry: 400ms`
  (section entrances).
- **`step-end` / `step-start` timing is a deliberate second vocabulary** for "stamp/glitch"
  motion: loading-screen dismiss fades `150ms step-end 300ms` (`src/style.css:173`),
  navbar background switches `0.15s step-end` (`src/style.css:274`), card reveal opacity
  `80ms step-start` (`src/components/DexCard.js:20`).

### Timing constants in JS (`src/animations.js:1-6`)

`PAGE_ENTRANCE_STAGGER 120ms`, `SCROLL_READY_DELAY 1000ms`, `LOADING_DISMISS_DELAY 500ms`,
`LOADING_HIDE_DELAY 400ms`. Card stagger is `index * 70ms` set as `--delay`
(`src/ui.js:245`).

### Which elements animate, when

| Moment | What moves | Mechanism | Ref |
|---|---|---|---|
| **Boot** | Loading screen (fixed black) swipes out `translateX(105%) skewX(-12deg)` | `.loading-screen.dismissed`, class added after 500ms, element hidden 400ms later | `src/style.css:176-180`, `src/animations.js:14-35` |
| **Boot** | Hero children stagger in (rail fade, eyebrow/headline/bio/CTA rise, illustration zoom, ID card fade, deco number fade) | `.hero-entrance` class → `heroRise/heroZoom/heroFade` keyframes with 40→320ms delays | `src/style.css:995-1019`, `src/animations.js:37-49` |
| **Boot / scroll** | Category sections slash in from left/right with overshoot | `.panel-enter--left/right.revealed` → `slashInLeft/Right` 400ms; entrance for in-viewport sections is timed with `i*120ms` stagger | `src/style.css:1733-1794`, `src/animations.js:43-48` |
| **Scroll** | Section banner does a clip-path wipe + accent label slides in | `.category-section.revealed .section-banner` `clip-path: inset(0 0 0 0)` transition 300ms; accent `translateX(-15px)→0` 250ms with 250ms delay | `src/style.css:1797-1823` |
| **Scroll** | Cards reveal in **three phases**: `card-will-animate` (hidden) → `card-visible` (opacity `80ms step-start` + transform `380ms ease-snap`, staggered by `--delay`) → `card-ready` (fast `0.2s` hover-capable state) | Driven by one IntersectionObserver (`threshold .1`, `rootMargin 0 0 -8%`) that reveals a section once, then adds `card-ready` to its cards 1000ms later | `src/components/DexCard.js:13-27`, `src/animations.js:74-93` |
| **Hover** | Cover card lifts `translateY(-8px) scale(1.05)` and *straightens* its rotation; Combat Red flash overlay fades to 0.6 opacity; shadow deepens | `.card:hover` | `src/components/DexCard.js:80-88` |
| **Hover** | Explore card lifts, arrow nudges right, icon tile rotates; nav-link underline `scaleX(0→1)` | `:hover` + `::after` transform | `src/style.css:1165-1246, 333-349` |
| **Hover** | Secondary/primary buttons lift `-2px`; footer socials lift; theme-toggle thumb slides 18px; search clear rotates 90deg | `:hover` transitions | `src/style.css:712-718, 742-749, 1660-1666, 396-408, 2246-2249` |
| **Scroll** | Navbar flips transparent→`--navbar-bg` + shadow after `scrollY > 50`, rAF-throttled | `.navbar-scrolled`, `step-end` pop | `src/script.js:112-129`, `src/style.css:277-281` |
| **Scroll** | Scroll-spy marks the active nav link (`IntersectionObserver`, `rootMargin -10%`, threshold `[0,0.5]`, highest-ratio wins) | `.active` class on `.navbar-link`/`.mobile-menu-link` | `src/script.js:131-180` |
| **Scroll** | Scroll-down arrow floats (`scrollFloat` 2.2s infinite); loading dots pulse (`dotPulse` 800ms step-end); idle `p5HeartbeatPulse` keyframes defined but unused | CSS `@keyframes` | `src/style.css:936-953, 196-219, 236-258` |
| **Theme toggle** | Whole-DOM crossfade via **View Transitions API** when available | `document.startViewTransition(() => applyAndSave())` with graceful fallback | `src/ui.js:89-106` |
| **Modal** | Overlay fades in; panel rises/zooms `translateY(24px) scale(.98)→0` 300ms | `.is-open` added in `requestAnimationFrame` | `src/style.css:2284-2326`, `src/modal.js:103-107` |

### Reduced-motion policy

`prefers-reduced-motion: reduce` is honored **twice**:
1. **JS short-circuits** — module-level `matchMedia` tracked with a change listener
   (`src/animations.js:8-12`, `src/events.js:4-8`); `dismissLoading` skips the swipe and
   immediately marks all cards `card-ready` (`src/animations.js:17-25`);
   `triggerPageEntrance`/`setupScrollReveals` return early; smooth scrolls become `instant`.
2. **CSS kills everything** — a large `!important` block nulls panel/card/loader/menu
   transitions and forces everything visible (`src/style.css:2073-2150`), plus a modal
   override (`src/style.css:2518-2532`).

---

## 6. Dependency graph

```
index.html
 └─ src/script.js  (module entry)
     ├─ src/store.js          DataStore.fetch / getRecentItems        (src/script.js:1)
     ├─ src/events.js         initEvents({toggleTheme,openMenu,closeMenu})
     │    └─ src/modal.js     openDetailModal                          (src/events.js:1)
     │         └─ src/ui.js   esc()                                    (src/modal.js:1)
     ├─ src/ui.js             initTheme, toggleTheme, all render fns
     │    ├─ src/store.js     DataStore.getRecentItems (for recent cards)  (src/ui.js:1,358)
     │    ├─ src/components/DexCard.js        customElements.define('dex-card')        (src/ui.js:2)
     │    └─ src/components/DexEmptyState.js  customElements.define('dex-empty-state') (src/ui.js:3)
     │         └─ src/ui.js   CATEGORY_ICONS   ◄── CIRCULAR, runtime-only               (DexEmptyState.js:1)
     └─ src/animations.js     dismissLoading / triggerPageEntrance / setupScrollReveals (src/script.js:14)

Runtime data handoff (not an import): ui.js createCard() sets card.itemData
(src/ui.js:252) → events.js reads card.itemData on click (src/events.js:33-37)
→ modal.js renders it.
```

**The one deliberate cycle:** `src/ui.js` → `src/components/DexEmptyState.js` (side-effect
import) and `src/components/DexEmptyState.js` → `src/ui.js` (`CATEGORY_ICONS`). This works
only because the cross-import is used at **runtime** (`_render()`, `DexEmptyState.js:135`),
never at module-evaluation time. AGENTS.md explicitly forbids restructuring this into
init-time usage. `DexCard.js` avoids the cycle by inlining its own SVG icons / not importing
from `ui.js`.

**Circular-ish related:** `src/events.js` imports `src/modal.js`; `src/modal.js` imports
`src/ui.js`; `src/ui.js` does **not** import `events.js` or `modal.js` — so the direction is
script → events → modal → ui, a clean one-way chain except the DexEmptyState cycle.

### Working-tree vs `git` HEAD note

HEAD (`main` @ `eceaeca`) is **older** than the working tree. Uncommitted changes touch:
`index.html`, `src/ui.js`, `src/events.js`, `src/modal.js`, `src/script.js`,
`src/style.css`, `src/components/DexCard.js`, `.gitignore`, `docs/DESIGN.md`, and the
docs/ moves (AGENTS/DESIGN/PRODUCT.md); **untracked**: `docs/architecture.md`,
`docs/task_state.md`, `Asset/monochrome-overlay-background.webp`; **deleted**:
`Asset/Star Persona.webp` (all three remaining `url('Asset/Star Persona.webp')` rules were
since removed — hero/explore star textures are gone, see debt-resolved note in §7). This
session also fixed the hero seam (cream divider slab overhang) and switched the hero-left
foil to `background-blend-mode: multiply`. The docs were moved into `docs/` and the local
Playwright test infra (`package.json`, `playwright.config.js`, `tests/`, `node_modules/`)
was removed — browser automation relies on the global Playwright MCP (configured in
`~/.config/opencode/opencode.jsonc`), not on repo files. The documents in this repo
describe the working tree.

---

## 7. Technical debt & inconsistencies (documented, not fixed)

> **Resolved (kept for history):** the dead `url('Asset/Star Persona.webp')` references in
> `src/style.css` (`.hero-left::before`, `.explore-section::after`, `.explore-star-mobile`)
> and the `.explore-star-mobile` element created in `src/ui.js` were all **removed** — the
> asset is deleted and the star textures are gone. The only remaining foil is
> `monochrome-overlay-background.webp`, referenced correctly with a `../Asset/...` path and
> multiply-blended (`background-blend-mode: normal, multiply`) over the cream.

1. **`--in-oklch` / `--ease-hard` / `--dur-normal` are declared but never consumed**
   (`src/style.css:40,42,60-67`). The oklch `@supports` flag has no consumer at all.
   `--ease-hard` was part of the "ease-snap unification" refactor (commit `e15a2e4`) and
   survived by accident; `--ease-punch` from the same commit was removed.
2. **`p5HeartbeatPulse` keyframes are defined but unused** (`src/style.css:236-258`).
3. **`AGENTS.md` is stale on repo layout.** It lists `src/` contents without `src/modal.js`,
   says "Root holds the served/content layer only", and omits the `docs/` folder and the
   global Playwright MCP note. Its "no tests" claim is accurate again (repo test infra was
   removed — browser automation is the global MCP).
4. **Dev-only impeccable-live script would ship if `index.html` is committed as-is.**
   `index.html:101-103` injects `<script src="http://localhost:8400/live.js?...">` — a
   browser will hit localhost and fail on any deployed URL. The `.gitignore` covers the
   live *state files* but not this injected tag.
5. **Path convention split on asset URLs.** `data.json`/DexCard use **repo-root-relative**
   paths (`Asset/...`), while `src/style.css` uses **stylesheet-relative** paths
   (`../Asset/...`). Different mental models; the `src/style.css` one is correct as-is but
   must be re-audited if the stylesheet ever moves again.
6. **Two rendering styles coexist.** Template-literal `innerHTML` + `esc()` (navbar, hero,
   footer, menu, modal) vs the `h()` hyperscript helper (categories, explore, recent,
   overview, search). Consistent escaping, but an inconsistency in construction style and a
   subtle one: `h()` sets `style` only as a string via `cssText` (`src/ui.js:58`), and
   inline style overrides are sprinkled in `ui.js:393,412` — a token bypass.
7. **`--font-accent`/'Permanent Marker' fully pruned** (confirmed absent) — good, matches
   `DESIGN.md:167` — but note `DESIGN.md` component text still says tags use "Inter 700"
   (`DESIGN.md:225,228`) while the actual font stack is Schibsted Grotesk; docs drift.
8. **Global scrollbar removal** (`src/style.css:100-110`) removes the scroll-progress
   affordance on desktop; flagged as a deliberate aesthetic tradeoff in the critique but
   worth revisiting.
9. **Hard-coded persona data in JS** instead of `data.json`: hero ID `ID: FRD-125`
   (`src/ui.js:197`), deco number `01` (`src/ui.js:195`), "ID: FRD-125" — if the profile
   name changes these drift. Also `hero-illustration` crops are content-specific:
   `object-position: center 30%` + `transform: scale(1.35)` (`src/style.css:796-802`).
10. **`encodeURI` does not encode `#` or `?`** — filenames in `Asset/Movie&TV/` already
    contain `&`, spaces, apostrophes, parentheses; a `#` or `?` in a future filename would
    silently break the cover URL (`src/components/DexCard.js:278`, `src/modal.js:32`).
11. **`html { scroll-behavior: auto }`** (`src/style.css:99`) + JS-driven `scrollIntoView`
    is the right combo, but it means the browser's native anchor jump is disabled globally;
    any future hardcoded `<a href="#x">` in static content would jump instantly with no
    margin logic. Native hash navigation also bypasses `history.pushState` (only delegated
    clicks push state, `src/events.js:62-65`), so a keyboard Enter on a focused link —
    which does *not* bubble as a handled click path... it does route through `closest`
    delegation, so this is covered; the real gap is external links landing with a hash on a
    cold load, which IS handled (`src/script.js:48-56`).
12. **Section-entrance direction is hard-coded alternate** (`ENTRANCE_DIRS = ['left','right']`
    alternates by category index, `src/ui.js:34,264`), and `.panel-enter--bottom` exists in
    CSS (`src/style.css:1792-1794`) but is never assigned by JS.
13. **`content-visibility: auto` with guessed `contain-intrinsic-size`** (`src/style.css:1027-1028,1321-1322,1420-1421`) can cause scrollbar/measure jitter if content height drifts; values (560/900/720px) are estimates.
14. **Search + reveal interplay:** `attachSearch` hides sections via `style.display`; a
    section that was hidden before its first scroll intersection gets re-shown on clear and
    only then becomes observable by the reveal observer (`src/animations.js:95-98`) — works,
    but cards in a re-shown far-down section can stay invisible until scrolled into view.
15. **`body:has(#mobile-menu.menu-open)` scroll-lock** (`src/style.css:567-569`) requires
    `:has()` support (Chrome 105+/Safari 15.4+/FF 121+); older browsers can scroll behind
    the open menu.
16. **Filename typo in content:** `Asset/Music/Dilatin-Pixy.webp` vs the title "DILATING"
    in `data.json:214-217` — cosmetic but will confuse future editors.
17. **Search count uses title/subtitle only** (`src/ui.js:466`); a subtitle-only match hides
    nothing but the count is correct; category names are not searched (by design, could be
    a future facet).
18. **`--delay` is applied via inline style on `dex-card`** (`src/ui.js:245`) and the 
    Shadow-DOM host transitions consume it through inherited custom properties — works, but
    means per-card transition timing can't be themed/overridden from CSS without
    `!important`.
