import { DataStore } from './store.js';
import './components/DexCard.js';
import './components/DexEmptyState.js';

export const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.11 13.11 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>`,
  steam: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.979 0C5.678 0 .511 4.86.022 10.942l6.432 2.658a3.387 3.387 0 0 1 1.912-.588c.063 0 .125.002.188.006l2.861-4.142V8.77c0-2.427 1.975-4.402 4.402-4.402 2.428 0 4.403 1.975 4.403 4.402 0 2.428-1.975 4.403-4.403 4.403h-.103l-4.077 2.91c0 .05.003.1.003.15 0 1.82-1.48 3.3-3.3 3.3a3.302 3.302 0 0 1-3.263-2.834L.453 14.472A11.98 11.98 0 0 0 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61a2.476 2.476 0 0 0 4.499.607 2.47 2.47 0 0 0-1.109-3.312 2.478 2.478 0 0 0-2.2-.058l1.522.63a1.823 1.823 0 1 1-1.239 2.743zm8.277-5.68a2.938 2.938 0 0 1-2.935-2.935 2.938 2.938 0 0 1 2.935-2.935 2.938 2.938 0 0 1 2.935 2.935 2.938 2.938 0 0 1-2.935 2.935zm-.001-4.894a1.96 1.96 0 0 0-1.958 1.959c0 1.08.878 1.958 1.958 1.958a1.96 1.96 0 0 0 1.959-1.958 1.96 1.96 0 0 0-1.959-1.959z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`
};

export const CATEGORY_ICONS = {
  gamepad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  more: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`,
  bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`
};

export const LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="currentColor" opacity="0.15"/>
  <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="currentColor"/>
</svg>`;

export const FOOTER_WINGS_SVG = `<svg viewBox="0 0 64 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 28L20 16L4 20L0 16L16 8L32 16L48 8L64 16L60 20L44 16L32 28Z" opacity="0.4"/>
  <path d="M32 22L22 14L10 17L8 14L20 8L32 14L44 8L56 14L54 17L42 14L32 22Z"/>
</svg>`;

export const CARD_ROTATIONS = [-3, 2, -1, 3, -1, 2, -2, 1, -2, 2, -1, 2];
export const ENTRANCE_DIRS = ['left', 'right'];
export const NAV_LINKS = [
  { label: 'Home', href: '#hero-section' },
  { label: 'Profile', href: '#hero-id-card-anchor' },
  { label: 'Collection', href: '#explore-categories' },
  { label: 'Journal', href: '#recent-overview' },
  { label: 'About', href: '#site-footer' }
];
export const MAX_CATEGORY_CARDS = 6;


export function esc(str) {
  const el = document.createElement('span');
  el.textContent = str;
  return el.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// Hyperscript-like helper for DOM generation without innerHTML
export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const key in props) {
      if (key === 'className' && props[key]) el.className = props[key];
      else if (key === 'innerHTML') el.innerHTML = props[key];
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

export function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('dex-theme'); } catch (e) { }
  let theme = saved ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  const applyAndSave = () => {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('dex-theme', next); } catch (e) { }
  };

  if (!document.startViewTransition) {
    applyAndSave();
    return;
  }
  document.startViewTransition(() => {
    applyAndSave();
  });
}

// Safe to use innerHTML here (inputs are strictly controlled and escaped).
export function renderNavbar(profile) {
  const navbar = document.getElementById('site-navbar');
  const firstName = esc((profile?.name || 'GUEST').split(' ')[0].toUpperCase());

  navbar.innerHTML = `
    <div class="navbar-left">
      <a href="#hero-section" class="navbar-logo" aria-label="Home">
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
      <button class="theme-toggle" aria-label="Toggle dark/light theme" id="theme-toggle-btn">
        <span class="theme-toggle-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </span>
        <span class="theme-toggle-track">
          <span class="theme-toggle-thumb"></span>
        </span>
      </button>
      <button class="navbar-menu-desktop" id="navbar-menu-desktop-btn" aria-label="Open menu">
        MENU
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <button class="navbar-menu-btn" id="navbar-menu-btn" aria-label="Open mobile menu" aria-expanded="false">
        MENU
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  `;
}

export function renderMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.innerHTML = `
    <button class="mobile-menu-close" id="mobile-menu-close" aria-label="Close menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    ${NAV_LINKS.map(link => `<a href="${link.href}" class="mobile-menu-link">${esc(link.label)}</a>`).join('')}
  `;
}

export function renderHero(profile, socials) {
  const hero = document.getElementById('hero-section');
  let heroImageHTML = profile?.heroImage ? `<img src="${esc(profile.heroImage)}" alt="${esc(profile.name || 'GUEST')} illustration" fetchpriority="high" width="600" height="600">` : `<div class="hero-illustration-placeholder"></div>`;
  const socialRailHTML = (socials || []).map(s => `
    <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)}" title="${esc(s.label)}">
      ${SOCIAL_ICONS[s.platform] || ''}
    </a>
  `).join('<div class="hero-social-divider"></div>');
  const displayName = esc((profile?.name || 'GUEST').split(' ')[0].toUpperCase());

  hero.innerHTML = `
    <div class="hero-left">
      <div class="hero-social-rail">${socialRailHTML}</div>
      <div class="hero-eyebrow">WELCOME</div>
      <h1 class="hero-headline">WELCOME TO<br>MY <span class="hero-headline-accent">PERSONAL</span> DEX</h1>
      <p class="hero-bio">${esc(profile?.tagline || '')}</p>
      <div class="hero-cta-row">
        <button class="btn-primary" data-scroll-to="#explore-categories" aria-label="Explore the Dex collection">
          EXPLORE DEX
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <button class="btn-secondary" data-scroll-to="#hero-id-card-anchor" aria-label="Learn more about me">
          ABOUT ME
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
    </div>
    <div class="hero-right" id="hero-id-card-anchor">
      <div class="hero-illustration">${heroImageHTML}</div>
      <span class="hero-deco-number">01</span>
      <div class="hero-id-card">
        <span class="hero-id-code">ID: FRD-125</span>
        <h2 class="hero-id-name">${displayName}</h2>
        <p class="hero-id-location">${esc(profile?.location || '')}</p>
        <p class="hero-id-quote">"${esc(profile?.quote || '')}"</p>
        <span class="hero-id-quote-marks">❝</span>
      </div>
      <div class="hero-scroll-down" aria-hidden="true">
        <span class="hero-scroll-text">SCROLL DOWN</span>
        <svg class="hero-scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
      </div>
    </div>
  `;
}

export function renderFooter() {
  const footer = document.getElementById('site-footer');
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="footer-inner">
      <span class="footer-left">© ${year} Fradana Dex. All rights reserved.</span>
      <span class="footer-center">${FOOTER_WINGS_SVG}</span>
      <span class="footer-right">BUILT WITH <span class="footer-heart">♥</span> AND PASSION</span>
    </div>
  `;
}

// Stage 3 Dynamic Elements below using native DOM API / DocumentFragment

function createCard(item, index) {
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  const card = document.createElement('dex-card');
  card.className = 'card-will-animate';

  card.setAttribute('title', item.title);
  card.setAttribute('subtitle', item.subtitle || '');
  card.setAttribute('rotation', rotation);
  card.style.setProperty('--delay', `${index * 70}ms`);

  if (item.image) {
    card.setAttribute('image-src', item.image);
  }

  // Bind full item data directly for event delegation access.
  card.itemData = item;

  return card;
}

export function renderCategories(categories) {
  const container = document.getElementById('categories-container');
  const fragment = document.createDocumentFragment();

  categories.forEach((cat, i) => {
    const dir = ENTRANCE_DIRS[i % 2];
    const items = cat.items || [];

    fragment.appendChild(h('div', { className: 'slash-divider' }));

    const section = h('section', {
      className: `category-section panel-enter panel-enter--${dir}`,
      id: `section-${cat.id}`,
      'data-category': cat.id,
      'aria-label': `${cat.title} collection`
    },
      h('div', { className: 'section-header' },
        h('div', { className: 'section-banner' },
          h('h2', { className: 'section-title' }, cat.title)
        ),
        h('span', { className: 'section-accent' }, cat.accentLabel)
      ),
      h('div', { className: 'card-grid' },
        items.length > 0
          ? items.map((item, j) => createCard(item, j))
          : h('dex-empty-state', { 'icon': cat.icon || 'bookmark', 'message': `No ${cat.title?.toLowerCase() || 'items'} added yet.` })
      )
    );
    fragment.appendChild(section);
  });

  container.replaceChildren(fragment);
}

export function renderExploreCategories(categories) {
  const section = document.getElementById('explore-categories');
  const fragment = document.createDocumentFragment();

  // Mobile-only star texture (avoids desktop pseudo-element inheritance bugs).
  const mobileStar = h('div', { className: 'explore-star-mobile', 'aria-hidden': 'true' });
  fragment.appendChild(mobileStar);

  const exploreGrid = h('div', { className: 'explore-grid' });

  categories.forEach((cat, i) => {
    const num = String(i + 1).padStart(2, '0');
    const iconKey = cat.icon || 'bookmark';
    const iconSVG = CATEGORY_ICONS[iconKey] || CATEGORY_ICONS.bookmark;
    const items = cat.items || [];

    const card = h('a', {
      href: `#section-${cat.id}`,
      className: 'explore-card',
      'aria-label': `${cat.title} — ${items.length} items`
    },
      h('span', { className: 'explore-card-number' }, num),
      h('span', { className: 'explore-card-icon', innerHTML: iconSVG }),
      h('h3', { className: 'explore-card-name' }, cat.title),
      h('span', { className: 'explore-card-count' }, `${items.length} Items`),
      h('p', { className: 'explore-card-desc' }, cat.description || ''),
      h('svg', { className: 'explore-card-arrow', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', innerHTML: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' })
    );
    exploreGrid.appendChild(card);
  });

  if (categories.length < MAX_CATEGORY_CARDS) {
    const moreNum = String(categories.length + 1).padStart(2, '0');
    exploreGrid.appendChild(
      h('div', { className: 'explore-card explore-card--more', 'aria-label': 'More categories coming soon' },
        h('span', { className: 'explore-card-number' }, moreNum),
        h('span', { className: 'explore-card-icon', innerHTML: CATEGORY_ICONS.more }),
        h('h3', { className: 'explore-card-name' }, 'MORE'),
        h('span', { className: 'explore-card-count' }, 'Coming Soon'),
        h('p', { className: 'explore-card-desc' }, 'More categories coming soon.'),
        h('svg', { className: 'explore-card-arrow', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', innerHTML: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' })
      )
    );
  }

  const header = h('div', { className: 'explore-header' },
    h('div', { className: 'explore-header-left' },
      h('span', { className: 'section-eyebrow' }, 'DEX COLLECTION'),
      h('h2', { className: 'explore-heading' }, 'EXPLORE CATEGORIES')
    ),
    h('a', { href: '#categories-container', className: 'view-all-link' },
      'VIEW ALL',
      h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', innerHTML: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' })
    )
  );

  fragment.appendChild(header);
  fragment.appendChild(exploreGrid);
  section.replaceChildren(fragment);
}

export function renderRecentlyAdded(categories) {
  const section = document.getElementById('recent-overview');
  const fragment = document.createDocumentFragment();

  const recentItems = DataStore.getRecentItems(4) || [];
  const recentCardsRow = h('div', { className: 'recent-cards-row' });
  recentItems.forEach(item => {
    const dateStr = item.dateAdded
      ? new Date(item.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    const tagLabel = (item.categoryTitle || 'Unknown').split(' ')[0];

    let imageHTML;
    if (item.image) {
      imageHTML = h('img', { src: item.image, alt: item.title || 'Unknown', loading: 'lazy', width: "120", height: "120" });
    } else {
      imageHTML = h('div', { className: 'recent-card-image-placeholder' }, h('span', {}, (item.title || '?').charAt(0)));
    }

    // ACCESSIBILITY: Changed to semantic <button> instead of article
    const card = h('button', { className: 'recent-card', 'aria-label': `${item.title || 'Unknown'}, ${tagLabel}, added on ${dateStr}` },
      h('div', { className: 'recent-card-image' },
        imageHTML,
        h('span', { className: 'recent-card-tag' }, tagLabel)
      ),
      h('div', { className: 'recent-card-body' },
        h('h3', { className: 'recent-card-title' }, item.title || 'Unknown'),
        h('p', { className: 'recent-card-meta' }, `${item.subtitle || ''} · ${dateStr}`)
      )
    );
    recentCardsRow.appendChild(card);
  });

  const recentColumn = h('div', { className: 'recent-column' },
    h('div', { className: 'recent-header' },
      h('div', { className: 'recent-header-left' },
        h('span', { className: 'section-eyebrow' }, 'RECENT ENTRIES'),
        h('h2', { className: 'recent-heading' }, 'RECENTLY ADDED')
      ),
      h('a', { href: '#categories-container', className: 'view-all-link', style: 'color: var(--color-text);' },
        'VIEW ALL',
        h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', innerHTML: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>' })
      )
    ),
    recentCardsRow
  );

  fragment.appendChild(recentColumn);
  fragment.appendChild(buildDexOverview(categories));
  section.replaceChildren(fragment);
}

function buildDexOverview(categories) {
  const totalEntries = categories.reduce((sum, cat) => sum + (cat.items || []).length, 0);
  let earliestYear = new Date().getFullYear();
  categories.forEach(cat => {
    (cat.items || []).forEach(item => {
      if (item.dateAdded) {
        const year = new Date(item.dateAdded).getFullYear();
        if (year < earliestYear) earliestYear = year;
      }
    });
  });

  return h('div', { className: 'overview-column' },
    h('div', { className: 'overview-header' },
      h('span', { className: 'section-eyebrow', style: 'color: var(--red);' }, 'AT A GLANCE'),
      h('h2', { className: 'overview-heading' }, 'DEX OVERVIEW')
    ),
    h('div', { className: 'overview-grid' },
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' }), h('span', { className: 'overview-stat-number' }, totalEntries), h('span', { className: 'overview-stat-label' }, 'Total Entries')),
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' }), h('span', { className: 'overview-stat-number' }, earliestYear), h('span', { className: 'overview-stat-label' }, 'Since')),
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' }), h('span', { className: 'overview-stat-number' }, 'Sometimes'), h('span', { className: 'overview-stat-label' }, 'Updates')),
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' }), h('span', { className: 'overview-stat-number' }, '100%'), h('span', { className: 'overview-stat-label' }, 'Personal'))
    )
  );
}
