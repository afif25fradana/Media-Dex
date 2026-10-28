import './components/DexCard.js';
import './components/DexEmptyState.js';
import { encodeAssetPath, esc, sanitizeUrl, sortItemsByDate } from './utils.js';
import { reobserveCards } from './animations.js';
import { prefersReducedMotion } from './motion.js';

import {
  SOCIAL_ICONS,

  LOGO_SVG,
  FOOTER_WINGS_SVG,
  CLOSE_ICON_SVG,
  MENU_ICON_SVG
} from './icons.js';

export const CARD_ROTATIONS = [-3, 2, -1, 3, -1, 2, -2, 1, -2, 2, -1, 2];
export const NAV_LINKS = [
  { label: 'Home', href: '#hero-section' },
  { label: 'Last.fm', href: '#lastfm-section' },
  { label: 'Collection', href: '#collection-section' },
  { label: 'Recently Added', href: '#recent-overview' },
  { label: 'About', href: '#dex-overview' }
];

// Hyperscript-like helper for DOM generation (restricts raw markup strictly to static SVG nodes)
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const key in props) {
      if (key === 'className' && props[key]) el.className = props[key];
      else if (key === 'svgMarkup' && typeof props[key] === 'string') el.innerHTML = props[key];
      else if (key === 'textContent') el.textContent = props[key];
      else if (key === 'style' && typeof props[key] === 'string') el.style.cssText = props[key];
      else if (props[key] !== undefined && props[key] !== null) el.setAttribute(key, props[key]);
    }
  }
  const append = (child) => {
    if (child == null) return;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(append);
    }
  };
  children.forEach(append);
  return el;
}

// Safe to use innerHTML here (inputs are strictly controlled and escaped).
export function renderNavbar(profile) {
  const navbar = document.getElementById('site-navbar');
  const firstName = esc((profile?.name || 'GUEST').split(' ')[0].toUpperCase());

  navbar.innerHTML = `
    <div class="navbar-left">
      <a href="#hero-section" class="navbar-logo" aria-label="${firstName}DEX: Home">
        ${LOGO_SVG}
        <span class="navbar-wordmark">${firstName}<span class="navbar-wordmark-accent">DEX</span></span>
      </a>
    </div>
    <div class="navbar-center">
      ${NAV_LINKS.map((link, i) => `
        <a href="${link.href}" class="navbar-link${i === 0 ? ' active' : ''}"
           data-nav-index="${i}">${esc(link.label)}</a>
      `).join('')}
    </div>
    <div class="navbar-right">
      <button class="navbar-menu-desktop" id="navbar-menu-desktop-btn" aria-label="MENU: Open navigation menu" aria-expanded="false">
        MENU
        ${MENU_ICON_SVG}
      </button>
      <button class="navbar-menu-btn" id="navbar-menu-btn" aria-label="MENU: Open mobile navigation menu" aria-expanded="false">
        MENU
        ${MENU_ICON_SVG}
      </button>
    </div>
  `;
}

export function renderMobileMenu(categories) {
  const menu = document.getElementById('mobile-menu');
  const cats = categories || [];
  menu.innerHTML = `
    <button class="mobile-menu-close" id="mobile-menu-close" aria-label="Close menu">
      ${CLOSE_ICON_SVG}
    </button>
    ${NAV_LINKS.map(link => `<a href="${link.href}" class="mobile-menu-link">${esc(link.label)}</a>`).join('')}
    ${cats.length ? `
      <div class="mobile-menu-cats" role="group" aria-label="Jump to a category">
        <span class="mobile-menu-cats-label">JUMP TO CATEGORY</span>
        ${cats.map(cat => `<a href="#collection-section" class="mobile-menu-cat" data-cat="${esc(cat.id)}">${esc(cat.title)}</a>`).join('')}
      </div>
    ` : ''}
  `;

  menu.querySelectorAll('.mobile-menu-cat').forEach(link => {
    link.addEventListener('click', () => {
      const catId = link.getAttribute('data-cat');
      if (catId) {
        switchCategory(catId);
      }
    });
  });
}

export function renderHero(profile, socials) {
  const hero = document.getElementById('hero-section');
  let heroImageHTML = profile?.heroImage ? `<img src="${esc(encodeAssetPath(profile.heroImage))}" alt="${esc(profile.name || 'GUEST')} illustration" fetchpriority="high" width="600" height="600">` : `<div class="hero-illustration-placeholder"></div>`;
  const socialRailHTML = (socials || []).map(s => `
    <a href="${esc(sanitizeUrl(s.url))}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)}" title="${esc(s.label)}">
      ${SOCIAL_ICONS[s.platform] || ''}
    </a>
  `).join('<div class="hero-social-divider"></div>');
  const displayName = esc((profile?.name || 'GUEST').split(' ')[0].toUpperCase());

  hero.innerHTML = `
    <div class="hero-left">
      <div class="hero-social-rail">${socialRailHTML}</div>
      <div class="hero-eyebrow">MEDIA COLLECTION</div>
      <h1 class="hero-headline">WELCOME TO<br>MY <span class="hero-headline-accent">PERSONAL</span> DEX</h1>
      <p class="hero-bio">${esc(profile?.tagline || '')}</p>
      <div class="hero-cta-row">
        <button class="btn-primary" data-scroll-to="#collection-section" aria-label="EXPLORE DEX: Browse collection">
          EXPLORE DEX
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <button class="btn-secondary" data-scroll-to="#dex-overview" aria-label="OVERVIEW: View collection metrics">
          OVERVIEW
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
    </div>
    <div class="hero-right" id="hero-id-card-anchor">
      <div class="hero-illustration">${heroImageHTML}</div>
      <span class="hero-deco-number">01</span>
      <div class="hero-id-card">
        <span class="hero-id-code">ID: FRD-125</span>
        <p class="hero-id-name">${displayName}</p>
        <p class="hero-id-location">${esc(profile?.location || '')}</p>
        <p class="hero-id-quote">"${esc(profile?.quote || '')}"</p>
        <span class="hero-id-quote-marks" aria-hidden="true">❝</span>
      </div>
      <a class="hero-scroll-down" href="#lastfm-section" aria-label="Scroll down to Last.fm section">
        <span class="hero-scroll-text">SCROLL DOWN</span>
        <svg class="hero-scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
      </a>
    </div>
  `;
}

export function createCard(item, index, cat) {
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];
  const card = document.createElement('dex-card');

  card.className = 'card-will-animate';
  card.setAttribute('title', item.title || '');
  card.setAttribute('subtitle', item.subtitle || '');
  card.setAttribute('rotation', `${rotation}deg`);
  card.setAttribute('category', cat?.id || item.categoryId || '');
  card.style.setProperty('--delay', `${index * 50}ms`);

  if (item.image) {
    card.setAttribute('image-src', item.image);
  }

  // Bind full item data (enriched with category) directly for event delegation + detail modal.
  card.itemData = {
    ...item,
    categoryTitle: cat?.title || item.categoryTitle || '',
    categoryId: cat?.id || item.categoryId || ''
  };

  return card;
}

/* ==========================================================================
   UNIFIED COLLECTION STATE & ORCHESTRATION
   ========================================================================== */

let allItems = [];
let allCategories = [];
let activeCategory = 'games';
let sortDirection = 'desc';
let switchTimeoutId = null;

export function renderCollection(categories) {
  allCategories = categories || [];
  allItems = [];
  activeCategory = allCategories[0]?.id || 'games';

  allCategories.forEach(cat => {
    (cat.items || []).forEach(it => {
      allItems.push({
        ...it,
        categoryId: cat.id,
        categoryTitle: cat.title
      });
    });
  });

  const tabsContainer = document.getElementById('categoryTabs');
  if (tabsContainer) {
    let tabsHTML = '';

    allCategories.forEach((cat, index) => {
      const count = (cat.items || []).length;
      const isInitial = index === 0;
      tabsHTML += `
        <button type="button" class="cat-tab${isInitial ? ' is-active' : ''}" id="tab-${esc(cat.id)}" role="tab" data-cat="${esc(cat.id)}" aria-selected="${isInitial ? 'true' : 'false'}" aria-controls="dexCardGrid" tabindex="${isInitial ? '0' : '-1'}">
          <span class="tab-label">${esc(cat.title)}</span>
          <span class="tab-count">${count}</span>
        </button>
      `;
    });

    tabsContainer.innerHTML = tabsHTML;

    // Attach click listeners
    tabsContainer.querySelectorAll('.cat-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchCategory(tab.dataset.cat || (allCategories[0]?.id || 'games'));
      });
    });

    // Attach W3C APG roving tabindex keyboard navigation
    tabsContainer.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabsContainer.querySelectorAll('.cat-tab'));
      const currentIndex = tabs.findIndex(t => t.dataset.cat === activeCategory);
      let nextIndex = -1;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = tabs.length - 1;
      }

      if (nextIndex >= 0 && tabs[nextIndex]) {
        const nextTab = tabs[nextIndex];
        switchCategory(nextTab.dataset.cat || (allCategories[0]?.id || 'games'));
        nextTab.focus();
      }
    });
  }

  // Setup sort toggle button
  const sortBtn = document.getElementById('sortToggleBtn');
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      const isAsc = sortDirection === 'asc';
      sortBtn.classList.toggle('is-asc', isAsc);
      sortBtn.setAttribute('aria-pressed', isAsc ? 'true' : 'false');
      sortBtn.setAttribute('aria-label', `Sort by date added: currently ${isAsc ? 'oldest' : 'newest'} first`);

      const labelEl = sortBtn.querySelector('.sort-label');
      if (labelEl) labelEl.textContent = isAsc ? 'DATE: OLDEST' : 'DATE: NEWEST';

      filterAndRenderCards(false);
    });
  }

  filterAndRenderCards(true);
}

export function switchCategory(catId) {
  activeCategory = catId || (allCategories[0]?.id || 'games');

  const tabsContainer = document.getElementById('categoryTabs');
  if (tabsContainer) {
    tabsContainer.querySelectorAll('.cat-tab').forEach(t => {
      const isMatch = (t.dataset.cat || '') === activeCategory;
      t.classList.toggle('is-active', isMatch);
      t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      t.setAttribute('tabindex', isMatch ? '0' : '-1');
    });
  }

  const grid = document.getElementById('dexCardGrid');
  if (grid) {
    grid.setAttribute('aria-labelledby', `tab-${activeCategory}`);
  }

  filterAndRenderCards(false);
}

export function filterAndRenderCards(isInitial = false) {
  const grid = document.getElementById('dexCardGrid');
  if (!grid) return;

  const filtered = allItems.filter(item => {
    return item.categoryId === activeCategory;
  });

  const sorted = sortItemsByDate(filtered, sortDirection);

  // Update screen reader live announcer
  const announcer = document.getElementById('collection-live-announcer');
  if (announcer) {
    const activeCatObj = allCategories.find(c => c.id === activeCategory);
    const catName = activeCatObj?.title || activeCategory;
    const dirName = sortDirection === 'desc' ? 'newest first' : 'oldest first';
    announcer.textContent = `Showing ${sorted.length} entries for ${catName}, sorted ${dirName}.`;
  }

  const renderContent = () => {
    grid.replaceChildren();

    if (sorted.length === 0) {
      const emptyState = document.createElement('dex-empty-state');
      emptyState.setAttribute('icon', 'bookmark');
      emptyState.setAttribute('message', 'No items in this category yet.');
      emptyState.setAttribute('action-text', 'VIEW FIRST CATEGORY');
      emptyState.addEventListener('action-click', () => switchCategory(allCategories[0]?.id || 'games'));
      grid.appendChild(emptyState);
    } else {
      const fragment = document.createDocumentFragment();
      sorted.forEach((item, i) => {
        const cat = allCategories.find(c => c.id === item.categoryId);
        fragment.appendChild(createCard(item, i, cat));
      });
      grid.appendChild(fragment);
    }

    reobserveCards();
  };

  if (switchTimeoutId !== null) {
    clearTimeout(switchTimeoutId);
    switchTimeoutId = null;
  }

  if (isInitial || prefersReducedMotion()) {
    grid.classList.remove('is-switching');
    renderContent();
  } else {
    grid.classList.add('is-switching');
    switchTimeoutId = setTimeout(() => {
      switchTimeoutId = null;
      renderContent();
      grid.classList.remove('is-switching');
    }, 120);
  }
}



/* ==========================================================================
   RECENTLY ADDED & STATS
   ========================================================================== */

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC'
});

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
});

export function renderRecentlyAdded(categories, profile) {
  const section = document.getElementById('recent-overview');
  if (!section) return;
  const fragment = document.createDocumentFragment();

  const recentItems = (() => {
    const list = [];
    (categories || []).forEach(cat => {
      (cat.items || []).forEach(item => {
        list.push({ ...item, categoryTitle: cat.title, categoryId: cat.id });
      });
    });
    return sortItemsByDate(list, 'desc').slice(0, 4);
  })();

  const recentCardsRow = h('div', { className: 'recent-cards-row' });
  recentItems.forEach(item => {
    const d = item.dateAdded ? new Date(item.dateAdded) : null;
    const dateStr = d && !Number.isNaN(d.getTime())
      ? shortDateFormatter.format(d)
      : '';
    const tagLabel = (item.categoryTitle || 'Unknown').split(' ')[0];

    let imageHTML;
    if (item.image) {
      imageHTML = h('img', { src: encodeAssetPath(item.image), alt: '', loading: 'lazy', width: "120", height: "120" });
    } else {
      imageHTML = h('div', { className: 'recent-card-image-placeholder', 'aria-hidden': 'true' }, h('span', {}, (item.title || '?').charAt(0)));
    }

    const card = h('button', {
      type: 'button',
      className: 'recent-card',
      'data-category': item.categoryId || '',
      'aria-label': `${item.title || 'Unknown'}${item.subtitle ? ', ' + item.subtitle : ''} (${tagLabel})`
    },
      h('div', { className: 'recent-card-image' },
        imageHTML,
        h('span', { className: 'recent-card-tag' }, tagLabel)
      ),
      h('div', { className: 'recent-card-body' },
        h('span', { className: 'recent-card-title' }, item.title || 'Unknown'),
        item.subtitle ? h('span', { className: 'recent-card-sub' }, item.subtitle) : null,
        dateStr ? h('span', { className: 'recent-card-date' }, dateStr) : null
      )
    );
    card.itemData = item;
    recentCardsRow.appendChild(card);
  });

  const recentColumn = h('div', { className: 'recent-column' },
    h('div', { className: 'recent-header' },
      h('div', { className: 'recent-header-left' },
        h('h2', { className: 'recent-heading' }, 'RECENTLY ADDED')
      ),
      h('a', { href: '#collection-section', className: 'view-all-link', 'aria-label': 'VIEW ALL: View collection' },
        'VIEW ALL',
        h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', svgMarkup: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' })
      )
    ),
    recentCardsRow
  );

  fragment.appendChild(recentColumn);
  fragment.appendChild(buildDexOverview(categories, profile));
  section.replaceChildren(fragment);
}

function buildDexOverview(categories, profile) {
  const totalEntries = (categories || []).reduce((sum, cat) => sum + (cat.items || []).length, 0);
  const categoryCount = (categories || []).length;

  const allItemsList = (categories || []).flatMap(cat => (cat.items || []).map(item => ({ ...item, categoryId: cat.id, categoryTitle: cat.title })));
  const sorted = sortItemsByDate(allItemsList, 'desc');
  const latestDate = sorted[0]?.dateAdded ? new Date(sorted[0].dateAdded) : null;
  const latestDateStr = latestDate && !Number.isNaN(latestDate.getTime())
    ? monthYearFormatter.format(latestDate).toUpperCase()
    : 'AUG 2026';
  const curatorLocation = (profile?.location || 'SOLO, ID').toUpperCase();

  return h('div', { className: 'overview-column', id: 'dex-overview' },
    h('div', { className: 'overview-header' },
      h('h2', { className: 'overview-heading' }, 'DEX OVERVIEW')
    ),
    h('div', { className: 'overview-grid' },
      h('div', { className: 'overview-stat' },
        h('div', { className: 'overview-stat-icon', svgMarkup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' }),
        h('span', { className: 'overview-stat-number' }, totalEntries),
        h('span', { className: 'overview-stat-label' }, 'TOTAL ENTRIES')
      ),
      h('div', { className: 'overview-stat' },
        h('div', { className: 'overview-stat-icon', svgMarkup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' }),
        h('span', { className: 'overview-stat-number' }, categoryCount),
        h('span', { className: 'overview-stat-label' }, 'CATEGORIES')
      ),
      h('div', { className: 'overview-stat' },
        h('div', { className: 'overview-stat-icon', svgMarkup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' }),
        h('span', { className: 'overview-stat-number' }, latestDateStr),
        h('span', { className: 'overview-stat-label' }, 'LATEST ADDED')
      ),
      h('div', { className: 'overview-stat' },
        h('div', { className: 'overview-stat-icon', svgMarkup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' }),
        h('span', { className: 'overview-stat-number' }, curatorLocation),
        h('span', { className: 'overview-stat-label' }, 'LOCATION')
      )
    )
  );
}

export function renderLastFmSection(profile, lastfmConfig) {
  const section = document.getElementById('lastfm-section');
  if (!section) return;

  const username = lastfmConfig?.username || 'oxanara';

  section.innerHTML = `
    <div class="lastfm-section-header">
      <div class="lastfm-section-banner">
        <h2 class="lastfm-section-title">LAST.FM DEX</h2>
      </div>
      <span class="lastfm-section-accent">LIVE STATS // 33 1/3 RPM</span>
    </div>

    <div class="lastfm-bento-grid">
      <div class="lastfm-player-card">
        <div class="lastfm-card-eyebrow-row">
          <span class="lastfm-card-eyebrow">// NOW PLAYING</span>
          <span id="lastfmStatusBadge" class="lastfm-badge">STANDBY</span>
        </div>
        <div class="lastfm-stage-container">
          <div class="lastfm-stage" role="button" tabindex="0" aria-label="Open current track on Last.fm" title="Click to open track on Last.fm">
            <svg class="vinyl-svg" viewBox="0 0 320 320" shape-rendering="geometricPrecision" role="img" aria-label="Persona 5 Hi-Fi Vinyl Turntable">
            <defs>
              <radialGradient id="lastfmVinylFace" cx="36%" cy="30%" r="72%">
                <stop offset="0%" stop-color="#24242A"/>
                <stop offset="60%" stop-color="#121214"/>
                <stop offset="100%" stop-color="#050505"/>
              </radialGradient>
              <radialGradient id="lastfmRecordSheen" cx="35%" cy="28%" r="65%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.12"/>
                <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.02"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
              </radialGradient>
              <linearGradient id="lastfmPlinthGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#202026"/>
                <stop offset="100%" stop-color="#0A0A0C"/>
              </linearGradient>
              <linearGradient id="lastfmMetalShine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#E8E8E8"/>
                <stop offset="50%" stop-color="#999999"/>
                <stop offset="100%" stop-color="#555555"/>
              </linearGradient>
              <clipPath id="lastfmLabelClip">
                <circle cx="150" cy="160" r="46"/>
              </clipPath>
              <clipPath id="lastfmPlinthClip">
                <rect x="8" y="8" width="304" height="304" rx="8"/>
              </clipPath>
            </defs>

            <rect x="12" y="16" width="300" height="300" rx="8" fill="#000000" opacity="0.8"/>
            <rect x="8" y="8" width="304" height="304" rx="8" fill="url(#lastfmPlinthGrad)"/>
            <rect x="10" y="10" width="300" height="300" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>

            <g clip-path="url(#lastfmPlinthClip)">
              <polygon points="8,8 70,8 8,70" fill="#D80000"/>
              <polygon points="76,8 90,8 8,90 8,76" fill="#000000" opacity="0.6"/>
              <line x1="8" y1="18" x2="294" y2="18" stroke="#D80000" stroke-width="1.5" stroke-dasharray="12 6" opacity="0.4"/>
            </g>

            <rect x="8" y="8" width="304" height="304" rx="8" fill="none" stroke="#D80000" stroke-width="2.5"/>

            <circle cx="150" cy="160" r="126" fill="#08080A" stroke="#222222" stroke-width="2"/>
            <circle cx="150" cy="160" r="122" fill="#D80000"/>
            <circle cx="150" cy="160" r="118" fill="none" stroke="#000000" stroke-width="2" opacity="0.4"/>
            <circle cx="150" cy="160" r="70" fill="none" stroke="#CC0000" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>

            <g id="lastfmRecordGroup" class="vinyl-disc">
              <circle cx="150" cy="160" r="115" fill="url(#lastfmVinylFace)"/>
              <circle cx="150" cy="160" r="115" fill="url(#lastfmRecordSheen)"/>

              <circle cx="150" cy="160" r="110" fill="none" stroke="#000000" stroke-width="0.8" opacity="0.6"/>
              <circle cx="150" cy="160" r="105" fill="none" stroke="#2A2A30" stroke-width="0.6" opacity="0.4"/>
              <circle cx="150" cy="160" r="100" fill="none" stroke="#000000" stroke-width="0.8" opacity="0.6"/>
              <circle cx="150" cy="160" r="95" fill="none" stroke="#2A2A30" stroke-width="0.6" opacity="0.4"/>
              <circle cx="150" cy="160" r="90" fill="none" stroke="#000000" stroke-width="0.8" opacity="0.6"/>
              <circle cx="150" cy="160" r="85" fill="none" stroke="#2A2A30" stroke-width="0.6" opacity="0.4"/>
              <circle cx="150" cy="160" r="80" fill="none" stroke="#000000" stroke-width="0.8" opacity="0.6"/>
              <circle cx="150" cy="160" r="75" fill="none" stroke="#2A2A30" stroke-width="0.6" opacity="0.4"/>
              <circle cx="150" cy="160" r="65" fill="none" stroke="#000000" stroke-width="0.8" opacity="0.6"/>
              <circle cx="150" cy="160" r="56" fill="none" stroke="#2A2A30" stroke-width="0.6" opacity="0.4"/>

              <path d="M150,160 m-104,0 a104,104 0 0 1 52,-90" fill="none" stroke="#D80000" stroke-width="6" opacity="0.2" stroke-linecap="round"/>
              <path d="M150,160 m104,0 a104,104 0 0 1 -52,90" fill="none" stroke="#FFFFFF" stroke-width="4" opacity="0.08" stroke-linecap="round"/>

              <circle cx="150" cy="160" r="48" fill="#0C0C0C" stroke="#D80000" stroke-width="2"/>
              <circle cx="150" cy="160" r="46" fill="#1A1A20"/>
              <text x="150" y="148" text-anchor="middle" font-family="'Anton', Impact, sans-serif" font-size="10" fill="#FF3333" letter-spacing="1">MEDIA-DEX</text>
              <text x="150" y="172" text-anchor="middle" font-family="'JetBrains Mono', Consolas, monospace" font-size="6" fill="#FFFFFF" opacity="0.6">HI-FI STEREO</text>

              <image id="lastfmVinylArt" x="104" y="114" width="92" height="92" clip-path="url(#lastfmLabelClip)" preserveAspectRatio="xMidYMid slice" href=""/>

              <circle cx="150" cy="160" r="46" fill="none" stroke="#000000" stroke-width="2" opacity="0.6"/>
              <circle cx="150" cy="160" r="6" fill="#0C0C0C" stroke="#D80000" stroke-width="1"/>
              <circle cx="150" cy="160" r="2.5" fill="url(#lastfmMetalShine)"/>
            </g>

            <g id="lastfmTonearmGroup">
              <!-- Arm Rest Post (Right Gutter) -->
              <rect x="277" y="176" width="8" height="18" rx="2" fill="#141418" stroke="#000000" stroke-width="1.5"/>
              <rect x="275" y="180" width="12" height="3" rx="1" fill="#D80000"/>

              <!-- Gimbal Base Rings -->
              <circle cx="276" cy="48" r="16" fill="#000000" opacity="0.6"/>
              <circle cx="276" cy="48" r="14" fill="#1A1A20" stroke="#000000" stroke-width="2"/>
              <circle cx="276" cy="48" r="11" fill="none" stroke="#D80000" stroke-width="1.5"/>

              <!-- Rotating Tonearm Assembly -->
              <g id="lastfmTonearm" class="vinyl-tonearm" filter="drop-shadow(3px 8px 4px rgba(0,0,0,0.85))">
                <line x1="276" y1="48" x2="276" y2="190" stroke="#EAEAEA" stroke-width="4.5" stroke-linecap="round"/>
                <line x1="274.8" y1="50" x2="274.8" y2="186" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>
                <rect x="268" y="184" width="16" height="20" rx="3" fill="#D80000" stroke="#000000" stroke-width="1.5"/>
                <rect x="271" y="188" width="10" height="7" rx="1" fill="#0C0C0C"/>
                <circle cx="276" cy="191" r="2" fill="#D80000"/>
                <polygon points="273,204 279,204 276,212" fill="#FFFFFF"/>
              </g>

              <!-- Gimbal Center Bearing Cap (Locks Arm Visually at 276, 48) -->
              <circle cx="276" cy="48" r="6" fill="#0C0C0C" stroke="#000000" stroke-width="1"/>
              <circle cx="276" cy="48" r="4" fill="#D80000"/>
              <circle cx="276" cy="48" r="1.5" fill="#FFFFFF"/>
            </g>

            <circle id="lastfmPowerLed" cx="290" cy="292" r="3.5" fill="#D80000" stroke="#000000" stroke-width="1"/>
            <text x="24" y="296" font-size="8" font-family="'JetBrains Mono', Consolas, monospace" font-weight="700" fill="#FF3333" letter-spacing="1">33 1/3 RPM // STEREO AUDIO</text>
            </svg>
          </div>
        </div>
        <div class="lastfm-track-info-block">
          <h3 id="lastfmTrackTitle" class="lastfm-track-title">SCANNING FREQUENCY...</h3>
          <div id="lastfmTrackMeta" class="lastfm-track-meta">
            <div class="lastfm-meta-row"><span class="lastfm-meta-label">ARTIST //</span> <span id="lastfmTrackArtist" class="lastfm-meta-val">STANDBY</span></div>
            <div class="lastfm-meta-row"><span class="lastfm-meta-label">ALBUM //</span> <span id="lastfmTrackAlbum" class="lastfm-meta-val">STANDBY</span></div>
            <div class="lastfm-meta-row"><span id="lastfmTimeLabel" class="lastfm-meta-label">STATUS //</span> <span id="lastfmTrackTime" class="lastfm-meta-val">STANDBY</span></div>
          </div>
          <div class="lastfm-monitor-footer">
            <div class="lastfm-eq" aria-hidden="true">
              <span></span><span></span><span></span><span></span>
            </div>
            <div class="lastfm-actions">
              <a id="lastfmTrackLink" href="#" target="_blank" rel="noopener noreferrer" class="lastfm-btn lastfm-btn-secondary">TRACK ↗</a>
              <a id="lastfmProfileLink" href="https://www.last.fm/user/${esc(username)}" target="_blank" rel="noopener noreferrer" class="btn-primary lastfm-btn">PROFILE ↗</a>
            </div>
          </div>
        </div>
      </div>

      <div class="lastfm-dossier-card">
        <div class="lastfm-card-eyebrow-row">
          <span class="lastfm-card-eyebrow">// LISTENING STATS</span>
          <span id="lastfmMonthlyScrobbles" class="lastfm-scrobbles-chip">LIFETIME // 0 SCROBBLES</span>
        </div>
        <div class="lastfm-dossier-header">
          <h3 class="lastfm-dossier-heading">30-DAY STATS</h3>
          <span class="lastfm-dossier-subtitle">TOP ROTATION</span>
        </div>
        <div class="lastfm-stats-trio">
          <div class="lastfm-stat-box">
            <span class="lastfm-stat-val" id="lastfmTotalScrobblesVal">--</span>
            <span class="lastfm-stat-label">30D SCROBBLES</span>
          </div>
          <div class="lastfm-stat-box">
            <span class="lastfm-stat-val" id="lastfmMonthlyArtistsVal">--</span>
            <span class="lastfm-stat-label">UNIQUE ARTISTS</span>
          </div>
          <div class="lastfm-stat-box">
            <span class="lastfm-stat-val" id="lastfmMonthlyTracksVal">--</span>
            <span class="lastfm-stat-label">UNIQUE TRACKS</span>
          </div>
        </div>
        <div class="lastfm-rotation-columns">
          <div class="lastfm-rotation-col">
            <div class="lastfm-col-title">// TOP ARTISTS</div>
            <div id="lastfmTopArtistsList" class="lastfm-rank-list">
              <div class="lastfm-rank-item skeleton">LOADING ARCHIVE...</div>
            </div>
          </div>
          <div class="lastfm-rotation-col">
            <div class="lastfm-col-title">// TOP TRACKS</div>
            <div id="lastfmTopTracksList" class="lastfm-rank-list">
              <div class="lastfm-rank-item skeleton">LOADING ARCHIVE...</div>
            </div>
          </div>
        </div>
        <div class="lastfm-dossier-footer">
          <a href="https://www.last.fm/user/${esc(username)}/library" target="_blank" rel="noopener noreferrer" class="lastfm-dossier-link">OPEN FULL ARCHIVE ↗</a>
        </div>
      </div>
    </div>
  `;
}


export function renderFooter(profile, socials) {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const year = new Date().getFullYear();
  const ownerName = esc((profile?.name || 'GUEST').toUpperCase());
  footer.innerHTML = `
    <div class="footer-inner">
      <span class="footer-left">© ${year} ${ownerName} DEX // ALL RIGHTS RESERVED</span>
      <span class="footer-center">${FOOTER_WINGS_SVG}</span>
      <div class="footer-right-group">
        <span class="footer-archive-tag">PERSONAL MEDIA ARCHIVE</span>
        <a class="footer-top-link" href="#hero-section" aria-label="Back to top">BACK TO TOP ↑</a>
      </div>
    </div>
  `;
}
