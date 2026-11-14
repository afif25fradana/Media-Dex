/**
 * operator.js - Operator theme & hero media coordinator for Media-Dex.
 * Governs active operator state ('wisadel' | 'shu'), persistence in localStorage,
 * and resilient cross-platform video/poster hero mounting with GPU teardown.
 */

export const STORAGE_KEY = 'media-dex-operator';
export const DEFAULT_OPERATOR = 'wisadel';
export const VALID_OPERATORS = Object.freeze(['wisadel', 'shu']);

/**
 * Check if user has requested reduced motion.
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
 * Set and persist the active operator on documentElement and localStorage.
 * @param {string} operatorId
 * @returns {'wisadel' | 'shu'}
 */
export const setOperator = (operatorId) => {
  const target = VALID_OPERATORS.includes(operatorId) ? operatorId : DEFAULT_OPERATOR;

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-operator', target);
    // Backward compatibility alias for early references
    document.documentElement.setAttribute('data-persona', target);
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
  cancelDeferredVideoMount();
  if (!video) return;

  try {
    video.pause();
  } catch {
    // Ignore pause errors on already stopped videos
  }

  video.removeAttribute('src');

  while (video.firstChild) {
    video.removeChild(video.firstChild);
  }

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

/**
 * Mount hero media using a two-stage phased mount:
 * Stage 1: Eager static poster mount for instant paint without network contention.
 * Stage 2: Deferred WebM video creation and mount to protect LCP.
 *
 * @param {HTMLElement} container - Stage element to mount media into
 * @param {object} config - Media configuration
 * @param {string} config.poster - Image URL for poster (required for LCP)
 * @param {string} [config.video] - Video URL (alias for videoSrc)
 * @param {string} [config.videoSrc] - WebM video URL
 * @param {boolean} [config.videoReady=false] - Whether video asset is ready
 * @param {string} [config.videoType='video/webm'] - MIME type
 * @param {string} [config.alt='Operator hero illustration'] - Poster alt text
 * @returns {{ posterImg: HTMLImageElement | null, video: HTMLVideoElement | null }}
 */
export const mountHeroMedia = (container, config = {}) => {
  if (!container) return { posterImg: null, video: null };

  cancelDeferredVideoMount();

  // Teardown any existing video currently inside container
  const existingVideo = container.querySelector('video');
  if (existingVideo) {
    teardownVideo(existingVideo);
  }

  container.innerHTML = '';

  let posterImg = null;
  if (config.poster) {
    const picture = document.createElement('picture');
    picture.className = 'hero-poster-picture';
    posterImg = document.createElement('img');
    posterImg.className = 'hero-poster';
    posterImg.src = config.poster;
    posterImg.alt = config.alt || 'Operator hero illustration';
    posterImg.loading = 'eager';
    posterImg.decoding = 'async';
    picture.appendChild(posterImg);
    container.appendChild(picture);
  }

  const videoUrl = config.video || config.videoSrc;
  if (!config.videoReady || !videoUrl || prefersReducedMotion()) {
    return { posterImg, video: null };
  }

  const mountVideo = () => {
    pendingVideoMount = null;
    if (prefersReducedMotion()) return null;
    if (typeof container.isConnected === 'boolean' && !container.isConnected) return null;

    const currentVideo = container.querySelector('video');
    if (currentVideo) {
      teardownVideo(currentVideo);
    }

    const video = document.createElement('video');
    video.className = 'hero-video';
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
    if (config.poster) {
      video.poster = config.poster;
    }

    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = config.videoType || 'video/webm';
    video.appendChild(source);

    const handleMediaError = () => {
      teardownVideo(video);
    };
    video.addEventListener('error', handleMediaError, { once: true });
    source.addEventListener('error', handleMediaError, { once: true });

    video.addEventListener('playing', () => {
      video.classList.add('is-playing');
    }, { once: true });

    container.appendChild(video);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        teardownVideo(video);
      });
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
