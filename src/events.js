import { openDetailModal } from './modal.js';
import { prefersReducedMotion } from './motion.js';

export function initEvents(actions) {
  let navScrollTimeout;

  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle-btn');
    if (themeBtn && actions.toggleTheme) {
      actions.toggleTheme();
      return;
    }

    const openMenuBtn = e.target.closest('#navbar-menu-btn, #navbar-menu-desktop-btn');
    if (openMenuBtn && actions.openMenu) {
      actions.openMenu();
      return;
    }

    const closeMenuBtn = e.target.closest('#mobile-menu-close');
    const menuLink = e.target.closest('.mobile-menu-link, .mobile-menu-cat');
    if ((closeMenuBtn || menuLink) && actions.closeMenu) {
      actions.closeMenu();
      // Don't early return if it's a link, so smooth scroll logic below still runs.
      if (closeMenuBtn) return;
    }

    const card = e.target.closest('dex-card');
    if (card && card.itemData) {
      openDetailModal(card.itemData);
      return;
    }

    const trigger = e.target.closest('[data-scroll-to]');
    if (trigger) {
      e.preventDefault();
      const target = document.querySelector(trigger.getAttribute('data-scroll-to'));
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? 'instant' : 'smooth'
        });
      }
      return;
    }

    const anchorLink = e.target.closest('a[href^="#"]');
    if (anchorLink) {
      const targetId = anchorLink.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: prefersReducedMotion() ? 'instant' : 'smooth'
          });

          // Deep-link: keep the URL hash in sync so Back works and sections are shareable.
          if (window.location.hash !== targetId) {
            history.pushState(null, '', targetId);
          }

          // Move focus to the destination so keyboard/SR users land where they navigated.
          if (anchorLink.matches('.mobile-menu-link, .mobile-menu-cat')) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }

          // Scroll-spy debounce integration
          if (anchorLink.classList.contains('navbar-link') || anchorLink.matches('.mobile-menu-link, .mobile-menu-cat')) {
            window.isNavScrolling = true;
            clearTimeout(navScrollTimeout);
            
            document.querySelectorAll('.navbar-link, .mobile-menu-link').forEach(l => {
              if (l.getAttribute('href') === targetId) l.classList.add('active');
              else l.classList.remove('active');
            });
            
            navScrollTimeout = setTimeout(() => {
              window.isNavScrolling = false;
            }, 800);
          }
        }
      }
    }
  });

  document.addEventListener('action-click', () => {
    const target = document.querySelector('#explore-categories');
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    const menu = document.getElementById('mobile-menu');

    if (e.key === 'Escape') {
      if (menu && menu.classList.contains('menu-open') && actions.closeMenu) {
        actions.closeMenu();
      }
    }

    if (e.key === 'Tab' && menu && menu.classList.contains('menu-open')) {
      const focusables = menu.querySelectorAll('.mobile-menu-close, .mobile-menu-link, .mobile-menu-cat');
      if (focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Focus the dex search from anywhere: "/" or Ctrl/Cmd+K.
    const target = e.target;
    const isTyping = target && (target.matches('input, textarea, select') || target.isContentEditable);
    const isSlash = e.key === '/' && !isTyping;
    const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    if ((isSlash || isCmdK) && !(menu && menu.classList.contains('menu-open'))) {
      const input = document.querySelector('.dex-search-input');
      if (input) {
        e.preventDefault();
        input.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth', block: 'center' });
        input.focus();
      }
    }
  });

  // Back/forward: honor the hash history pushed on section navigation.
  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    }
  });
}
