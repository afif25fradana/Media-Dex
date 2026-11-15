import { openDetailModal, openProfileModal } from './modal.js';
import { prefersReducedMotion } from './motion.js';
import { reobserveCards } from './animations.js';
import { toggleOperator, mountHeroMedia, teardownVideo, getInitialOperator } from './operator.js';

const OPERATOR_DEFAULTS = {
  wisadel: {
    id: 'wisadel',
    displayName: 'WISADEL',
    code: 'ID: WSD-014',
    tagline: 'A personal collection of games, manhwa, movies, series, and music.',
    quote: 'Living a life surrounded by stories I love.',
    video: 'Asset/Profile/wisadel-bg-fast.webm',
    videoReady: true,
    poster: 'Asset/Profile/wisadel-poster.webp',
    alt: 'Wisadel animated character portrait'
  },
  shu: {
    id: 'shu',
    displayName: 'SHU',
    code: 'ID: SHU-012',
    tagline: 'A quiet archive of games, manhwa, films, and music.',
    quote: 'Gathered slowly, kept for good company.',
    video: 'Asset/Profile/shu-bg-short.webm',
    videoReady: true,
    poster: 'Asset/Profile/shu-poster.webp',
    alt: 'Shu animated character portrait'
  }
};

export function initEvents(actions, profile = null, socials = null) {
  const profileConfig = profile;
  let navScrollTimeout;

  document.addEventListener('click', (e) => {
    const opTrigger = e.target.closest('#operatorToggleBtn, #mobileOperatorBtn');
    if (opTrigger) {
      e.preventDefault();
      toggleOperator();
      return;
    }

    const profileTrigger = e.target.closest('[data-action="open-profile-modal"]');
    if (profileTrigger) {
      e.preventDefault();
      openProfileModal(profile, socials);
      return;
    }

    const openMenuBtn = e.target.closest('#navbar-menu-btn, #navbar-menu-desktop-btn');
    if (openMenuBtn && actions.openMenu) {
      document.querySelectorAll('#navbar-menu-btn, #navbar-menu-desktop-btn').forEach(btn => {
        btn.setAttribute('aria-expanded', 'true');
      });
      actions.openMenu();
      return;
    }

    const closeMenuBtn = e.target.closest('#mobile-menu-close');
    const menuLink = e.target.closest('.mobile-menu-link, .mobile-menu-cat');
    if ((closeMenuBtn || menuLink) && actions.closeMenu) {
      document.querySelectorAll('#navbar-menu-btn, #navbar-menu-desktop-btn').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });
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
        if (target.id === 'collection-section') {
          target.classList.add('revealed');
          reobserveCards();
          target.querySelectorAll('dex-card').forEach(c => c.classList.add('card-visible'));
        }
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
          if (target.id === 'collection-section') {
            target.classList.add('revealed');
            reobserveCards();
            target.querySelectorAll('dex-card').forEach(c => c.classList.add('card-visible'));
          }
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

            const activeTabCat = document.querySelector('.cat-tab.is-active')?.dataset.cat;
            document.querySelectorAll('.mobile-menu-cat').forEach(c => {
              if (isCollection && c.dataset.cat === activeTabCat) c.classList.add('active');
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
    if (target) {
      target.classList.add('revealed');
      reobserveCards();
      target.querySelectorAll('dex-card').forEach(c => c.classList.add('card-visible'));
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    }
  });

  document.addEventListener('keydown', (e) => {
    const menu = document.getElementById('mobile-menu');

    if (e.key === 'Escape') {
      if (menu && menu.classList.contains('menu-open') && actions.closeMenu) {
        document.querySelectorAll('#navbar-menu-btn, #navbar-menu-desktop-btn').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
        actions.closeMenu();
      }
    }

    if (e.key === 'Tab' && menu && menu.classList.contains('menu-open')) {
      const focusables = menu.querySelectorAll('.mobile-menu-close, .mobile-menu-link, .mobile-operator-btn, .mobile-menu-cat');
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

  // Listen for operator changes to refresh UI indicators, hero ID card, and media stage
  window.addEventListener('operatorchange', (e) => {
    const nextOpId = e.detail?.operator || 'wisadel';
    const opConfig = (profileConfig?.operators?.[nextOpId]) || OPERATOR_DEFAULTS[nextOpId] || OPERATOR_DEFAULTS.wisadel;

    // 1. Update #operatorToggleBtn aria-label and label text
    const toggleBtn = document.getElementById('operatorToggleBtn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', `Operator: ${opConfig.displayName}. Click to switch operator theme.`);
      const label = toggleBtn.querySelector('.operator-label') || toggleBtn;
      if (label !== toggleBtn) {
        label.textContent = opConfig.displayName;
      } else {
        toggleBtn.textContent = opConfig.displayName;
      }
    }

    // 2. Update #mobileOperatorBtn label text
    const mobileBtn = document.getElementById('mobileOperatorBtn');
    if (mobileBtn) {
      mobileBtn.setAttribute('aria-label', `Operator: ${opConfig.displayName}. Click to switch operator theme.`);
      const mobileLabel = mobileBtn.querySelector('.mobile-operator-label') || mobileBtn;
      if (mobileLabel !== mobileBtn) {
        mobileLabel.textContent = `OPERATOR: ${opConfig.displayName}`;
      } else {
        mobileBtn.textContent = `OPERATOR: ${opConfig.displayName}`;
      }
    }

    // 3. Update hero text fields for active operator
    const bioEl = document.getElementById('heroBio');
    if (bioEl) bioEl.textContent = opConfig.tagline;

    // 4. Mount hero media with clean crossfade
    const heroIllustration = document.getElementById('heroIllustration');
    if (heroIllustration) {
      const { posterImg } = mountHeroMedia(heroIllustration, {
        poster: opConfig.poster,
        video: opConfig.video || opConfig.videoSrc,
        videoSrc: opConfig.video || opConfig.videoSrc,
        videoReady: Boolean(opConfig.videoReady),
        alt: opConfig.alt || `${opConfig.displayName} character portrait`
      });
      if (posterImg) {
        posterImg.id = 'heroPoster';
        posterImg.setAttribute('fetchpriority', 'high');
        posterImg.setAttribute('width', '600');
        posterImg.setAttribute('height', '600');
      }
    }
  });

  // Handle runtime OS reduced motion preference changes
  window.addEventListener('motionpreferencechange', (e) => {
    const heroIllustration = document.getElementById('heroIllustration');
    if (!heroIllustration) return;

    if (e.detail?.reducedMotion) {
      const activeVideo = heroIllustration.querySelector('video');
      if (activeVideo) teardownVideo(activeVideo);
    } else {
      const currentOp = getInitialOperator();
      const opConfig = (profileConfig?.operators?.[currentOp]) || OPERATOR_DEFAULTS[currentOp] || OPERATOR_DEFAULTS.wisadel;
      if (opConfig && opConfig.videoReady) {
        mountHeroMedia(heroIllustration, {
          poster: opConfig.poster,
          video: opConfig.video || opConfig.videoSrc,
          videoSrc: opConfig.video || opConfig.videoSrc,
          videoReady: Boolean(opConfig.videoReady),
          alt: opConfig.alt || `${opConfig.displayName} character portrait`
        });
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
