export function initEvents(actions) {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = motionQuery.matches;
  motionQuery.addEventListener('change', e => {
    isReducedMotion = e.matches;
  });

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
    const menuLink = e.target.closest('.mobile-menu-link');
    if ((closeMenuBtn || menuLink) && actions.closeMenu) {
      actions.closeMenu();
      // Don't early return if it's a link, so smooth scroll logic below still runs.
      if (closeMenuBtn) return;
    }

    const trigger = e.target.closest('[data-scroll-to]');
    if (trigger) {
      e.preventDefault();
      const target = document.querySelector(trigger.getAttribute('data-scroll-to'));
      if (target) {
        target.scrollIntoView({
          behavior: isReducedMotion ? 'instant' : 'smooth'
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
            behavior: isReducedMotion ? 'instant' : 'smooth'
          });
          
          // Scroll-spy debounce integration
          if (anchorLink.classList.contains('navbar-link') || anchorLink.classList.contains('mobile-menu-link')) {
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = document.getElementById('mobile-menu');
      if (menu && menu.classList.contains('menu-open') && actions.closeMenu) {
        actions.closeMenu();
        const openBtn = document.getElementById('navbar-menu-btn');
        if (openBtn) openBtn.focus();
      }
    }
  });
}
