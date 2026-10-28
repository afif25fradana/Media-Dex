import { DataStore } from './store.js';
import { initEvents } from './events.js';
import { 
  renderNavbar, 
  renderMobileMenu, 
  renderHero, 
  renderCollection, 
  renderRecentlyAdded, 
  renderLastFmSection,
  renderFooter 
} from './ui.js';
import { initLastFm } from './lastfm.js';
import { dismissLoading, triggerPageEntrance, setupScrollReveals } from './animations.js';
import { initHalftoneBackground } from './halftoneBg.js';

const init = async () => {
  try { localStorage.removeItem('dex-theme'); } catch { }
  const fetchWithTimeout = () => DataStore.fetch(AbortSignal.timeout(10000));

  try {
    initHalftoneBackground();
    const data = await fetchWithTimeout();
    
    renderNavbar(data.profile);
    renderMobileMenu(data.categories);
    renderHero(data.profile, data.socials);
    renderLastFmSection(data.profile, data.lastfm);
    renderCollection(data.categories);
    renderRecentlyAdded(data.categories, data.profile);
    renderFooter(data.profile, data.socials);

    window.__dexBooted = true;
    if (window.__dexWatchdogTimer) {
      clearTimeout(window.__dexWatchdogTimer);
      window.__dexWatchdogTimer = null;
    }

    setupNavbarScroll();
    setupScrollSpy();

    // Deep-link arrival: land on the section referenced by the URL hash.
    const initialHash = window.location.hash;
    if (initialHash && initialHash !== '#') {
      try {
        const initialTarget = document.querySelector(initialHash);
        if (initialTarget) {
          requestAnimationFrame(() => {
            initialTarget.scrollIntoView({ behavior: 'instant' });
          });
        }
      } catch {
        // Invalid selector in hash; ignore without breaking application boot.
      }
    }

    const menu = document.getElementById('mobile-menu');
    const menuTriggers = document.querySelectorAll('#navbar-menu-btn, #navbar-menu-desktop-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const appEl = document.getElementById('app');
    const headerEl = document.querySelector('.site-header');

    let lastFocusedEl = null;

    function openMenu() {
      lastFocusedEl = document.activeElement;
      if (appEl) appEl.inert = true;
      if (headerEl) headerEl.inert = true;
      menu.removeAttribute('inert');
      menu.classList.add('menu-open');
      menu.setAttribute('aria-hidden', 'false');
      menuTriggers.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
      setTimeout(() => closeBtn && closeBtn.focus(), 100);
    }

    function closeMenu() {
      menu.classList.remove('menu-open');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');
      if (appEl) appEl.inert = false;
      if (headerEl) headerEl.inert = false;
      menuTriggers.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      const mobileBtn = document.getElementById('navbar-menu-btn');
      const desktopBtn = document.getElementById('navbar-menu-desktop-btn');
      const fallbackTarget = (mobileBtn && mobileBtn.offsetParent !== null) ? mobileBtn : (desktopBtn || mobileBtn);
      const target = lastFocusedEl && lastFocusedEl.isConnected ? lastFocusedEl : fallbackTarget;
      if (target && target.focus) target.focus();
      lastFocusedEl = null;
    }

    initEvents({
      openMenu,
      closeMenu
    });

    dismissLoading(() => {
      triggerPageEntrance();
      setupScrollReveals();
      initLastFm(data.lastfm);
    });

  } catch (error) {
    console.error('Failed to load dex data:', error);
    window.__dexBooted = true;
    if (window.__dexWatchdogTimer) {
      clearTimeout(window.__dexWatchdogTimer);
      window.__dexWatchdogTimer = null;
    }
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.innerHTML = `
        <div class="loading-error">
          <h2 class="loading-error-title">System Error</h2>
          <p class="loading-error-msg">Failed to load the dex data. Check your connection and try again.</p>
          <button class="error-retry" id="error-retry-btn">RETRY CONNECTION</button>
        </div>
      `;
      const retryBtn = document.getElementById('error-retry-btn');
      if (retryBtn) retryBtn.addEventListener('click', () => window.location.reload());
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function setupNavbarScroll() {
  const navbar = document.getElementById('site-navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function setupScrollSpy() {
  if (!window.IntersectionObserver) return;

  const navLinks = document.querySelectorAll('.navbar-link, .mobile-menu-link');
  const catLinks = document.querySelectorAll('.mobile-menu-cat');
  const sections = [];
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href !== '#') {
      const el = document.querySelector(href);
      if (el && !sections.includes(el)) {
        sections.push(el);
      }
    }
  });

  const collectionSection = document.getElementById('collection-section');
  if (collectionSection && !sections.includes(collectionSection)) {
    sections.push(collectionSection);
  }

  // Debounce observer during manual scroll to prevent active-state flicker.
  window.isNavScrolling = false;

  const visibleSections = new Map();

  const applyActive = () => {
    let maxRatio = 0;
    let activeId = null;
    visibleSections.forEach((ratio, id) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        activeId = '#' + id;
      }
    });

    if (activeId) {
      const activeEl = document.querySelector(activeId);
      const isCollection = activeEl && activeEl.id === 'collection-section';
      const mainTargetHref = isCollection ? '#collection-section' : activeId;

      navLinks.forEach(link => {
        if (link.getAttribute('href') === mainTargetHref) link.classList.add('active');
        else link.classList.remove('active');
      });

      const activeTabCat = document.querySelector('.cat-tab.is-active')?.dataset.cat;
      catLinks.forEach(link => {
        if (isCollection && link.dataset.cat === activeTabCat) link.classList.add('active');
        else link.classList.remove('active');
      });
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visibleSections.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

    if (window.isNavScrolling) return;

    applyActive();
  }, {
    rootMargin: '-10% 0px -10% 0px',
    threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.75]
  });

  sections.forEach(sec => observer.observe(sec));

  window.refreshNavActive = applyActive;
}
