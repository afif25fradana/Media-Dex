/**
 * operator.js - Operator theme & hero media coordinator for Media-Dex.
 * Governs active operator state ('wisadel' | 'shu'), persistence in localStorage,
 * and resilient cross-platform video/poster hero mounting with GPU teardown.
 */

import { prefersReducedMotion } from './motion.js';
import { encodeAssetPath } from './utils.js';

export { prefersReducedMotion };
export const STORAGE_KEY = 'media-dex-operator';
export const DEFAULT_OPERATOR = 'wisadel';
export const VALID_OPERATORS = Object.freeze(['wisadel', 'shu']);

export const OPERATOR_DEFAULTS = Object.freeze({
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
});

const resolveMediaPath = (url) => {
  if (!url || typeof url !== 'string') return '';
  return /^https?:\/\//i.test(url) ? url : encodeAssetPath(url);
};

let motionMqlCleanup = null;

/**
 * Initialize dynamic prefers-reduced-motion media query listener with cleanup.
 * @returns {() => void} Teardown function
 */
export const initMotionPreferenceListener = () => {
  if (motionMqlCleanup) {
    motionMqlCleanup();
    motionMqlCleanup = null;
  }

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  try {
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event) => {
      window.dispatchEvent(
        new CustomEvent('motionpreferencechange', {
          detail: { reducedMotion: event.matches }
        })
      );
    };

    if (typeof motionMql.addEventListener === 'function') {
      motionMql.addEventListener('change', onMotionChange);
      motionMqlCleanup = () => motionMql.removeEventListener('change', onMotionChange);
    } else if (typeof motionMql.addListener === 'function') {
      motionMql.addListener(onMotionChange);
      motionMqlCleanup = () => motionMql.removeListener(onMotionChange);
    } else {
      motionMqlCleanup = () => {};
    }
  } catch {
    motionMqlCleanup = () => {};
  }

  return motionMqlCleanup;
};

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  initMotionPreferenceListener();
}

/**
 * Retrieve the active operator from storage or DOM attribute.
 * @returns {'wisadel' | 'shu'}
 */
export const getInitialOperator = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_OPERATORS.includes(stored)) {
      return stored;
    }
  } catch {
    // LocalStorage inaccessible (e.g. sandboxed iframe or private browsing)
  }

  if (typeof document !== 'undefined' && document.documentElement) {
    const attr = document.documentElement.getAttribute('data-operator');
    if (attr && VALID_OPERATORS.includes(attr)) {
      return attr;
    }
  }

  return DEFAULT_OPERATOR;
};

/**
 * Synchronize <meta name="theme-color"> and <meta name="color-scheme"> tags with active operator.
 * @param {string} target - Active operator identifier ('wisadel' | 'shu')
 */
export const syncMetaTheme = (target) => {
  if (typeof document === 'undefined') return;
  const isShu = target === 'shu';
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', isShu ? '#F5F2EB' : '#090A0D');
  }
  const schemeMeta = document.querySelector('meta[name="color-scheme"]');
  if (schemeMeta) {
    schemeMeta.setAttribute('content', isShu ? 'light' : 'dark');
  }
};

/**
 * Set and persist the active operator on documentElement and localStorage.
 * @param {string} operatorId
 * @returns {'wisadel' | 'shu'}
 */
export const setOperator = (operatorId) => {
  const target = VALID_OPERATORS.includes(operatorId) ? operatorId : DEFAULT_OPERATOR;

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-operator', target);
    syncMetaTheme(target);
  }

  try {
    localStorage.setItem(STORAGE_KEY, target);
  } catch {
    // LocalStorage quota or access denied
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('operatorchange', {
        detail: { operator: target }
      })
    );
  }

  return target;
};

/**
 * Toggle between wisadel and shu operators.
 * @returns {'wisadel' | 'shu'}
 */
export const toggleOperator = () => {
  const current = getInitialOperator();
  const next = current === 'shu' ? 'wisadel' : 'shu';
  return setOperator(next);
};

let pendingVideoMount = null;

/**
 * Cancel any scheduled deferred video mount.
 */
export const cancelDeferredVideoMount = () => {
  if (pendingVideoMount) {
    if (typeof cancelIdleCallback === 'function' && pendingVideoMount.type === 'idle') {
      cancelIdleCallback(pendingVideoMount.id);
    } else if (pendingVideoMount.type === 'timer') {
      clearTimeout(pendingVideoMount.id);
    } else if (pendingVideoMount.type === 'listener' && typeof window !== 'undefined') {
      window.removeEventListener('load', pendingVideoMount.fn);
    }
    pendingVideoMount = null;
  }
};

/**
 * Complete video teardown protocol to release hardware/GPU decoder buffers.
 * @param {HTMLVideoElement | null} video
 */
export const teardownVideo = (video) => {
  if (!video || video._isTornDown) return;
  video._isTornDown = true;

  if (video._visibilityObserver) {
    video._visibilityObserver.disconnect();
    video._visibilityObserver = null;
  }

  if (video._handleMediaError) {
    video.removeEventListener('error', video._handleMediaError);
  }
  const source = video.querySelector('source');
  if (source && source._handleMediaError) {
    source.removeEventListener('error', source._handleMediaError);
  }

  try {
    video.pause();
  } catch {
    // Ignore pause errors on already stopped videos
  }

  video.removeAttribute('src');
  video.replaceChildren();

  try {
    video.load();
  } catch {
    // Ignore load errors during detachment
  }

  if (typeof video.remove === 'function') {
    video.remove();
  } else if (video.parentNode) {
    video.parentNode.removeChild(video);
  }
};

export const mountHeroMedia = (container, config = {}) => {
  if (!container) return { posterImg: null, video: null };

  cancelDeferredVideoMount();

  const existingVideo = container.querySelector('video');
  if (existingVideo) {
    teardownVideo(existingVideo);
  }

  container.replaceChildren();

  const encodedPoster = resolveMediaPath(config.poster);
  let posterImg = null;
  if (encodedPoster) {
    const picture = document.createElement('picture');
    picture.className = 'hero-poster-picture';
    posterImg = document.createElement('img');
    posterImg.id = 'heroPoster';
    posterImg.className = 'hero-poster';
    posterImg.src = encodedPoster;
    posterImg.alt = config.alt || 'Operator hero illustration';
    posterImg.loading = 'eager';
    posterImg.decoding = 'async';
    posterImg.setAttribute('fetchpriority', 'high');
    posterImg.width = 1920;
    posterImg.height = 1080;
    picture.appendChild(posterImg);
    container.appendChild(picture);
  }

  const videoUrl = resolveMediaPath(config.video || config.videoSrc);
  const saveDataEnabled = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
  if (!config.videoReady || !videoUrl || prefersReducedMotion() || saveDataEnabled) {
    return { posterImg, video: null };
  }

  const mountVideo = () => {
    pendingVideoMount = null;
    if (prefersReducedMotion()) return null;
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData === true) return null;
    if (typeof container.isConnected === 'boolean' && !container.isConnected) return null;

    const currentVideo = container.querySelector('video');
    if (currentVideo) {
      teardownVideo(currentVideo);
    }

    const video = document.createElement('video');
    video.className = 'hero-video';
    video.width = 1920;
    video.height = 1080;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.disablePictureInPicture = true;
    video.setAttribute('disablepictureinpicture', '');
    video.setAttribute('disableremoteplayback', '');
    video.preload = 'auto';
    if (encodedPoster) {
      video.poster = encodedPoster;
    }

    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = config.videoType || 'video/webm';
    video.appendChild(source);

    const handleMediaError = () => {
      teardownVideo(video);
    };
    video._handleMediaError = handleMediaError;
    source._handleMediaError = handleMediaError;
    video.addEventListener('error', handleMediaError, { once: true });
    source.addEventListener('error', handleMediaError, { once: true });

    video.addEventListener('playing', () => {
      video.classList.add('is-playing');
    }, { once: true });

    container.appendChild(video);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err && err.name === 'AbortError') return;
        teardownVideo(video);
      });
    }

    if (typeof IntersectionObserver === 'function') {
      const visibilityObserver = new IntersectionObserver((entries) => {
        if (video._isTornDown) return;
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (video.paused && !prefersReducedMotion()) {
            const p = video.play();
            if (p !== undefined) {
              p.catch((err) => {
                if (err && err.name !== 'AbortError') teardownVideo(video);
              });
            }
          }
        } else if (!video.paused) {
          try {
            video.pause();
          } catch {
            // Ignore pause errors during detachment
          }
        }
      }, { threshold: 0.05 });
      visibilityObserver.observe(container);
      video._visibilityObserver = visibilityObserver;
    }

    return video;
  };

  const scheduleMount = () => {
    if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => mountVideo(), { timeout: 1500 });
      pendingVideoMount = { type: 'idle', id };
    } else if (typeof window !== 'undefined') {
      const id = window.setTimeout(() => mountVideo(), 300);
      pendingVideoMount = { type: 'timer', id };
    } else {
      mountVideo();
    }
  };

  if (typeof document !== 'undefined' && document.readyState === 'complete') {
    scheduleMount();
  } else if (typeof window !== 'undefined') {
    const onLoad = () => {
      scheduleMount();
    };
    window.addEventListener('load', onLoad, { once: true });
    pendingVideoMount = { type: 'listener', fn: onLoad };
  } else {
    mountVideo();
  }

  return { posterImg, video: null };
};
