import { DataStore } from './store.js';
import { initEvents } from './events.js';
import { 
  initTheme, 
  toggleTheme, 
  renderNavbar, 
  renderMobileMenu, 
  renderHero, 
  renderExploreCategories, 
  renderCategories, 
  renderRecentlyAdded, 
  renderFooter 
} from './ui.js';
import { dismissLoading, triggerPageEntrance, setupScrollReveals } from './animations.js';

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();

  const fetchWithTimeout = () => DataStore.fetch(AbortSignal.timeout(10000));

  try {
    const data = await fetchWithTimeout();
    
    renderNavbar(data.profile);
    renderMobileMenu(data.categories);
    renderHero(data.profile, data.socials);
    renderExploreCategories(data.categories);
    renderCategories(data.categories);
    renderRecentlyAdded(data.categories);
    renderFooter(data.profile, data.socials);

    window.__dexBooted = true;

    setupNavbarScroll();
    setupScrollSpy();

    // Deep-link arrival: land on the section referenced by the URL hash.
    const initialHash = window.location.hash;
    if (initialHash && initialHash !== '#') {
      const initialTarget = document.querySelector(initialHash);
      if (initialTarget) {
        requestAnimationFrame(() => {
          initialTarget.scrollIntoView({ behavior: 'instant' });
        });
      }
    }

    const menu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('navbar-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');

    let lastFocusedEl = null;

    function openMenu() {
      lastFocusedEl = document.activeElement;
      menu.removeAttribute('inert');
      menu.classList.add('menu-open');
      menu.setAttribute('aria-hidden', 'false');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeBtn && closeBtn.focus(), 100);
    }

    function closeMenu() {
      menu.classList.remove('menu-open');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      const target = lastFocusedEl && lastFocusedEl.isConnected ? lastFocusedEl : openBtn;
      if (target && target.focus) target.focus();
      lastFocusedEl = null;
    }

    initEvents({
      toggleTheme,
      openMenu,
      closeMenu
    });

    dismissLoading(() => {
      triggerPageEntrance();
      setupScrollReveals();
    });

  } catch (error) {
    console.error('Failed to load dex data:', error);
    window.__dexBooted = true;
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
});

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
      navLinks.forEach(link => {
        if (link.getAttribute('href') === activeId) link.classList.add('active');
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
    threshold: [0, 0.5]
  });

  sections.forEach(sec => observer.observe(sec));

  window.refreshNavActive = applyActive;
}


