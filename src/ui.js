import './components/DexCard.js';
import './components/DexEmptyState.js';

export const SOCIAL_ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>`,
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

export const CLOSE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

export const MENU_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

export const CARD_ROTATIONS = [-3, 2, -1, 3, -1, 2, -2, 1, -2, 2, -1, 2];
export const ENTRANCE_DIRS = ['left', 'right'];
export const NAV_LINKS = [
  { label: 'Home', href: '#hero-section' },
  { label: 'Collection', href: '#explore-categories' },
  { label: 'Recently Added', href: '#recent-overview' },
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
  applyThemeMeta(theme);
}

function applyThemeMeta(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0C0C0C' : '#F0ECE2');
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';

  const applyAndSave = () => {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('dex-theme', next); } catch (e) { }
    applyThemeMeta(next);
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
        ${MENU_ICON_SVG}
      </button>
      <button class="navbar-menu-btn" id="navbar-menu-btn" aria-label="Open mobile menu" aria-expanded="false">
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
        ${cats.map(cat => `<a href="#section-${esc(cat.id)}" class="mobile-menu-cat">${esc(cat.title)}</a>`).join('')}
      </div>
    ` : ''}
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
        <button class="btn-secondary" data-scroll-to="#dex-overview" aria-label="Learn more about me">
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

export function renderFooter(profile, socials) {
  const footer = document.getElementById('site-footer');
  const year = new Date().getFullYear();
  const ownerName = profile?.name || 'GUEST';
  const socialsHTML = (socials || []).map(s => `
    <a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label)}" title="${esc(s.label)}" class="footer-social">
      ${SOCIAL_ICONS[s.platform] || ''}
    </a>
  `).join('');
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <span class="footer-left">© ${year} ${esc(ownerName)} Dex. All rights reserved.</span>
        <span class="footer-center">${FOOTER_WINGS_SVG}</span>
        <a class="footer-top-link" href="#hero-section" aria-label="Back to top">BACK TO TOP ↑</a>
      </div>
      <div class="footer-bottom">
        ${socialsHTML ? `<div class="footer-socials">${socialsHTML}</div>` : ''}
        <span class="footer-right">BUILT WITH <span class="footer-heart">♥</span> AND PASSION</span>
      </div>
    </div>
  `;
}

function createCard(item, index, cat) {
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

  // Bind full item data (enriched with category) directly for event delegation + detail modal.
  card.itemData = { ...item, categoryTitle: cat?.title || '', categoryId: cat?.id || '' };

  return card;
}

export function renderCategories(categories) {
  const container = document.getElementById('categories-container');
  const fragment = document.createDocumentFragment();

  fragment.appendChild(buildSearchBar());

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
          ? items.map((item, j) => createCard(item, j, cat))
          : h('dex-empty-state', { 'icon': cat.icon || 'bookmark', 'message': `No ${cat.title?.toLowerCase() || 'items'} added yet.`, 'action-text': 'VIEW CATEGORIES' })
      )
    );
    fragment.appendChild(section);
  });

  container.replaceChildren(fragment);
  attachSearch(container.querySelector('.dex-search'), container);
}

export function renderExploreCategories(categories) {
  const section = document.getElementById('explore-categories');
  const fragment = document.createDocumentFragment();

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
        h('p', { className: 'explore-card-desc' }, 'More categories coming soon.')
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

  const recentItems = (() => {
    const allItems = [];
    categories.forEach(cat => {
      cat.items.forEach(item => {
        allItems.push({ ...item, categoryTitle: cat.title, categoryId: cat.id });
      });
    });
    allItems.sort((a, b) => {
      const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
      const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
      return dateB - dateA;
    });
    return allItems.slice(0, 4);
  })();
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
        h('span', { className: 'recent-card-title' }, item.title || 'Unknown'),
        h('span', { className: 'recent-card-meta' }, `${item.subtitle || ''} · ${dateStr}`)
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
  const categoryCount = categories.length;

  return h('div', { className: 'overview-column', id: 'dex-overview' },
    h('div', { className: 'overview-header' },
      h('span', { className: 'section-eyebrow', style: 'color: var(--red-on-dark);' }, 'AT A GLANCE'),
      h('h2', { className: 'overview-heading' }, 'DEX OVERVIEW')
    ),
    h('div', { className: 'overview-grid' },
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' }), h('span', { className: 'overview-stat-number' }, totalEntries), h('span', { className: 'overview-stat-label' }, 'Total Entries')),
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>' }), h('span', { className: 'overview-stat-number' }, categoryCount), h('span', { className: 'overview-stat-label' }, 'Categories')),
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>' }), h('span', { className: 'overview-stat-number' }, 'Sometimes'), h('span', { className: 'overview-stat-label' }, 'Updates')),
      h('div', { className: 'overview-stat' }, h('div', { className: 'overview-stat-icon', innerHTML: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' }), h('span', { className: 'overview-stat-number' }, '100%'), h('span', { className: 'overview-stat-label' }, 'Personal'))
    )
  );
}

const SEARCH_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>';

function buildSearchBar() {
  return h('div', { className: 'dex-search', role: 'search' },
    h('span', { className: 'dex-search-icon', innerHTML: SEARCH_ICON_SVG }),
    h('input', {
      type: 'search',
      id: 'dex-search-input',
      className: 'dex-search-input',
      placeholder: 'Search the dex…',
      'aria-label': 'Search the dex'
    }),
    h('span', { className: 'dex-search-count', 'aria-live': 'polite' }),
    h('button', { className: 'dex-search-clear', 'aria-label': 'Clear search', innerHTML: CLOSE_ICON_SVG })
  );
}

function attachSearch(bar, container) {
  if (!bar) return;
  const input = bar.querySelector('.dex-search-input');
  const clearBtn = bar.querySelector('.dex-search-clear');
  const countEl = bar.querySelector('.dex-search-count');

  const noResults = h('div', { className: 'dex-no-results', 'aria-live': 'polite' },
    h('p', { className: 'dex-no-results-code' }, 'NO RESULTS'),
    h('p', { className: 'dex-no-results-msg' }, 'No entries in the dex match this query.')
  );
  container.appendChild(noResults);

  const sections = Array.from(container.querySelectorAll('.category-section'));

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let total = 0;

    sections.forEach(section => {
      const divider = section.previousElementSibling
        && section.previousElementSibling.classList.contains('slash-divider')
        ? section.previousElementSibling : null;

      let visible = 0;
      section.querySelectorAll('dex-card').forEach(card => {
        const hay = `${card.getAttribute('title') || ''} ${card.getAttribute('subtitle') || ''}`.toLowerCase();
        const show = !q || hay.includes(q);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      const hasContent = visible > 0;
      section.style.display = hasContent ? '' : 'none';
      if (divider) divider.style.display = hasContent ? '' : 'none';
      total += visible;
    });

    countEl.textContent = q ? `${total} RESULT${total === 1 ? '' : 'S'}` : '';
    clearBtn.style.display = q ? 'flex' : 'none';
    noResults.style.display = (q && total === 0) ? 'flex' : 'none';
  };

  input.addEventListener('input', apply);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    apply();
    input.focus();
  });
  apply();
}
