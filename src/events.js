import { openDetailModal } from './modal.js';
import { prefersReducedMotion } from './motion.js';

export function initEvents(actions) {
  let navScrollTimeout;

  document.addEventListener('click', (e) => {
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
      e.preventDefault();
      openDetailModal(card.itemData);
      return;
    }

    const recentCard = e.target.closest('.recent-card');
    if (recentCard && recentCard.itemData) {
      e.preventDefault();
      openDetailModal(recentCard.itemData);
      return;
    }

    const trigger = e.target.closest('[data-scroll-to]');
    if (trigger) {
      e.preventDefault();
      let target = null;
      try {
        target = document.querySelector(trigger.getAttribute('data-scroll-to'));
      } catch {}
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? 'instant' : 'smooth'
        });
      }
      return;
    }

    const heroScrollBtn = e.target.closest('.hero-scroll-down');
    if (heroScrollBtn) {
      e.preventDefault();
      const lastfm = document.getElementById('lastfm-section');
      if (lastfm) {
        lastfm.scrollIntoView({
          behavior: prefersReducedMotion() ? 'instant' : 'smooth'
        });
        if (window.location.hash !== '#lastfm-section') {
          history.pushState(null, '', '#lastfm-section');
        }
      }
      return;
    }

    const anchorLink = e.target.closest('a[href^="#"]');
    if (anchorLink) {
      const targetId = anchorLink.getAttribute('href');
      if (targetId && targetId !== '#') {
        let target = null;
        try {
          target = document.querySelector(targetId);
        } catch {}
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
          if (anchorLink.matches('.skip-link, .mobile-menu-link, .mobile-menu-cat')) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }

          if (anchorLink.classList.contains('navbar-link') || anchorLink.matches('.mobile-menu-link, .mobile-menu-cat')) {
            window.isNavScrolling = true;
            clearTimeout(navScrollTimeout);
            
            const isCollection = target && target.id === 'collection-section';
            const mainTargetHref = isCollection ? '#collection-section' : targetId;

            document.querySelectorAll('.navbar-link, .mobile-menu-link').forEach(l => {
              if (l.getAttribute('href') === mainTargetHref) l.classList.add('active');
              else l.classList.remove('active');
            });

            document.querySelectorAll('.mobile-menu-cat').forEach(c => {
              if (isCollection && c.getAttribute('href') === targetId) c.classList.add('active');
              else c.classList.remove('active');
            });
            
            navScrollTimeout = setTimeout(() => {
              window.isNavScrolling = false;
              if (window.refreshNavActive) window.refreshNavActive();
            }, 800);
          }
        }
      }
    }
  });

  document.addEventListener('action-click', () => {
    const target = document.querySelector('#collection-section');
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
  });

  // Back/forward: honor the hash history pushed on section navigation.
  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      try {
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
      } catch {
        // Invalid selector in hash; ignore without breaking navigation.
      }
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    }
  });
}
