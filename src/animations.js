import { prefersReducedMotion } from './motion.js';

let reobserveReadyTimer = null;

const TIMING = {
  PAGE_ENTRANCE_STAGGER: 120,
  SCROLL_READY_DELAY: 1000
};

export function dismissLoading(onDone) {
  const loader = document.getElementById('loading-screen');

  if (prefersReducedMotion()) {
    loader.style.display = 'none';
    loader.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('dex-card').forEach(card => {
      card.classList.remove('card-will-animate');
      card.classList.add('card-ready');
    });
    if (onDone) onDone();
    return;
  }

  requestAnimationFrame(() => {
    loader.classList.add('dismissed');

    const handleTransitionEnd = (e) => {
      if (e.target !== loader) return;
      loader.removeEventListener('transitionend', handleTransitionEnd);
      loader.style.display = 'none';
      loader.setAttribute('aria-hidden', 'true');
    };

    loader.addEventListener('transitionend', handleTransitionEnd);
    setTimeout(() => {
      loader.removeEventListener('transitionend', handleTransitionEnd);
      loader.style.display = 'none';
      loader.setAttribute('aria-hidden', 'true');
    }, 360);

    if (onDone) onDone();
  });
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

  const sections = document.querySelectorAll('.panel-enter, .collection-section');

  if (!window.IntersectionObserver) {
    sections.forEach(s => s.classList.add('revealed'));
    document.querySelectorAll('dex-card, .card').forEach(c => {
      c.classList.remove('card-will-animate');
      c.classList.add('card-visible', 'card-ready');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('revealed');

      const cards = Array.from(el.querySelectorAll('dex-card'));
      cards.forEach((card, i) => {
        card.style.setProperty('--delay', `${i * 50}ms`);
        card.classList.add('card-visible');
      });

      setTimeout(() => {
        cards.forEach(card => {
          card.classList.remove('card-will-animate');
          card.classList.add('card-ready');
        });
      }, TIMING.SCROLL_READY_DELAY);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -5% 0px'
  });

  sections.forEach(s => {
    observer.observe(s);
  });
}

/**
 * Re-observe or immediately reveal newly injected cards after tab filter or sort.
 */
export function reobserveCards() {
  const cards = Array.from(document.querySelectorAll('#dexCardGrid dex-card'));
  if (!cards.length) return;

  if (prefersReducedMotion()) {
    cards.forEach(c => {
      c.classList.remove('card-will-animate');
      c.classList.add('card-visible', 'card-ready');
    });
    return;
  }

  const section = document.getElementById('collection-section');
  const isSectionRevealed = section && (section.classList.contains('revealed') || isInViewport(section));

  if (isSectionRevealed) {
    if (reobserveReadyTimer !== null) {
      clearTimeout(reobserveReadyTimer);
      reobserveReadyTimer = null;
    }
    cards.forEach((card, i) => {
      card.style.setProperty('--delay', `${i * 50}ms`);
      requestAnimationFrame(() => {
        card.classList.add('card-visible');
      });
    });

    reobserveReadyTimer = setTimeout(() => {
      reobserveReadyTimer = null;
      cards.forEach(card => {
        card.classList.remove('card-will-animate');
        card.classList.add('card-ready');
      });
    }, TIMING.SCROLL_READY_DELAY);
  }
}
