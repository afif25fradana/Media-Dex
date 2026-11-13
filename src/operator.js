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

// Listen for dynamic changes to the user's motion preference
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
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
    } else if (typeof motionMql.addListener === 'function') {
      motionMql.addListener(onMotionChange);
    }
  } catch {
    // Ignore environments where matchMedia is restricted
  }
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

/**
 * Complete video teardown protocol to release hardware/GPU decoder buffers.
 * @param {HTMLVideoElement | null} video
 */
export const teardownVideo = (video) => {
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
 * Mount hero media (static WebP poster + progressive WebM video).
 * Handles autoplay rejections gracefully, respects reduced motion,
 * and guards against mounting non-ready video assets (videoReady === true).
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

  // Hero Video Asset 404 Prevention:
  // Only attempt to mount the <video> element if video URL is present, videoReady is strictly true,
  // and the user has not requested reduced motion.
  const videoUrl = config.video || config.videoSrc;
  if (!config.videoReady || !videoUrl || prefersReducedMotion()) {
    return { posterImg, video: null };
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
  video.preload = 'auto';
  if (config.poster) {
    video.poster = config.poster;
  }

  const source = document.createElement('source');
  source.src = videoUrl;
  source.type = config.videoType || 'video/webm';
  video.appendChild(source);

  // Transition video opacity when playing to prevent black frames
  video.addEventListener('playing', () => {
    video.classList.add('is-playing');
  }, { once: true });

  container.appendChild(video);

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked by browser policy (NotAllowedError) or Low Power Mode.
      // Gracefully teardown the video and retain the pristine static poster.
      teardownVideo(video);
    });
  }

  return { posterImg, video };
};
