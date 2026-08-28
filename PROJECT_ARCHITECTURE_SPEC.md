# PROJECT ARCHITECTURE SPEC
## Personal Dex — Complete Structural Audit
> **Version:** 1.0 | **Audited:** 2026-08-29 | **Auditor:** Technical System Analyst & Software Architect  
> **Status:** PRE-REDESIGN BASELINE REFERENCE — Frozen for Arknights/PRTS UI Redesign

---

## 1. SYSTEM OVERVIEW & MISSION SCOPE

### 1.1 Core Purpose
**Personal Dex** is a static, single-page, responsive personal media collection and showcase catalog (a curated "Pokédex" for personal media consumption). It displays the user's favorite cultural artifacts across four primary categories: **Games**, **Manga & Manhwa**, **Movies & Series**, and **Music**.

The web application is **100% client-side, read-only**, and built purely with vanilla web standards (HTML5, Vanilla CSS3, ES Modules, and native Web Components). There are no external runtimes, build tools, bundlers, or backend database servers.

### 1.2 Current Visual Identity & Design Paradigm
- **Aesthetic Theme:** Persona 5 UI / Acid Graphic / Neo-Brutalist styling.
- **Key Visual Elements:** High-contrast red/black/cream palette (`#D80000`, `#0C0C0C`, `#F0ECE2`), heavy halftone dot grids, dynamic angled slashes (`skewX(-8deg)`, `polygon()`), hard geometric card drop-shadows (`6px 6px 0 #000, -4px -4px 0 #D80000`), kinetic panel entry transitions, and tactile hover states.
- **Target Evolution:** Transitioning toward an **Arknights / PRTS (Rhodes Island OS)** tactical sci-fi operational interface, while maintaining 100% of underlying data schemas, routing hooks, and interactive features.

### 1.3 Functional Scope (Complete Feature Matrix)

| Feature / Subsystem | Functional Description | Implementation Mechanism |
|---|---|---|
| **Loading & Splash Screen** | Fullscreen backdrop blocking interaction until `data.json` is parsed and rendered. Skew-slides out on completion with fallback error rendering. | `#loading-screen`, `animations.js::dismissLoading` |
| **Sticky Navigation Bar** | Fixed/sticky top navigation with wordmark branding, section routing links, light/dark theme switch, and mobile/desktop drawer triggers. | `#site-navbar`, `ui.js::renderNavbar`, CSS `backdrop-filter` |
| **Navbar Scroll State** | Adds `.navbar-scrolled` when `scrollY > 50px`, enabling frosted backdrop blur and shadow. | `script.js::setupNavbarScroll` (passive `rAF`) |
| **Scroll-Spy Engine** | Tracks active viewport section and automatically sets `.active` indicator on matching navbar & mobile links. | `script.js::setupScrollSpy` (`IntersectionObserver`) |
| **Smooth Navigation** | Intercepts internal `#` links and `[data-scroll-to]` triggers for smooth animated scrolling with reduced-motion support. | `events.js::initEvents` (`scrollIntoView`) |
| **Mobile Drawer Overlay** | Fullscreen modal menu with large typographic route links; handles focus trapping, backdrop locking, and Escape key dismissal. | `#mobile-menu`, `events.js`, `script.js` |
| **Theme Engine** | Light/Dark mode switcher with `localStorage` persistence, OS `prefers-color-scheme` initial check, and Chromium View Transitions support. | `ui.js::initTheme`, `ui.js::toggleTheme` (`data-theme`) |
| **Hero Showcase Panel** | Split-screen presentation: left side contains personal bio, social action rail, and dual CTAs; right side displays character key visual and tactical ID card. | `#hero-section`, `ui.js::renderHero` |
| **Explore Categories Matrix** | Quick-navigation summary cards showing icon, category title, total count, description, and direct jump anchor. | `#explore-categories`, `ui.js::renderExploreCategories` |
| **Category Card Grids** | Distinct catalog sections rendering `<dex-card>` custom elements in responsive grids with staggered rotation angles. | `#categories-container`, `ui.js::renderCategories` |
| **Recently Added Feed** | Chronologically sorted horizontal/grid card feed displaying the 4 newest media additions across all categories. | `#recent-overview .recent-column`, `store.js::getRecentItems` |
| **Dex Overview Analytics** | At-a-glance stat counters (Total entries computed dynamically, earliest collection year, updates cadence, 100% personal flag). | `#recent-overview .overview-column`, `ui.js::buildDexOverview` |
| **Lazy Loading & Fallbacks** | Card image skeletons with shimmer effect, lazy loading, and initial-letter colored fallback cards on image load failure. | `<dex-card>` (`DexCard.js`), `IntersectionObserver` |
| **Scroll Reveal Triggers** | Staggered kinetic entrance animations for category sections and individual cards as they scroll into view. | `animations.js::setupScrollReveals` |
| **Accessibility Subsystem** | Skip-to-content link, ARIA dialog roles, live status regions, and comprehensive `prefers-reduced-motion` overrides. | `index.html`, `style.css`, `events.js` |

---

## 2. DATA & CONTENT SCHEMA

### 2.1 Data Source
The application is fed entirely by a single local JSON document: [`data.json`](file:///c:/Users/Fradana/Documents/Project%20Pribadi/Media-Dex/data.json).

### 2.2 Complete JSON Schema Specification

```typescript
interface PersonalDexData {
  profile: ProfileSchema;
  socials: SocialLinkSchema[];
  categories: CategorySchema[];
}

interface ProfileSchema {
  name: string;        // Full name ("Fradana")
  handle: string;      // Social handle ("@afif_fradana")
  tagline: string;     // Personal bio description
  quote: string;       // Featured quotation on ID card
  location: string;    // Geographic location string ("Solo, ID")
  avatar: string;      // Asset path for avatar image
  heroImage: string;    // Asset path for full hero right-panel artwork
}

interface SocialLinkSchema {
  platform: "instagram" | "steam" | "github" | "twitter" | "discord";
  url: string;         // External URL
  label: string;       // Screen reader and hover tooltip label
}

interface CategorySchema {
  id: string;          // Slug identifier ("games", "manga-manhwa", "movies-tv", "music")
  title: string;       // Display title in caps ("GAMES", "MANGA & MANHWA")
  accentLabel: string; // Informal tag line ("now playing", "reading list", "watchlist", "on repeat")
  description: string; // Explanatory subtitle for explore card
  icon: "gamepad" | "book" | "tv" | "music" | "bookmark" | "more";
  items: MediaItemSchema[];
}

interface MediaItemSchema {
  title: string;       // Primary work title (e.g. "Arknights", "Blade Runner 2049")
  subtitle: string;    // Metadata line (Genre, Developer, Author, Studio, Year)
  image: string;       // Relative filepath to asset image
  dateAdded: string;   // ISO-8601 Date string ("YYYY-MM-DD") used for recency sorting
}
```

### 2.3 Hardcoded Data & Content Inventory

#### A. Profile Data
- **Name:** `Fradana` (Rendered uppercase in Navbar and Hero ID Card)
- **Handle:** `@afif_fradana`
- **Tagline:** `"A personal database of the things I love. Games. Manhwa. Anime. Music. And more."`
- **Quote:** `"Living a life surrounded by stories I love."`
- **Location:** `"Solo, ID"`
- **Hero Artwork / Avatar:** `Asset/Profile/Wisadel_Skin.webp`
- **ID Badge Code (Hardcoded in `ui.js:184`):** `"ID: FRD-125"`

#### B. Social Links (3 entries)
1. **Instagram:** `https://instagram.com/afif_fradana` (Platform: `instagram`)
2. **Steam:** `https://steamcommunity.com/id/Fradana/` (Platform: `steam`)
3. **GitHub:** `https://github.com/afif25fradana` (Platform: `github`)

#### C. Categories & Items (31 Total Media Entries)

```
├── GAMES (id: "games", icon: "gamepad", accent: "now playing", 8 items)
│   ├── [2026-08-15] Arknights — "Tactical RPG · Hypergryph"
│   ├── [2026-07-28] Cyberpunk 2077 — "Open World RPG · CD Projekt Red"
│   ├── [2026-06-05] Assassin's Creed: Brotherhood — "Action Adventure · Ubisoft"
│   ├── [2026-05-19] Detroit: Become Human — "Choice-Driven Drama · Quantic Dream"
│   ├── [2026-04-30] The Witcher 3: Wild Hunt — "Action RPG · CD Projekt Red"
│   ├── [2026-03-22] Monster Hunter: World — "Action RPG · Capcom"
│   ├── [2026-02-11] Forza Horizon 6 — "Racing / Open World · Playground Games"
│   └── [2026-01-19] No Man's Sky — "Sci-Fi Exploration · Hello Games"
│
├── MANGA & MANHWA (id: "manga-manhwa", icon: "book", accent: "reading list", 8 items)
│   ├── [2026-08-12] Absolute Regression — "Jang Young-hoon · A4 · Nara Yeo"
│   ├── [2026-07-17] I'm An Evil God — "Xie Yan"
│   ├── [2026-06-24] Mist, Might, Mayhem — "Han Joong Wueol Ya"
│   ├── [2026-05-08] Pick Me Up, Infinite Gacha — "Hermod · nicesun"
│   ├── [2026-04-21] Sakamoto Days — "Yuto Suzuki"
│   ├── [2026-03-14] Star-Embracing Swordmaster — "Q10 · Hong Dae-ui · Juno"
│   ├── [2026-02-26] The Greatest Estate Developer — "BK_Moon · Lee Hyun-min · Kim Hyun-soo"
│   └── [2026-01-19] The Regressed Mercenary's Machinations — "Gold Line · Lee Park Jin-seok"
│
├── MOVIES & SERIES (id: "movies-tv", icon: "tv", accent: "watchlist", 7 items)
│   ├── [2026-08-07] Better Call Saul — "Crime Drama · AMC"
│   ├── [2026-07-02] Blade Runner 2049 — "Sci-Fi / Neo-Noir · 2017"
│   ├── [2026-06-18] Breaking Bad — "Crime Drama · AMC"
│   ├── [2026-05-09] Code Geass: Lelouch of the Rebellion — "Mecha / Strategy · Sunrise"
│   ├── [2026-04-13] Interstellar — "Sci-Fi / Space Drama · 2014"
│   ├── [2026-03-05] Frieren: Beyond Journey's End — "Fantasy / Adventure · 2023"
│   └── [2026-02-20] Vinland Saga — "Historical Drama · 2014"
│
└── MUSIC (id: "music", icon: "music", accent: "on repeat", 8 items)
    ├── [2026-08-16] Aria Math — "Daniel Rosenfeld"
    ├── [2026-08-09] Dracula — "Tame Impala"
    ├── [2026-07-31] DILATING — "PIXY"
    ├── [2026-07-11] Freakin Out — "Dexter and The Moonrocks"
    ├── [2026-06-29] Tate McRae - Siren Sounds [Altare Remix] — "Altare"
    ├── [2026-06-02] Surabaya — "Crayon Case"
    ├── [2026-05-15] Wassup? — "Kei"
    └── [2026-04-06] Paparazzi (Dubstep) — "Alximo"
```

#### D. Static Navigation Routes & Anchors (`NAV_LINKS`)
1. **Home:** `#hero-section`
2. **Profile:** `#hero-id-card-anchor`
3. **Collection:** `#explore-categories`
4. **Journal:** `#recent-overview`
5. **About:** `#site-footer`
6. **Category Jump:** `#categories-container` / `#section-{id}`

---

## 3. DOM STRUCTURE & UI COMPONENT TREE

### 3.1 Static Skeleton (`index.html`)
The static HTML acts as a container host. Dynamic content is injected by `ui.js` modules upon JSON resolution.

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>...</head>
  <body>
    <a href="#app" class="skip-link">Skip to content</a>
    <div id="loading-screen" class="loading-screen" aria-hidden="false" role="status">...</div>
    <nav id="site-navbar" class="site-navbar" aria-label="Main navigation"></nav>
    <div id="mobile-menu" class="mobile-menu" aria-hidden="true" role="dialog"></div>
    <main id="app" class="app" aria-label="Personal Media Dex">
      <section id="hero-section" class="hero-section" aria-label="Welcome hero"></section>
      <section id="explore-categories" class="explore-section" aria-label="Explore categories"></section>
      <div id="categories-container"></div>
      <section id="recent-overview" class="recent-overview-section" aria-label="Recent entries and statistics"></section>
      <footer id="site-footer" class="site-footer"></footer>
    </main>
    <script type="module" src="script.js"></script>
  </body>
</html>
```

### 3.2 Dynamic Runtime DOM Tree (Complete Component Hierarchy)

```
document.body
│
├── a.skip-link [href="#app"]
│
├── div#loading-screen.loading-screen [.dismissed when loaded]
│   └── div.loading-inner
│       ├── span.loading-text ("LOADING")
│       └── span.loading-dots ("...")
│
├── nav#site-navbar.site-navbar [.navbar-scrolled on scroll]
│   ├── div.navbar-left
│   │   └── a.navbar-logo [href="#hero-section"]
│   │       ├── svg (LOGO_SVG Hexagon)
│   │       └── span.navbar-wordmark ("FRADANA" + span.navbar-wordmark-accent "DEX")
│   ├── div.navbar-center
│   │   ├── a.navbar-link.active [href="#hero-section", data-nav-index="0"]
│   │   ├── a.navbar-link [href="#hero-id-card-anchor", data-nav-index="1"]
│   │   ├── a.navbar-link [href="#explore-categories", data-nav-index="2"]
│   │   ├── a.navbar-link [href="#recent-overview", data-nav-index="3"]
│   │   └── a.navbar-link [href="#site-footer", data-nav-index="4"]
│   └── div.navbar-right
│       ├── button#theme-toggle-btn.theme-toggle
│       │   ├── span.theme-toggle-icon (Sun SVG)
│       │   └── span.theme-toggle-track > span.theme-toggle-thumb
│       ├── button#navbar-menu-desktop-btn.navbar-menu-desktop ("MENU" + Menu SVG)
│       └── button#navbar-menu-btn.navbar-menu-btn ("MENU" + Menu SVG)
│
├── div#mobile-menu.mobile-menu [.menu-open when triggered]
│   ├── button#mobile-menu-close.mobile-menu-close (Close X SVG)
│   ├── a.mobile-menu-link [href="#hero-section"]
│   ├── a.mobile-menu-link [href="#hero-id-card-anchor"]
│   ├── a.mobile-menu-link [href="#explore-categories"]
│   ├── a.mobile-menu-link [href="#recent-overview"]
│   └── a.mobile-menu-link [href="#site-footer"]
│
└── main#app.app
    │
    ├── section#hero-section.hero-section
    │   ├── div.hero-left
    │   │   ├── div.hero-social-rail
    │   │   │   ├── a [href="instagram"] > SVG
    │   │   │   ├── div.hero-social-divider
    │   │   │   ├── a [href="steam"] > SVG
    │   │   │   ├── div.hero-social-divider
    │   │   │   └── a [href="github"] > SVG
    │   │   ├── div.hero-eyebrow ("// WELCOME")
    │   │   ├── h1.hero-headline ("WELCOME TO MY PERSONAL DEX")
    │   │   ├── p.hero-bio (Tagline text)
    │   │   └── div.hero-cta-row
    │   │       ├── button.btn-primary [data-scroll-to="#explore-categories"] ("EXPLORE DEX" + Arrow SVG)
    │   │       └── button.btn-secondary [data-scroll-to="#hero-id-card-anchor"] ("ABOUT ME" + User SVG)
    │   └── div#hero-id-card-anchor.hero-right
    │       ├── div.hero-illustration > img [src="Wisadel_Skin.webp", fetchpriority="high"]
    │       ├── span.hero-deco-number ("01")
    │       ├── div.hero-id-card
    │       │   ├── span.hero-id-code ("ID: FRD-125")
    │       │   ├── h2.hero-id-name ("FRADANA")
    │       │   ├── p.hero-id-location ("Solo, ID")
    │       │   ├── p.hero-id-quote ("Living a life surrounded by stories I love.")
    │       │   └── span.hero-id-quote-marks ("❝")
    │       └── div.hero-scroll-down
    │           ├── span.hero-scroll-text ("SCROLL DOWN")
    │           └── svg.hero-scroll-arrow
    │
    ├── section#explore-categories.explore-section
    │   ├── div.explore-star-mobile [Mobile decorative texture]
    │   ├── div.explore-header
    │   │   ├── div.explore-header-left
    │   │   │   ├── span.section-eyebrow ("// DEX COLLECTION")
    │   │   │   └── h2.explore-heading ("EXPLORE CATEGORIES")
    │   │   └── a.view-all-link [href="#categories-container"] ("VIEW ALL" + Arrow SVG)
    │   └── div.explore-grid
    │       ├── a.explore-card [href="#section-games"]
    │       │   ├── span.explore-card-number ("01")
    │       │   ├── span.explore-card-icon > SVG (Gamepad)
    │       │   ├── h3.explore-card-name ("GAMES")
    │       │   ├── span.explore-card-count ("8 Items")
    │       │   ├── p.explore-card-desc ("Games I've played and enjoyed.")
    │       │   └── svg.explore-card-arrow
    │       ├── a.explore-card [href="#section-manga-manhwa"] (02 - MANGA & MANHWA)
    │       ├── a.explore-card [href="#section-movies-tv"] (03 - MOVIES & SERIES)
    │       ├── a.explore-card [href="#section-music"] (04 - MUSIC)
    │       └── div.explore-card.explore-card--more (05 - MORE / Coming Soon)
    │
    ├── div#categories-container
    │   ├── div.slash-divider
    │   ├── section#section-games.category-section.panel-enter.panel-enter--left [data-category="games"]
    │   │   ├── div.section-header
    │   │   │   ├── div.section-banner > h2.section-title ("GAMES")
    │   │   │   └── span.section-accent ("now playing")
    │   │   └── div.card-grid
    │   │       └── dex-card.card-will-animate (x8) [Shadow DOM: Card, Skeleton, Cover Img, Title, Subtitle]
    │   ├── div.slash-divider
    │   ├── section#section-manga-manhwa.category-section.panel-enter.panel-enter--right (x8 dex-card)
    │   ├── div.slash-divider
    │   ├── section#section-movies-tv.category-section.panel-enter.panel-enter--left (x7 dex-card)
    │   ├── div.slash-divider
    │   └── section#section-music.category-section.panel-enter.panel-enter--right (x8 dex-card)
    │
    ├── section#recent-overview.recent-overview-section
    │   ├── div.recent-column
    │   │   ├── div.recent-header
    │   │   │   ├── div.recent-header-left
    │   │   │   │   ├── span.section-eyebrow ("// RECENT ENTRIES")
    │   │   │   │   └── h2.recent-heading ("RECENTLY ADDED")
    │   │   │   └── a.view-all-link [href="#categories-container"] ("VIEW ALL" + Arrow SVG)
    │   │   └── div.recent-cards-row
    │   │       └── button.recent-card (x4, sorted descending by dateAdded)
    │   │           ├── div.recent-card-image
    │   │           │   ├── img [src, loading="lazy"]
    │   │           │   └── span.recent-card-tag (Category Tag)
    │   │           └── div.recent-card-body
    │   │               ├── h3.recent-card-title (Item Title)
    │   │               └── p.recent-card-meta (Item Subtitle · Formatted Date)
    │   └── div.overview-column
    │       ├── div.overview-header
    │       │   ├── span.section-eyebrow ("AT A GLANCE")
    │       │   └── h2.overview-heading ("DEX OVERVIEW")
    │       └── div.overview-grid
    │           ├── div.overview-stat (Total Entries: 31)
    │           ├── div.overview-stat (Since: 2026)
    │           ├── div.overview-stat (Updates: Sometimes)
    │           └── div.overview-stat (Personal: 100%)
    │
    └── footer#site-footer.site-footer
        └── div.footer-inner
            ├── span.footer-left ("© 2026 Fradana Dex. All rights reserved.")
            ├── span.footer-center > svg (FOOTER_WINGS_SVG)
            └── span.footer-right ("BUILT WITH ♥ AND PASSION")
```

---

## 4. LOGIC & FUNCTIONAL INVENTORY

### 4.1 Module Dependency Graph

```
index.html
  └── script.js (Controller & Orchestrator)
        ├── store.js (Data Management)
        ├── events.js (Event Delegation Hub)
        ├── animations.js (Motion Orchestrator)
        └── ui.js (DOM View Renderer)
              ├── store.js
              ├── components/DexCard.js (Custom Element: <dex-card>)
              └── components/DexEmptyState.js (Custom Element: <dex-empty-state>)
```

### 4.2 Module-by-Module Breakdown

#### A. `store.js` (State & Data Store)
- **Pattern:** IIFE Singleton Module (`DataStore`).
- **State variables:** `cachedData` (raw JSON), `cachedRecent` (flattened and sorted item cache).
- **Functions:**
  - `fetch()`: Asynchronous `fetch('data.json')`. Checks for HTTP response validity and caches data permanently in memory.
  - `getRecentItems(count = 4)`: Flattens items from all categories, injects `categoryTitle` and `categoryId`, sorts descending by `dateAdded`, caches, and slices the top `count`.

#### B. `events.js` (Event Dispatcher & Delegator)
- **Pattern:** Single top-level document event delegation hub.
- **Functions:**
  - `initEvents(actions)`: Binds global `click` and `keydown` listeners.
- **Event Mappings:**
  1. `click` on `#theme-toggle-btn` ➔ calls `actions.toggleTheme()`.
  2. `click` on `#navbar-menu-btn` or `#navbar-menu-desktop-btn` ➔ calls `actions.openMenu()`.
  3. `click` on `#mobile-menu-close` ➔ calls `actions.closeMenu()`.
  4. `click` on `.mobile-menu-link` ➔ calls `actions.closeMenu()` and performs smooth scroll.
  5. `click` on `[data-scroll-to]` ➔ queries target selector and executes `scrollIntoView`.
  6. `click` on `a[href^="#"]` ➔ smooth scrolls to anchor, updates `.active` link classes, sets temporary debouncing flag `window.isNavScrolling = true` (800ms).
  7. `keydown` for `Escape` ➔ closes open mobile drawer and refocuses `#navbar-menu-btn`.

#### C. `animations.js` (Animation Controller)
- **Functions:**
  - `dismissLoading(onDone)`: Delays 500ms, appends `.dismissed` to `#loading-screen`, sets `display: none` and `aria-hidden="true"` after 400ms, then invokes `onDone`.
  - `triggerPageEntrance()`: Queries `.panel-enter` elements currently in viewport and staggers adding `.revealed` by 120ms intervals.
  - `setupScrollReveals()`: Attaches `IntersectionObserver` to each `.category-section` and `.site-footer`. On intersection:
    - Adds `.revealed` to the section.
    - Adds `.card-visible` to all child cards.
    - Adds `.card-ready` after 1000ms.
    - Unobserves the section.
  - `isInViewport(el)`: Helper checking element bounding rectangle against `window.innerHeight`.
- **Motion Safety:** Automatically bypasses all delays and sets components immediately visible if `prefers-reduced-motion: reduce` is detected.

#### D. `ui.js` (DOM Rendering Engine)
- **Core Utility Helpers:**
  - `esc(str)`: Escapes raw HTML strings via temporary span elements to prevent XSS.
  - `h(tag, props, ...children)`: Hyperscript builder creating sanitized DOM tree nodes directly without `innerHTML` parsing.
- **Theme Functions:**
  - `initTheme()`: Reads `localStorage['dex-theme']` (fallback to system `matchMedia`), sets `data-theme` on `<html>`.
  - `toggleTheme()`: Flips theme between `'light'` and `'dark'`, saves to `localStorage`, wrapping in `document.startViewTransition()` where supported.
- **Render Pipelines:**
  - `renderNavbar(profile)`: Injects navbar logo, route links, theme switch, and drawer buttons.
  - `renderMobileMenu()`: Injects mobile menu items and close button.
  - `renderHero(profile, socials)`: Injects left bio/socials panel and right artwork/tactical ID badge.
  - `renderExploreCategories(categories)`: Generates category overview cards and appends the "+ MORE" tile.
  - `renderCategories(categories)`: Iterates over categories, adds `.slash-divider` elements, constructs section headers, and populates grid with `<dex-card>` instances.
  - `renderRecentlyAdded(categories)`: Renders 4 recency tiles and builds the "DEX OVERVIEW" summary grid.
  - `renderFooter()`: Injects copyright, year, wings graphic, and attribution.
  - `buildDexOverview(categories)`: Computes total entry count and earliest year (`Math.min` over `dateAdded`).

#### E. Web Component: `DexCard` (`components/DexCard.js`)
- **Element Tag:** `<dex-card>` (Shadow DOM Mode: `open`).
- **Observed Attributes:** `title`, `subtitle`, `image-src`, `rotation`.
- **Internal Structure:**
  - Outer button (`.card`) with rotation transformation variable (`--rotation`).
  - Cover wrapper (`.card-cover`) containing `.skeleton` shimmer loader, native `<img>`, and letter fallback (`.card-placeholder`).
  - Info panel (`.card-info`) with `.card-title` and `.card-subtitle`.
- **Lifecycle & Behaviors:**
  - Caches and sets image source via `encodeURI()`.
  - Hides shimmer on native image `load` event; shows `.loaded` transition.
  - On error, displays fallback box with the initial letter of the item's title.
  - Exposes `card.itemData = item` property on the host DOM node for event delegation.

#### F. Web Component: `DexEmptyState` (`components/DexEmptyState.js`)
- **Element Tag:** `<dex-empty-state>` (Shadow DOM Mode: `open`).
- **Observed Attributes:** `icon`, `message`, `action-text`.
- **Behaviors:** Renders empty state banner with category icon when `items.length === 0`, emitting an `action-click` CustomEvent on CTA interaction.

---

## 5. ASSETS & DEPENDENCIES

### 5.1 Local Media Assets (All `.webp` format)

```
Asset/
├── Star Persona.webp (139 KB - Decorative halftone background star)
├── Games/ (8 files)
│   ├── Arknight.webp
│   ├── Assassin_Creed_BrotherHood.webp
│   ├── CyberPunk_2077.webp
│   ├── Detroit_Become_Human.webp
│   ├── Forza_Horizon_6.webp
│   ├── Monster_Hunter_World.webp
│   ├── No_Mans_Sky.webp
│   └── The_Witcher_3.webp
├── ManhwaManga Cover/ (8 files)
│   ├── Absolute Regression.webp
│   ├── I'm An Evil God.webp
│   ├── Mist, Might, Mayhem.webp
│   ├── Pick Me Up, Infinite Gacha.webp
│   ├── Sakamoto Days.webp
│   ├── Star-Embracing Swordmaster.webp
│   ├── The Greatest Estate Developer.webp
│   └── The Regressed Mercenary's Machinations.webp
├── Movie&TV/ (7 files)
│   ├── Better_Call_Saul.webp
│   ├── Blade Runner 2045, movie poster_ Featuring none other than Ryan Gosling.webp
│   ├── Breaking_Bad.webp
│   ├── Code_Geass.webp
│   ├── Poster Interstellar (2014) _ Wall Art _ 3+1 FREE _ UKposters.webp
│   ├── Sousou no Frieren__Frieren_ Beyond Journey's End.webp
│   └── Vinland Saga_Poster.webp
├── Music/ (8 files)
│   ├── Aria_Math-C418.webp
│   ├── Dilatin-Pixy.webp
│   ├── Dracula-Tame_Impala.webp
│   ├── Freakin_out-Dexter.webp
│   ├── Papparazi(Dubstep)-Alximo.webp
│   ├── Siren_Sound-Altare.webp
│   ├── Surabaya-Crayon_case.webp
│   └── wassup-kei.webp
└── Profile/ (1 file)
    └── Wisadel_Skin.webp (1.4 MB - Character Key Visual)
```

> **Note on Audio & Dependencies:** There are **zero audio files** and **zero audio player widgets** in the current project. There are no npm packages or runtime libraries (100% vanilla).

### 5.2 External Fonts & Typography Links
Included via Google Fonts CDN in `index.html`:
- **Anton** (`family=Anton`): Display headers, numbers, and card titles.
- **Inter** (`family=Inter:wght@400;600;700`): Primary body, meta info, buttons.
- **Caveat** (`family=Caveat:wght@400`): Script/handwritten accents and category badges.
- **Permanent Marker** (`family=Permanent+Marker`): Defined as `--font-accent` token.

---

## 6. CSS DESIGN SYSTEM & TOKENS AUDIT

### 6.1 Design Tokens (`:root` & `[data-theme="dark"]`)

```css
/* Color Palette */
--red: #D80000;
--red-dark: #CC0000;
--red-text: #CC0000;           /* Light: #CC0000 | Dark: #FF3333 */
--black: #0C0C0C;
--cream: #F0ECE2;
--white: #FFFFFF;

/* Semantic Surfaces */
--color-bg: #F0ECE2;           /* Dark: #0C0C0C */
--color-surface: #FFFFFF;      /* Dark: #1A1A20 */
--color-surface-dark: #1A1A20;
--color-text: #0C0C0C;         /* Dark: #F0ECE2 */
--color-text-muted: rgba(12,12,12,0.7); /* Dark: rgba(240,236,226,0.7) */
--color-text-on-dark: #F0ECE2;
--color-border: #D4D0C8;       /* Dark: #3A3A42 */
--color-border-dark: #3A3A42;
--navbar-bg: rgba(240,236,226,0.95); /* Dark: rgba(12,12,12,0.95) */

/* Motion Timing & Physics */
--ease-snap: cubic-bezier(0.1, 0.9, 0.2, 1);
--ease-hard: cubic-bezier(0.7, 0, 0.3, 1);
--ease-punch: cubic-bezier(0.22, 1.2, 0.36, 1);
--dur-fast: 150ms;
--dur-normal: 250ms;
--dur-entry: 400ms;

/* Graphic Depth & Shadow Tokens */
--shadow-card: 6px 6px 0 #000, -4px -4px 0 var(--red);
--shadow-card-hover: 10px 10px 0 #000, -6px -6px 0 var(--red);
--shadow-card-press: 2px 2px 0 #000, -2px -2px 0 var(--red);
```

### 6.2 Responsive Media Queries
- `@media (min-width: 1200px)`: 4-column card grid, 6-column explore category grid.
- `@media (max-width: 1024px)`: Single-column hero split, stacked recent overview columns.
- `@media (max-width: 768px)`: Navbar links collapse to hamburger drawer, 2-column card grid, social rail hidden.
- `@media (max-width: 480px)`: Full-width stacked buttons, 1-column explore grid, 2-column tight card grids.
- `@media (prefers-reduced-motion: reduce)`: Disables all CSS keyframes, transforms, and clip-path transitions.

---

## 7. PRESERVATION CHECKLIST FOR REDESIGN

Before initiating any styling or HTML re-skinning for the **Arknights/PRTS** aesthetic, verify that all following functional bindings remain **strictly intact (1:1)**:

### 7.1 Data & Logic Bindings
- [ ] **`data.json` Schema Integrity:** Keep `profile`, `socials`, `categories`, and `items` schema definitions identical.
- [ ] **DataStore Caching Model:** Preserve `DataStore.fetch()` and `DataStore.getRecentItems()` single-fetch caching mechanics.
- [ ] **All 31 Media Entries:** Ensure every single item across Games, Manhwa/Manga, Movies/TV, and Music is preserved and rendered.
- [ ] **Computed Analytics:** Preserve automatic calculation of total entries (`sum(items.length)`) and earliest collection year from `dateAdded`.
- [ ] **Recency Sorting Algorithm:** Ensure `DataStore.getRecentItems(4)` continues to sort dynamically by `dateAdded` descending.

### 7.2 Routing & DOM Identifiers
- [ ] **Anchor Target IDs:** Must retain exact target IDs:
  - `#app`
  - `#loading-screen`
  - `#site-navbar`
  - `#mobile-menu`
  - `#hero-section`
  - `#hero-id-card-anchor`
  - `#explore-categories`
  - `#categories-container`
  - `#section-games`
  - `#section-manga-manhwa`
  - `#section-movies-tv`
  - `#section-music`
  - `#recent-overview`
  - `#site-footer`
- [ ] **Navigation Links Array (`NAV_LINKS`):** Maintain all 5 anchor items in navbar and drawer.
- [ ] **Scroll-Spy & Debounce:** Retain the `IntersectionObserver` observing section elements and the debouncing flag (`window.isNavScrolling`).

### 7.3 Interactive Features & State
- [ ] **Theme Toggle Lifecycle:** Retain `data-theme="light|dark"` attribute on `<html>`, `localStorage['dex-theme']` persistence, and `startViewTransition` support.
- [ ] **Drawer Modal Logic:** Retain opening/closing state (`.menu-open`), ARIA dialog toggles (`aria-hidden`), and `Escape` key capture.
- [ ] **Web Component Contracts:** Keep `<dex-card>` attribute bindings (`title`, `subtitle`, `image-src`, `rotation`) and skeleton shimmer/fallback rendering.
- [ ] **Card Item Data Access:** Keep `card.itemData = item` binding on card nodes.
- [ ] **Empty State Handling:** Keep `<dex-empty-state>` for zero-item categories.
- [ ] **Loading Dismiss Lifecycle:** Ensure loading screen dismiss trigger waits for data resolution before unblocking UI.

### 7.4 Accessibility & Standards
- [ ] **Skip-to-Content:** Retain `<a href="#app" class="skip-link">Skip to content</a>`.
- [ ] **ARIA Roles & States:** Retain `role="status"` on loader, `role="dialog"` on mobile menu, `aria-expanded` on menu buttons, and comprehensive `aria-label` descriptions on card buttons.
- [ ] **Reduced Motion Compliance:** Retain comprehensive `@media (prefers-reduced-motion: reduce)` fallbacks in both CSS and JavaScript.

---

*Spec finalized. Ready to proceed to UI Redesign Planning upon user approval.*
