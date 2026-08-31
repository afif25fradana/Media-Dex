---
name: Personal Media Dex
description: A sharp, disciplined, game-UI catalog of personal taste in games, manga & manhwa, movies & series, and music.
colors:
  primary: "#D80000"
  primary-deep: "#CC0000"
  primary-bright: "#FF3333"
  neutral-bg: "#F0ECE2"
  neutral-bg-dark: "#0C0C0C"
  neutral-surface: "#FFFFFF"
  neutral-surface-dark: "#1A1A20"
  neutral-ink: "#0C0C0C"
  neutral-cream: "#F0ECE2"
  neutral-border: "#D4D0C8"
  neutral-border-dark: "#3A3A42"
  neutral-muted-on-dark: "rgba(240, 236, 226, 0.55)"
  neutral-placeholder-deep: "#1a1a2e"
typography:
  display:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(2.8rem, 5.5vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.03em"
  title:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Schibsted Grotesk, Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Schibsted Grotesk, Segoe UI, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  script:
    fontFamily: "Caveat, cursive"
    fontSize: "1.15rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.01em"
  mono:
    fontFamily: "JetBrains Mono, Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sharp: "0"
  sm: "4px"
  pill: "11px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  section: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    padding: "0.85rem 2rem"
    rounded: "{rounded.sharp}"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "#FFFFFF"
    padding: "0.85rem 2rem"
    rounded: "{rounded.sharp}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    typography: "{typography.label}"
    padding: "0.85rem 2rem"
    rounded: "{rounded.sharp}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-ink}"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.neutral-surface-dark}"
    textColor: "{colors.neutral-cream}"
    typography: "{typography.title}"
    padding: "0 0 0.7rem 0"
    rounded: "{rounded.sharp}"
  explore-card:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-ink}"
    typography: "{typography.title}"
    padding: "1.5rem"
    rounded: "{rounded.sharp}"
  section-banner:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    typography: "{typography.headline}"
    padding: "0.6rem 2.5rem 0.6rem 1.5rem"
    rounded: "{rounded.sharp}"
  empty-state:
    backgroundColor: "{colors.neutral-surface-dark}"
    textColor: "{colors.neutral-cream}"
    typography: "{typography.title}"
    padding: "4rem 2rem"
    rounded: "{rounded.sm}"
---

# Design System: Personal Media Dex

## Overview

**Creative North Star: "Media Dex"**

The Media Dex is one person's taste rendered as a sharp, disciplined game-interface — a Persona 5-inspired catalog where games, manga, movies, and music are logged, stamped, and inventoried with the precision of a well-run system. It reads like the between-missions screen of a game you trust: bold condensed display type, a single violent accent, cream-and-void paper, and geometry that is always slightly defiant (rotated cards, skewed banners, clipped corners) but never chaotic. Discipline is the point: one hue, one display voice, one shadow language, repeated relentlessly.

The surface is an Experience-mode archive: the interface recedes just enough to let cover art lead, while the game chrome gives every entry the weight of a logged achievement. Density is comfortable on desktop (four-up grids, generous section padding) and collapses to two-up on phones without losing attitude.

**Key Characteristics:**

- Monochrome paper (cream / void / charcoal) + a single Combat Red accent. Red is always a stamp, never a wash.
- Anton display type for every heading: heavy, uppercase, near-tight tracking.
- Sharp geometry: 3px solid black borders, angled clip-path cuts, slight rotations on cards.
- Structural hard shadows on interactive elements; tonal layering on static surfaces.
- Halftone dot texture on dark fields and cover cards.

## Colors

Combat Red on void and cream paper — a near-monochrome system with one aggressive accent.

### Primary
- **Combat Red** (#D80000): the system's stamp and only hue. Used for buttons, section banners, tags, active-nav underlines, stat bars, ID-card code chips, hover treatments, and focus rings. Never as a page background.
- **Combat Red Deep** (#CC0000): Combat Red's pressed/hover state; also the light-theme link red (`--red-text`).
- **Combat Red Bright** (#FF3333): Combat Red raised for readable accents and links on dark surfaces (dark-theme `--red-text`). Also the `--red-on-dark` token: the constant red for labels that always sit on void regardless of theme (explore/overview eyebrows, the "more" card count), kept at ≥4.5:1 on `#0C0C0C`.

### Neutral
- **Void** (#0C0C0C): the dark ground — dark-theme background, hero right panel, explore section, card-cover ground.
- **Dex Cream** (#F0ECE2): the light ground and text-on-dark — light-theme background, hero left panel, explore-card faces, body text on dark surfaces.
- **Paper White** (#FFFFFF): light-theme surface for recent cards.
- **Charcoal Surface** (#1A1A20): dark card faces, ID card, overview panel, footer ground.
- **Warm Border** (#D4D0C8): light-theme hairlines and divider rules.
- **Steel Border** (#3A3A42): dark-theme hairlines and the theme-toggle track.
- **Placeholder Deep** (#1a1a2e): a near-black indigo used only in image-placeholder gradients (hero and recent-card fallbacks); reads as a neutral tint, not a hue.
- **Skeleton Base/Shine** (#333/#444): the cover-image loading shimmer; lives only inside the DexCard skeleton state.

### Named Rules
**The One-Accent Rule.** Combat Red is the system's only hue. The preserved cyan, magenta, and yellow tokens are dormant legacy and must stay unused — a second hue on any screen is a failure.

**The Stamp Rule.** Combat Red appears as a stamp: buttons, banners, tags, underlines, bars — small, high-authority marks. Red never covers a page surface; its rarity is what makes it read as authoritative.

## Typography

**Display Font:** Anton (with Impact fallback) — wordmark, hero, section titles, card titles, stat numbers; always uppercase.
**Body Font:** Schibsted Grotesk (with Segoe UI/Arial fallback) — paragraphs, buttons, meta, labels, quotes.
**Script Font:** Caveat — handwritten accents (card subtitles, section accent labels).
**Mono Font:** JetBrains Mono (with Consolas fallback) — system data: eyebrows, ID codes, catalog indices, menu labels, tags, scroll indicators, search results. Permanent Marker was pruned (declared but never used).

**Character:** Poster-meets-ledger meets terminal. Anton supplies the blunt, athletic shout; Schibsted Grotesk is the calm, contemporary counter-voice; Caveat adds a personal, hand-written footnote; JetBrains Mono marks the system layer that the dex persona lives in — catalog numbers, ID codes, and boot labels read as real data, not decoration.

### Hierarchy
- **Display** (Anton 400, `clamp(2.8rem, 5.5vw, 5rem)`, line-height 1.05, -0.01em): hero headline only; always uppercase.
- **Headline** (Anton 400, `clamp(1.8rem, 4vw, 2.8rem)`, line-height 1.05, 0.03em): section titles; italicized with a black text-stroke inside section banners.
- **Title** (Anton 400, 0.85–0.95rem, line-height 1.2, 0.02em): card and recent-card titles; uppercase, ellipsis-truncated.
- **Body** (Schibsted Grotesk 400, 1rem, line-height 1.6): hero bio and card descriptions; max ~440px width.
- **Label** (Schibsted Grotesk 700, 0.65–0.85rem, 0.06–0.12em, uppercase): eyebrows, nav links, buttons, tags, stat labels, menu buttons.
- **Script** (Caveat 700, 0.85–1.15rem, line-height 1.3): card subtitles and section accent labels.
- **Mono** (JetBrains Mono 500, 0.6–0.95rem, 0.05–0.15em, uppercase): eyebrows, hero ID code, catalog indices, deco number, menu label, card tags, scroll indicator.

### Named Rules
**The Uppercase Rule.** Anton is only ever set uppercase; lowercase Anton reads broken.

**The Two-Voice Command Rule.** A given surface uses the display voice (Anton) plus at most one expressive secondary voice (Schibsted Grotesk or Caveat) — never all three competing on the same card. The mono system voice is exempt: it labels data and never fights the display voice.

## Layout

Two-column hero: 55% cream left / 45% void right, split by a skewed cream edge (`skewX(-6deg)`); collapses to one column under 1024px. Content columns run to a max-width of 1200px with 2rem side padding.

- **Explore grid:** `repeat(auto-fill, minmax(180px, 1fr))` — six-up at ≥1200px, two-up under 768px, one-up under 480px.
- **Card grid:** `repeat(auto-fill, minmax(190px, 1fr))` — four-up at ≥1200px, two-up below.
- **Recently-added / overview:** two equal columns, collapsing to one under 1024px.
- **Section rhythm:** major sections breathe at 4–5rem vertical padding; category sections at 2rem. Slash-divider rules (a hairline plus a red bar) separate category panels.
- **Card rotations:** a fixed pattern (`-3, 2, -1, 3, -1, 2, -2, 1, …`) gives hand-placed energy without randomness.

**Breakpoints:** 1024px (hero and overview stack), 768px (nav collapses to hamburger, grids go two-up), 480px (explore one-up, hero CTAs stack).

## Elevation & Depth

Hybrid. Interactive elements lift with hard, offset structural shadows; static surfaces sit in tonal layers.

- Cover cards: `6px 6px 0 #000, -4px -4px 0 #D80000`, deepening to `10px 10px 0 #000, -6px -6px 0 #D80000` on hover and pressing to `2px 2px 0 #000, -2px -2px 0 #D80000` on active.
- Explore cards: `4px 4px 0 rgba(0,0,0,0.6)`, deepening to `8px 8px 0 rgba(0,0,0,0.7), -4px -4px 0 var(--red)` on hover.
- ID card: `drop-shadow(4px 4px 0 rgba(0,0,0,0.5))` — the only true drop shadow.
- Overview panel: `6px 6px 0 rgba(0,0,0,0.8)` with a slight skew.
- Static surfaces (footer, recent cards, navbar): tonal layers of charcoal/cream with thin borders at most. The navbar gains a soft ambient shadow (`0 2px 12px rgba(0,0,0,0.15)`) once scrolled.

### Named Rules
**The Hard Shadow Rule.** Interactive elements lift with hard offset shadows, never soft glows. Static surfaces use tonal layering, never hard shadows. Mixing the two vocabularies on one surface is a failure.

**The Lift-On-Respond Rule.** Elevation is a response to state: flat-ish at rest, deeper offset on hover, pressed down on active.

## Shapes

Sharp and angular. Corners are mostly cut by clip-path geometry rather than radius: buttons use a trapezoid cut (`polygon(3% 0%, 100% 0%, 97% 100%, 0% 100%)`), icon tiles and the empty-state icon use a parallelogram (`polygon(5% 0%, 100% 5%, 95% 100%, 0% 95%)`), the ID card is a subtly clipped card (`polygon(2% 0%, 100% 2%, 98% 100%, 0% 97%)`), and section banners are `skewX(-8deg)` parallelograms. The only true radii are the empty state's 4px corner and the theme toggle's 11px pill. Borders are uniformly 3px solid black (2px for smaller elements like recent cards and secondary buttons). Halftone dot textures (6px grids) pattern dark fields and cover cards. Cards and accent labels carry slight rotations (-3° to +3°) for hand-placed energy.

## Components

### Buttons
Sharp and reactive.
- **Shape:** no radius; primary is a trapezoid clip-path cut, secondary is square with a 2px solid Void border.
- **Primary** (`.btn-primary`): Combat Red ground, white label (Inter 700, 0.85rem, 0.06em, uppercase), padding 0.85rem 2rem, 16px inline icon. Hover → Combat Red Deep, translateY(-2px); active → translateY(1px).
- **Secondary** (`.btn-secondary`): transparent ground, 2px solid Void border, Void label; hover inverts to Void ground with white label.

### Chips / Tags
- **Tag** (`.recent-card-tag`, `.hero-id-code`): Combat Red ground, white or red uppercase micro-label (Inter 700, 0.6–0.65rem, 0.08–0.1em), small padding, sits at a card corner or above an ID name.

### Cards / Containers
- **DexCard** (`.dex-card`, shadow-DOM component): 3px solid black border, Charcoal ground, hard two-tone shadow; square 1:1 cover with halftone overlay and skeleton shimmer; 0.7rem info strip with Anton title (cream) and Caveat subtitle (45% cream). Rotated via `--rotation`; hover lifts -8px with scale 1.05, straightens rotation, and flashes a magenta overlay; active presses down. Focus ring is 4px Combat Red.
- **ExploreCard** (`.explore-card`): cream face, 3px solid black border, 4px offset black shadow, rotated -1deg; ghost number, parallelogram icon tile (Void ground), Anton name, Combat Red count, Inter description, arrow that nudges on hover. The "More / Coming Soon" variant is a dashed cream outline on a 5% cream wash.
- **RecentCard** (`.recent-card`): 2px Warm/Steel border on Paper/Charcoal, 16:10 image, Combat Red tag chip; hover lifts -4px with a soft offset.
- **ID Card** (`.hero-id-card`): Charcoal ground, clipped corners, Combat Red top bar, red code chip (`ID: FRD-125`), Anton name, uppercase location, italic quote with a Combat Red left border, oversized "❝" mark.
- **Overview panel** (`.overview-column`): Charcoal ground, 3px black border, hard offset shadow, slight skew; 2×2 stat tiles, each with a Combat Red top bar, Anton numbers, Inter labels.

### Navigation
- 64px sticky bar, transparent at top; once scrolled, gains `--navbar-bg` (cream/void) and a soft shadow. No backdrop blur — the bar is ~95% opaque already and blur is a per-frame scroll cost.
- Wordmark: Anton 1.3rem uppercase with a red "DEX" suffix and a hexagonal logo mark.
- Center links: Inter 700, 0.8rem uppercase, 0.08em; a 3px Combat Red underline scales in on hover/active.
- Right cluster: theme toggle (40×22px pill track, red round thumb sliding 18px) and a clipped Combat Red "MENU" button.
- Under 768px: center links hide, hamburger shows; a full-screen near-black menu (`rgba(0,0,0,0.97)`) with Anton links up to 3.5rem slides in from the right.

### Empty State (`dex-empty-state`, shadow-DOM component)
Charcoal ground, 3px Steel border, 4px radius, halftone wash, Combat Red parallelogram icon tile, Anton message, and a ghost CTA button that inverts on hover. The CTA ("VIEW CATEGORIES") scrolls back to the category overview.

### Dex Search (`.dex-search`)
The catalog lookup, in the terminal voice: a charcoal field with a Combat Red Bright magnifier, JetBrains Mono input, live result count, and a clear control. Filters cards by title/subtitle across every category, hides empty sections and their dividers, and swaps in a "NO RESULTS" panel when nothing matches.

### Detail Modal (`.dex-modal-overlay` / `.dex-modal`)
Opened by clicking a cover card. Charcoal panel, 3px black border, hard two-tone shadow, Combat Red top band, 16:9 spotlight cover with halftone, red mono category tag, Anton title, body subtitle, and a mono metadata grid (Added / Entry). Closes via X, Escape, or backdrop click; traps focus and returns it to the opener; `role="dialog"` + `aria-modal`; respects `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** keep every Anton heading uppercase and pair it with at most one expressive secondary voice (Schibsted Grotesk or Caveat); reserve JetBrains Mono for system data labels.
- **Do** use Combat Red as a stamp — buttons, banners, tags, underlines, stat bars — and leave page grounds to void, cream, and charcoal.
- **Do** lift interactive elements with hard offset shadows (`6px 6px 0 #000, -4px -4px 0 var(--red)`) and deepen the offset on hover.
- **Do** cut corners with clip-path angles and skews; reserve radius for the empty state (4px) and the theme toggle (pill).
- **Do** keep 3px solid black borders on cover cards, banners, and the overview panel; 2px on smaller elements.
- **Do** respect `prefers-reduced-motion`: strip transforms and animations and reveal all content at once.
- **Do** keep red text on void ≥4.5:1: labels that always sit on dark use `--red-on-dark` (Combat Red Bright), never full-strength `--red`.

### Don't:
- **Don't** introduce cyan, magenta, or yellow — the preserved legacy tokens are dormant and must stay unused.
- **Don't** use soft blurred shadows or glow effects; this system's depth is hard-edged or tonal.
- **Don't** set lowercase Anton, or stack all three type voices on one surface.
- **Don't** wash Combat Red across a page background; its rarity is its power.
- **Don't** hand-edit the rendered sections in `index.html`; content comes from `data.json` and rendering is owned by `src/ui.js`.
