# Task State

## Current Task

All audit fixes shipped — awaiting next instruction.

> Repo state: HEAD `2b04101` is committed **and pushed** to `origin/main` (verified via
> `git ls-remote origin main`). Working tree clean. The ponytail cleanup (Stage 1 `0b5c9a8` +
> Stage 2 `cfeb249`) and the scroll-spy stuck-indicator fix (`2b04101`) described under
> "Shipped" are live on `main`.

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
- **`bdc939f` — Harden UX, fix hero texture seam, reorganize repo** (2026-09-02): the
  critique hardening pass. Confirmed **committed and pushed** (`git log` shows it at HEAD;
  `git ls-remote origin main` returns `bdc939f...`, so `origin/main` == `HEAD`) —
  - **Hero visual fixes**: `Asset/monochrome-overlay-background.webp` (new asset) covers the
    whole hero-left cream panel, multiply-blended over the cream via
    `background-blend-mode: normal, multiply` with a `rgba(255,255,255,0.75)` dilution layer
    ≈ 25% strength (`src/style.css:591-612`; tune by changing `0.75` → `0.85` ≈ 15%). The
    cream divider slab (`.hero-left::after`) was made `transparent` and narrowed to
    `right:-60px; width:60px` — the old opaque `var(--cream)` slab painted a flat band over
    the texture (the seam bug) plus an unwanted right-hand sliver. The red bar
    (`.hero-right::before`, unchanged) does the diagonal; it's clipped to the black panel by
    `.hero-right { overflow: hidden }`, so it never covered the cream side. **All three dead
    `Star Persona.webp` refs** (`.hero-left::before`, `.explore-section::after`,
    `.explore-star-mobile`) and the `.explore-star-mobile` element in `src/ui.js:298-300` were
    **removed** (asset deleted).
  - **UX hardening**: `<noscript>` block (`index.html:33-38`) + inline 8s boot watchdog
    (`index.html:40-57`); `inert` on the closed mobile menu (`index.html:67`, toggled at
    `src/script.js:66,76`); rebuilt modal focus trap + focus return (`src/modal.js:71-93,103-107`);
    focus moves to the target section after mobile-menu navigation (`src/events.js:68-71`);
    hash deep-links via `history.pushState` (`src/events.js:62-65`) + `popstate` restore
    (`src/events.js:137-145`) + cold-load hash arrival (`src/script.js:48-56`); `/` or
    Ctrl/Cmd+K focuses search (`src/events.js:121-133`); error screen retry; `scroll-margin-top:
    64px` on scroll targets (`src/style.css:572-580`); category quick-jump chips in the
    full-screen menu (`src/ui.js:158-162`, `src/style.css:526-565`).
  - **Accessibility / contrast**: card flash magenta → Combat Red (`src/components/DexCard.js:73`);
    card `img alt` emptied to stop double-announcement (`src/components/DexCard.js:284-285`);
    "ABOUT ME" → `#dex-overview` (`src/ui.js:187`); "MORE" explore card de-clicked
    (`src/ui.js:327-336` + `src/style.css:1257-1262`); `.overview-stat-number` uppercase
    (`src/style.css:1599`); view-all hover `--red-on-dark` on void (`src/style.css:1127-1129`);
    explore-card number + search placeholder contrast bumps (`src/style.css:1178,2218`);
    mobile-menu links `--red-on-dark`; modal label "Entry" → "Category" (`src/modal.js:47`);
    nav label "Profile" removed.
  - **Repo cleanup**: docs moved into `docs/` (AGENTS/DESIGN/PRODUCT via `git mv`; new
    `architecture.md`/`task_state.md` audits; README stays at root); dev-only impeccable-live
    script stripped from `index.html`; the local Playwright test infra was deleted (global
    Playwright MCP covers browser automation — the repo test-runner's browser was never
    installed).
- **`0b5c9a8` — Remove dead CSS (ponytail audit Stage 1)** (2026-09-02): deleted ~157 lines
  from `src/style.css` —
  - Dead keyframes/selectors: `@keyframes p5HeartbeatPulse`; `@keyframes slashInBottom` +
    `.panel-enter--bottom.revealed` (that entrance direction is never emitted — `ENTRANCE_DIRS`
    only yields `left`/`right`); the `.panel-animate` base rule + its two
    `.panel-animate .section-*` rules (the class is never added by JS).
  - Vestigial `.hero-left::after` (transparent, `position: absolute` — out-of-flow, no layout/
    hit-test effect; the seam is handled by `.hero-left`'s multiply-blended texture +
    `.hero-right::before`) plus its now-orphaned 1024px media override.
  - Unused tokens: `--halftone`/`--halftone-size`/`--halftone-dark` + the `.halftone` utility,
    `--in-oklch` + its `@supports` block, and `--cyan`/`--magenta`/`--yellow`/`--ease-hard`/
    `--dur-normal`/`--border-thick`/`--border-thin`.
  - Dead light-DOM selectors targeting DexCard shadow internals
    (`.card-placeholder-letter`/`.card-title`/`.card-subtitle`) and the dead `.card*`
    reduced-motion rules. **Kept** the load-bearing `.card-will-animate` reduced-motion rule
    (without it reduced-motion cards would stay `opacity: 0`).
- **`cfeb249` — JS consolidation (ponytail audit Stage 2)** (2026-09-02):
  - **Reduced-motion is now a single source of truth**: new `src/motion.js` exports
    `prefersReducedMotion()` — a fresh `matchMedia(...).matches` read per call, no cached state,
    no `change` listener. The duplicate listener + `isReducedMotion` state in `animations.js`
    and `events.js` was removed. Verified: an OS-level toggle mid-session (no reload) flips
    `smooth`↔`instant` scroll on the very next interaction; CSS `@media (prefers-reduced-motion)`
    rules also re-evaluate live.
  - Fetch timeout: hand-rolled `Promise.race` + `setTimeout` replaced with
    `AbortSignal.timeout(10000)` threaded through `DataStore.fetch(signal)`
    (`src/script.js:19`, `src/store.js:5-11`). Timeout (`TimeoutError`) and network failure
    (`TypeError`) both hit the same error UI (verified).
  - Removed `DataStore.getRecentItems` + `cachedRecent`; the recent-items flatten+sort is now
    inlined in `renderRecentlyAdded` (`src/ui.js`).
  - Removed unused `profile.handle`/`profile.avatar` (`data.json`) and unused
    `SOCIAL_ICONS.twitter`/`discord` (`src/ui.js`) — the social render loops iterate the
    `socials` array, not the icon map.
  - Deduped the X-close SVG into exported `CLOSE_ICON_SVG` (modal close, search-clear,
    mobile-menu close) and the hamburger SVG into `MENU_ICON_SVG` (`renderNavbar`); the
    ui.js `DataStore` import and modal.js local `CLOSE_ICON_SVG` were dropped.
- **`2b04101` — Fix stuck navbar active indicator (scroll-spy debounce)** (2026-09-02):
  Root cause: the scroll-spy froze the active link (e.g. stuck on RECENTLY ADDED) when a
  manual scroll happened during the 800ms `isNavScrolling` debounce after a nav click — the
  IntersectionObserver callback early-returned while the flag was true, **discarding**
  threshold-crossing entries instead of queueing them, and IO only re-fires on the next
  crossing so a static page never recovered. Fix: `src/script.js` now always updates
  `visibleSections` from entries (gating only the DOM `.active` update on `isNavScrolling`),
  recompute extracted to `applyActive()` / `window.refreshNavActive`; `src/events.js:78-81`
  calls `refreshNavActive()` at the end of the debounce to self-heal. Verified live: stuck-bug
  fixed, rapid re-click race clean (clearTimeout cancels the prior refresh), click-settle has
  no flicker, pure scroll unchanged, and the `#categories-container` gap freeze is
  byte-identical to pre-fix code.

## Known Edge Cases

Gotchas, browser workarounds, and fragile areas — each with the *why* in the code.

### Deliberate workarounds (comments in the code — do not remove)

1. **Brave `animation-timeline` bug → card reveal rules live in Light DOM, not Shadow DOM.**
   `src/style.css:1285-1298`: `.card-will-animate.card-visible/.card-ready` are authored in
   `style.css` (not inside the `DexCard` shadow template) because Brave's animation-timeline
   handling needs Light-DOM specificity to fire `.card-ready` reveals. The same classes also
   exist inside the shadow template (`src/components/DexCard.js:13-27`) — **both copies must
   be kept in sync** when touching card reveal styling.
2. **`--red` fallback sync is manual.** `src/style.css:4`: "If you change `--red`, manually
   sync the fallback values in DexCard.js & DexEmptyState.js" — the shadow components hardcode
   `#D80000`/`#FFFFFF`/etc. as `var(--red, #D80000)` fallbacks because custom-property
   fallbacks do not cross into Shadow DOM styles reliably for these usages.
3. **`encodeURI` is applied to image paths** because filenames contain spaces/apostrophes/`&`/
   parentheses (`src/components/DexCard.js:278`, `src/modal.js:30`). Caveat: `#`/`?` are NOT
   encoded — one such filename away from a broken cover.
4. **`img src` is only re-set when changed** (`src/components/DexCard.js:280-291`) to avoid
   aborting in-flight loads on `attributeChangedCallback` re-renders; then "instantly cached"
   images are resolved synchronously via `imgEl.complete` (`src/components/DexCard.js:294-299`).
   Ordering here is subtle — if you add attributes to cards after they enter the DOM, cached
   images must still hit the `complete` path.
5. **Circular import `ui.js` ↔ `DexEmptyState.js`** (`src/ui.js:2`, `src/components/DexEmptyState.js:1`)
   only works because the cross-reference is runtime-only (`DexEmptyState._render()`). Any
   refactor that lifts it to module-evaluation time (e.g. a top-level `CATEGORY_ICONS` read)
   will throw a TDZ/undefined error. AGENTS.md forbids this restructure.
6. **Boot watchdog trusts `window.__dexBooted`** (`index.html:46`) — this flag is set at
   `src/script.js:42` (after renders) and `src/script.js:96` (catch). If a future module
   sets it earlier/later, the 8-second fallback timing drifts.
7. **Fetch timeout uses `AbortSignal.timeout(10000)`** (`src/script.js:19`) — an abort rejects
   with a `TimeoutError` DOMException, distinct from a network `TypeError`; both render the same
   error UI. Needs Chrome 103+/Safari 16+/FF 100+. The signal is threaded through
   `DataStore.fetch(signal)` (`src/store.js:5-11`).
8. **`DataStore.fetch()` is not in-flight-memoized** (`src/store.js:5-11`): `cachedData` stays
   null until the first fetch resolves, so a second concurrent call would start a duplicate
   fetch. Only one caller exists today; safe unless parallelized.
9. **`prefers-reduced-motion` is a single source of truth** in `src/motion.js` —
   `prefersReducedMotion()` does a fresh `matchMedia(...).matches` read at each call site (no
   cached state, no `change` listener). All consumers (`src/animations.js`, `src/events.js`)
   import it, so a mid-session OS toggle is honored on the next interaction without a reload.
   New code needing the preference must import from `motion.js`, not re-roll a listener.
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
13. **Scroll-spy debounce** (`src/script.js:121-175`, `src/events.js:69-81`):
    `window.isNavScrolling` is set true on a nav-link click and cleared after 800ms to stop
    observer-driven active-state flicker mid-scroll. Since `2b04101` the `visibleSections`
    map is always updated from IO entries (only the DOM `.active` update is gated) and
    `window.refreshNavActive()` runs at the end of the debounce. Any code that scrolls to an
    anchor should respect this window or the active link will fight the user.
14. **Search hides sections by inline `style.display`** (`src/ui.js:468-475`) and matches
    dividers via `previousElementSibling` class checks — the divider lookup assumes every
    category section is immediately preceded by `.slash-divider` (true in `renderCategories`,
    `src/ui.js:267`). Inserting other content between sections will break divider hiding.
15. **Reduced-motion content visibility:** with `reduce`, `dismissLoading` immediately marks
    every card `card-ready` (`src/animations.js:13-20`) and CSS forces opacity/transform none
    (`src/style.css:1884-1944`) so **all content is visible at once** — this is the intended
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
21. **`isNavScrolling` debounce self-heals via `refreshNavActive`** (`src/script.js:140-175`,
    `src/events.js:78-81`): during the 800ms window after a nav click the internal
    `visibleSections` map is **always** updated from IntersectionObserver entries; only the
    DOM `.active` class update is gated on the flag. `window.refreshNavActive()` is invoked at
    the end of the debounce so the active section is reapplied even if a scroll happened
    mid-window and no further crossing fires afterward. Rapid re-clicks rely on
    `clearTimeout` cancelling the prior instance's timer before its refresh runs — verified,
    not just assumed — so only the latest click's `refreshNavActive()` actually fires.

### Fragile spots flagged for the reviewer

- **Two copies of card-reveal CSS** (shadow + Light DOM) must stay in sync — the #1 rule for
  future motion work.
- **Red token family has four members with strict semantics** (`--red`/`--red-dark`/
  `--red-text`/`--red-on-dark`); using the wrong one on a void surface drops below the 4.5:1
  floor the DESIGN.md promises (`DESIGN.md:259`). `--red-on-dark` is the only safe red on
  always-dark surfaces.
- **Repo is in sync**: `2b04101` is committed and pushed (`origin/main` == `HEAD`, working
  tree clean). Anyone checking out `main` sees the hardened, hero-fixed code — no local-only
  divergence.
- **Impeccable-live script was stripped from `index.html`** in `bdc939f`; if the live tool
  re-injects it, strip it again before any deploy.
- **Hero seam stays fragile by design**: the cream divider slab (`.hero-left::after`) was
  **removed** entirely in `0b5c9a8` — it was transparent/out-of-flow and added nothing; the
  seam is now carried by `.hero-left`'s multiply-blended texture (which reaches the panel edge)
  plus the red bar (`.hero-right::before`), clipped by `.hero-right { overflow: hidden }`. If
  the texture is ever replaced with a flat color, verify the red bar still sits flush with no
  cream sliver (see the `bdc939f` shipped entry for the original bug).
