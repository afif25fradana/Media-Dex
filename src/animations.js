import { prefersReducedMotion } from './motion.js';

const TIMING = {
  PAGE_ENTRANCE_STAGGER: 120,
  SCROLL_READY_DELAY: 1000,
  LOADING_DISMISS_DELAY: 500,
  LOADING_HIDE_DELAY: 400
};

export function dismissLoading(onDone) {
  const loader = document.getElementById('loading-screen');

  if (prefersReducedMotion()) {
    loader.style.display = 'none';
    loader.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('dex-card, .card').forEach(card => {
      card.classList.add('card-ready');
    });
    if (onDone) onDone();
    return;
  }

  setTimeout(() => {
    loader.classList.add('dismissed');
    setTimeout(() => {
      loader.style.display = 'none';
      loader.setAttribute('aria-hidden', 'true');
      if (onDone) onDone();
    }, TIMING.LOADING_HIDE_DELAY);
  }, TIMING.LOADING_DISMISS_DELAY);
}

export function triggerPageEntrance() {
  if (prefersReducedMotion()) return;

  const hero = document.getElementById('hero-section');
  if (hero) hero.classList.add('hero-entrance');

  const sections = document.querySelectorAll('.panel-enter');
  sections.forEach((el, i) => {
    if (isInViewport(el)) {
      setTimeout(() => el.classList.add('revealed'), i * TIMING.PAGE_ENTRANCE_STAGGER);
    }
  });
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function setupScrollReveals() {
  if (prefersReducedMotion()) return;

  const sections = document.querySelectorAll('.category-section');
  const footer = document.querySelector('.site-footer');

  if (!window.IntersectionObserver) {
    sections.forEach(s => s.classList.add('revealed'));
    if (footer) footer.classList.add('revealed');
    document.querySelectorAll('dex-card, .card').forEach(c => {
      c.classList.add('card-visible', 'card-ready');
    });
    return;
  }

  // Cache cards to avoid synchronous DOM queries inside the scroll observer
  const sectionCardsMap = new WeakMap();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('revealed');

      const cards = sectionCardsMap.get(el) || [];
      cards.forEach(card => card.classList.add('card-visible'));

      setTimeout(() => {
        cards.forEach(card => card.classList.add('card-ready'));
      }, TIMING.SCROLL_READY_DELAY);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -8% 0px'
  });

  sections.forEach(s => {
    sectionCardsMap.set(s, Array.from(s.querySelectorAll('dex-card, .card')));
    observer.observe(s);
  });
  
  if (footer) {
    sectionCardsMap.set(footer, []);
    observer.observe(footer);
  }
}
