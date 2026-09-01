# Task State

## Current Task

Full audit prep — awaiting next instruction.

> Working tree is ahead of `main` (HEAD `eceaeca`) with an uncommitted UX-hardening pass in
> progress. See **Completed Steps → WIP (uncommitted)** below for what is staged-but-not-shipped.

## Completed Steps

### Shipped (committed on `main`)

- **`56ac3f3` — Initial commit** (2026-08-16): full first version of the site (shell +
  data.json + 31 covers + root-level JS/CSS).
- **`a9b278b` — Update style.css** (2026-08-16, "Fixin overview size"): recent-cards grid
  switched to `repeat(auto-fill, minmax(160px, 1fr))`, ellipsis truncation on recent-card
  title/meta, fluid `overview-stat-number` + `word-break`, responsive padding fixes for the
  overview/recent sections.
- **`827d6df` — Compress Image & remove scrollbar** (2026-08-17): recompressed every WebP
  under `Asset/` (game/manhwa/movie/music/profile), added global scrollbar removal
  (`scrollbar-width: none`).
- **`3aeb83a` — Apply approved performance fixes (#3 and #4)** (2026-08-18): replaced
  `transition: all ...` with property-scoped transitions on DexCard (`opacity`+`transform`,
  `transform`+`box-shadow`) to avoid animating paint/layout; skip-link reworked from a
  `top: -40px` slide to `transform: translateY(-100%)` (GPU-friendly).
- **`e15a2e4` — Optimize transitions, unify ease-snap tokens, update red palette**
  (2026-08-29): the primary **motion-design commit** —
  - Introduced the house easing `--ease-snap: cubic-bezier(0.1,0.9,0.2,1)` and swapped every
    card/element transition off the old overshoot bezier onto it (DexCard shadow styles).
  - Rebased the red palette from `#FF0000` to `#D80000` (`--red`), `#CC0000` (`--red-dark`),
    keeping the theme-shifting `--red-text` (#CC0000 light / #FF3333 dark), and synced the
    hard-coded fallbacks in `DexCard.js`/`DexEmptyState.js` (sync note added at
    `src/style.css:4`).
  - Changed the hero eyebrow from `--red-text` to `--red-dark`.
  - Added `PROJECT_ARCHITECTURE_SPEC.md` (556 lines; later deleted in `eceaeca`).
- **`eceaeca` — Reorg into `src/` + detail modal & search, harden UX** (2026-08-31): the
  **feature commit** —
  - Moved all JS/CSS from root into `src/` (`animations.js`, `components/`, `events.js`,
    `script.js`, `store.js`, `style.css`, `ui.js`), preserving every ES-module relative
    import so the module graph was untouched.
  - Added **detail modal** (`src/modal.js`, new): opens from any `dex-card` click, `dl` meta
    grid (Added / Entry), Escape + backdrop + X close, focus return, `aria-modal`.
  - Added **dex search** (`src/ui.js:427-490`): title/subtitle substring filter with live
    count, clear button, "NO RESULTS" panel; hides empty sections + dividers.
  - Added category quick-jump links to the mobile menu, hero entrance animation, empty-state
    wiring, error screen with retry, fetch timeout, `startViewTransition` theme toggle,
    navbar scroll state + scroll-spy.
  - Added `AGENTS.md`, `DESIGN.md`, `PRODUCT.md`, `.impeccable/design.json`; renamed a
    Blade Runner asset; updated `index.html` shell comments.
  - **Note:** at HEAD this commit still contained the now-fixed P1/P2 issues found by the
    Aug-31 critique (magenta card flash, non-inert mobile menu, dead "ABOUT ME", no hash
    deep-links, `.overview-stat-number` lowercase Anton, etc.).

### WIP (uncommitted — the current hardening pass)

Addresses the two `.impeccable/critique/*.md` reports (Aug 30 & Aug 31) plus polish. Files
modified: `index.html`, `src/ui.js`, `src/events.js`, `src/modal.js`, `src/script.js`,
`src/style.css`, `src/components/DexCard.js`, `.gitignore`, `docs/DESIGN.md`; **docs moved
into `docs/`** (`AGENTS.md`, `DESIGN.md`, `PRODUCT.md` via `git mv`, plus untracked
`architecture.md`/`task_state.md`); untracked:
`Asset/monochrome-overlay-background.webp`; deleted: `Asset/Star Persona.webp`. The local
Playwright test infra (`package.json`, `playwright.config.js`, `tests/`, `node_modules/`,
`test-results/`) was **removed** — browser automation now relies exclusively on the global
Playwright MCP (configured in `~/.config/opencode/opencode.jsonc`, using ungoogled
Chromium).

- **No-JS / broken-module recovery**: `<noscript>` block (`index.html:33-38`) + inline
  8-second boot watchdog that replaces the LOADING screen with a "System Error + retry" if
  `window.__dexBooted` never flips (`index.html:40-57`); `__dexBooted` is also set in the
  fetch catch path (`src/script.js:96`).
- **Focus/`inert` correctness**: closed mobile menu is now `inert` (`index.html:67`,
  toggled at `src/script.js:66,76`); modal focus trap rebuilt to enumerate real focusables
  and pull focus inside on Tab from the panel (`src/modal.js:71-93`); modal focuses the
  panel (not the close button) on open (`src/modal.js:103-107`); focus moves to the target
  section after mobile-menu navigation (`src/events.js:68-71`).
- **Deep links + Back/forward**: delegated anchor clicks now `history.pushState` the hash
  (`src/events.js:62-65`); `popstate` restores scroll position (`src/events.js:137-145`);
  cold-load hash arrival scrolls to the section (`src/script.js:48-56`).
- **Keyboard search shortcut**: `/` or Ctrl/Cmd+K focuses the dex search from anywhere
  (`src/events.js:121-133`).
- **Critique-flagged design fixes**: card hover flash changed magenta → Combat Red
  (`src/components/DexCard.js:73`); card `img alt` emptied to stop double-announcement
  (`src/components/DexCard.js:284-285`); "ABOUT ME" now scrolls to real content
  (`#dex-overview`, `src/ui.js:187`); "MORE" explore card de-clicked (no arrow, no lift,
  `src/ui.js:327-336` + `src/style.css:1257-1262`); `.overview-stat-number` gains
  `text-transform: uppercase` (`src/style.css:1599`); view-all hover uses `--red-on-dark`
  on the explore section (`src/style.css:1127-1129`); explore-card number contrast
  1.9:1 → ~3.6:1 (`rgba(12,12,12,.25)` → `.55`, `src/style.css:1178`); search placeholder
  contrast bump (`src/style.css:2218`); mobile-menu links use `--red-on-dark`;
  `scroll-margin-top: 64px` on all scroll targets (`src/style.css:572-580`); modal meta label
  "Entry" → "Category" (`src/modal.js:47`); nav label "Profile" removed.
- **Hero texture / seam rework**: `Asset/monochrome-overlay-background.webp` (untracked)
  covers the whole hero-left cream panel, multiply-blended over the cream via
  `background-blend-mode: normal, multiply` with a `rgba(255,255,255,0.75)` dilution layer
  ≈ 25% strength (`src/style.css:591-612`; tune strength by changing `0.75` → `0.85` ≈ 15%).
  The cream divider slab (`.hero-left::after`) was made `transparent` and narrowed to
  `right:-60px; width:60px` — the old opaque `var(--cream)` slab painted a flat band over
  the texture (the seam bug), and its right-hand sliver was unwanted. The red bar
  (`.hero-right::before`, unchanged) does the diagonal; it's clipped to the black panel by
  `.hero-right { overflow: hidden }`, so it never covered the cream side. **All three dead
  `Star Persona.webp` refs** (`.hero-left::before`, `.explore-section::after`,
  `.explore-star-mobile`) and the `.explore-star-mobile` element in `src/ui.js:298-300` were
  **removed** (asset deleted).
- **Housekeeping**: markdown docs moved from root into `docs/` (README.md stays at root);
  the temporary local Playwright test infra was deleted (it duplicated the global MCP and
  its test-runner browser binary was never installed).

## Known Edge Cases

Gotchas, browser workarounds, and fragile areas — each with the *why* in the code.

### Deliberate workarounds (comments in the code — do not remove)

1. **Brave `animation-timeline` bug → card reveal rules live in Light DOM, not Shadow DOM.**
   `src/style.css:1399-1407`: `.card-will-animate.card-visible/.card-ready` are authored in
   `style.css` (not inside the `DexCard` shadow template) because Brave's animation-timeline
   handling needs Light-DOM specificity to fire `.card-ready` reveals. The same classes also
   exist inside the shadow template (`src/components/DexCard.js:13-27`) — **both copies must
   be kept in sync** when touching card reveal styling.
2. **`--red` fallback sync is manual.** `src/style.css:4`: "If you change `--red`, manually
   sync the fallback values in DexCard.js & DexEmptyState.js" — the shadow components hardcode
   `#D80000`/`#FFFFFF`/etc. as `var(--red, #D80000)` fallbacks because custom-property
   fallbacks do not cross into Shadow DOM styles reliably for these usages.
3. **`encodeURI` is applied to image paths** because filenames contain spaces/apostrophes/`&`/
   parentheses (`src/components/DexCard.js:278`, `src/modal.js:32`). Caveat: `#`/`?` are NOT
   encoded — one such filename away from a broken cover.
4. **`img src` is only re-set when changed** (`src/components/DexCard.js:280-291`) to avoid
   aborting in-flight loads on `attributeChangedCallback` re-renders; then "instantly cached"
   images are resolved synchronously via `imgEl.complete` (`src/components/DexCard.js:294-299`).
   Ordering here is subtle — if you add attributes to cards after they enter the DOM, cached
   images must still hit the `complete` path.
5. **Circular import `ui.js` ↔ `DexEmptyState.js`** (`src/ui.js:3`, `src/components/DexEmptyState.js:1`)
   only works because the cross-reference is runtime-only (`DexEmptyState._render()`). Any
   refactor that lifts it to module-evaluation time (e.g. a top-level `CATEGORY_ICONS` read)
   will throw a TDZ/undefined error. AGENTS.md forbids this restructure.
6. **Boot watchdog trusts `window.__dexBooted`** (`index.html:46`) — this flag is set at
   `src/script.js:42` (after renders) and `src/script.js:96` (catch). If a future module
   sets it earlier/later, the 8-second fallback timing drifts.
7. **Fetch timeout uses `Promise.race`** (`src/script.js:19-29`) — the winning rejection is a
   generic `Error('timeout')`, indistinguishable from a network error in the catch; fine today
   (both render the same error UI).
8. **`DataStore.fetch()` is not in-flight-memoized** (`src/store.js:6-13`): `cachedData` stays
   null until the first fetch resolves, so a second concurrent call would start a duplicate
   fetch. Only one caller exists today; safe unless parallelized.
9. **`prefers-reduced-motion` is tracked twice**, once in `src/animations.js:8-12` and once in
   `src/events.js:4-8`, each with its own `change` listener. Both must stay in sync if the
   media query logic ever changes.
10. **View Transitions theme toggle** (`src/ui.js:99-105`): guarded by
    `document.startViewTransition` existence. On unsupported browsers it silently falls back
    to an instant swap — no crossfade, no error. Browsers that support VT but not
    `:view-transition` styling will still animate the default crossfade.
11. **Hero-left background uses a stylesheet-relative `../Asset/...` path**
    (`src/style.css:602`), while everything else (data.json images, `DexCard`) is
    repo-root-relative. When moving `style.css`, asset paths must be re-audited. The only
    background asset left in `style.css` is `../Asset/monochrome-overlay-background.webp`
    (all `Star Persona.webp` references were removed).
12. **`body::after` film-grain layer** (`src/style.css:145-155`) is `position: fixed`,
    `z-index: 9997`, `pointer-events: none`, 4.5% opacity, and **disabled below 768px** to keep
    the fixed compositing layer off low-end phones (`src/style.css:159-163`). It sits above
    the detail modal (z-index 3000) and below the loading screen (9999) — intentional: grain
    covers everything once loaded. The comment at `src/style.css:142-144` explicitly rejects
    `mix-blend-mode` because a full-viewport blend layer forces a re-blend every scroll frame.
13. **Scroll-spy debounce** (`src/script.js:147-148`, `src/events.js:74-85`):
    `window.isNavScrolling` is set true on manual nav and cleared after 800ms to stop
    observer-driven active-state flicker mid-scroll. Any code that scrolls to an anchor should
    respect this window or the active link will fight the user.
14. **Search hides sections by inline `style.display`** (`src/ui.js:468-475`) and matches
    dividers via `previousElementSibling` class checks — the divider lookup assumes every
    category section is immediately preceded by `.slash-divider` (true in `renderCategories`,
    `src/ui.js:267`). Inserting other content between sections will break divider hiding.
15. **Reduced-motion content visibility:** with `reduce`, `dismissLoading` immediately marks
    every card `card-ready` (`src/animations.js:17-25`) and CSS forces opacity/transform none
    (`src/style.css:2073-2150`) so **all content is visible at once** — this is the intended
    no-motion UX, not a bug.
16. **`:has()` scroll-lock** (`src/style.css:567-569`): `body:has(#mobile-menu.menu-open)`
    needs Chrome 105+/Safari 15.4+/FF 121+. Older browsers can scroll behind the open
    full-screen menu (no lock), but the menu itself still works.
17. **Modal focus-trap list** (`src/modal.js:75-76`) filters to visible, real focusables and
    excludes the `tabindex="-1"` panel that receives initial focus. If the modal ever gains a
    second interactive control (e.g. a link), the trap automatically includes it — but the
    `first`/`last` wrap logic assumes ≥1 focusable and would early-return harmlessly if zero.
18. **`inert` attribute string semantics** (`src/script.js:76`): `menu.setAttribute('inert','')`
    is the valid empty-attribute form; `removeAttribute` re-enables. Do not switch to
    `inert="false"` (invalid — still inert).
19. **Content-specific hero cropping**: `object-position: center 30%` + `scale(1.35)`
    (`src/style.css:796-802`) is tuned for the single Wisadel artwork; a different hero image
    will need re-tuning.
20. **Hard-coded persona strings** in JS (`ID: FRD-125`, `01`) at `src/ui.js:195,197` do not
    come from `data.json`; they stay correct only while the profile name/theme matches.

### Fragile spots flagged for the reviewer

- **Two copies of card-reveal CSS** (shadow + Light DOM) must stay in sync — the #1 rule for
  future motion work.
- **Red token family has four members with strict semantics** (`--red`/`--red-dark`/
  `--red-text`/`--red-on-dark`); using the wrong one on a void surface drops below the 4.5:1
  floor the DESIGN.md promises (`DESIGN.md:259`). `--red-on-dark` is the only safe red on
  always-dark surfaces.
- **Uncommitted WIP + untracked test infra** mean `git status` and `main` diverge
  significantly; a reviewer or collaborator working off HEAD sees the pre-hardening code
  (magenta flash, non-inert menu, no deep links).
- **`index.html:101-103` impeccable-live script** must be stripped before any deploy.
- **Hero seam stays fragile by design**: `.hero-left::after` is now `transparent`
  (vestigial — kept only to preserve the skew geometry), and the red bar is clipped by
  `.hero-right { overflow: hidden }`. If the cream slab is ever given a visible background
  again, the flat-band-over-texture bug will return (see the WIP "Hero texture / seam
  rework" note).
