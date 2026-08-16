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
  
  try {
    const data = await DataStore.fetch();
    
    renderNavbar(data.profile);
    renderMobileMenu();
    renderHero(data.profile, data.socials);
    renderExploreCategories(data.categories);
    renderCategories(data.categories);
    renderRecentlyAdded(data.categories);
    renderFooter();

    setupNavbarScroll();
    setupScrollSpy();
    
    const menu = document.getElementById('mobile-menu');
    const openBtn = document.getElementById('navbar-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');

    function openMenu() {
      menu.classList.add('menu-open');
      menu.setAttribute('aria-hidden', 'false');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => closeBtn && closeBtn.focus(), 100);
    }

    function closeMenu() {
      menu.classList.remove('menu-open');
      menu.setAttribute('aria-hidden', 'true');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
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
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.innerHTML = `
        <div class="loading-error" style="color: var(--red); padding: 2rem; text-align: center;">
          <h2 style="font-family: var(--font-heading); text-transform: uppercase;">System Error</h2>
          <p style="font-family: var(--font-body); opacity: 0.8;">Failed to load connection data.</p>
        </div>
      `;
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

  const observer = new IntersectionObserver((entries) => {
    if (window.isNavScrolling) return;

    entries.forEach(entry => {
      visibleSections.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });

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
  }, {
    rootMargin: '-10% 0px -10% 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  });

  sections.forEach(sec => observer.observe(sec));
}


