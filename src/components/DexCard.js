import { encodeAssetPath } from '../utils.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    display: block;
    contain: layout style;
    isolation: isolate;
    --rotation: 0deg;
    --delay: 0ms;
    min-width: 0; /* Prevents grid blowout from long text */
  }

  :host([category="music"]) {
    --card-cover-ratio: 1 / 1;
  }
  :host([category="manga-manhwa"]), :host([category="manhwa"]) {
    --card-cover-ratio: 3 / 4;
  }
  :host([category="movies-tv"]), :host([category="movietv"]), :host([category="games"]) {
    --card-cover-ratio: 2 / 3;
  }
  
  :host(.card-will-animate) {
    opacity: 0;
    transform: translateY(50px) rotate(var(--rotation)) translateZ(0);
  }
  :host(.card-visible) {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotation)) translateZ(0);
    transition: opacity 80ms step-start var(--delay),
                transform 340ms cubic-bezier(0.15, 0.85, 0.35, 1.15) var(--delay);
  }
  :host(.card-ready) {
    opacity: 1;
    transform: translateY(0) rotate(var(--rotation)) translateZ(0);
    transition: opacity 0.2s var(--ease-snap, ease), transform 0.2s var(--ease-snap, ease);
  }

  .card {
    position: relative;
    background: var(--color-surface-dark, #1A1A20);
    cursor: pointer;
    opacity: 1;
    -webkit-font-smoothing: subpixel-antialiased;
    outline: 1px solid transparent;
    transition: transform 0.2s var(--ease-snap, ease), box-shadow 0.2s var(--ease-snap, ease);
    border: 3px solid #000;
    box-shadow: var(--shadow-card, 6px 6px 0 #000, -4px -4px 0 #D80000);
    
    text-align: left;
    padding: 0;
    appearance: none;
    font-family: inherit;
    color: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-width: 0;

    transform: rotate(var(--rotation, 0deg)) translateZ(0);
  }
  
  .card:focus-visible {
    outline: 4px solid var(--red, #D80000);
    outline-offset: 4px;
  }

  .card-cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(0, 0, 0, 0.4) 15%, transparent 16%);
    background-size: 6px 6px;
    opacity: 1;
    pointer-events: none;
    z-index: 5;
  }

  .card-flash {
    position: absolute;
    inset: 0;
    background: rgba(216, 0, 0, 0.4);
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.18s var(--ease-snap, ease);
  }

  .card:hover {
    transform: translateY(-8px) scale(1.04) rotate(0deg) translateZ(0);
    z-index: 20;
    box-shadow: var(--shadow-card-hover, 10px 10px 0 #000, -6px -6px 0 #D80000);
  }

  .card:hover .card-flash {
    opacity: 0.6;
  }

  .card:active {
    transform: translateY(-2px) scale(0.96) rotate(0deg) translateZ(0);
    box-shadow: var(--shadow-card-press, 2px 2px 0 #000, -2px -2px 0 #D80000);
    transition-duration: 60ms;
  }

  @media (prefers-reduced-motion: reduce) {
    :host,
    :host(.card-will-animate),
    :host(.card-visible),
    :host(.card-ready) {
      transition: none !important;
      opacity: 1 !important;
      transform: rotate(var(--rotation, 0deg)) translateZ(0) !important;
    }
    .card {
      transition: none !important;
    }
    .card:hover, .card:active {
      transform: rotate(var(--rotation, 0deg)) translateZ(0) !important;
    }
    .card-flash {
      transition: none !important;
      opacity: 0 !important;
    }
    .skeleton {
      animation: none !important;
    }
  }

  .card-cover {
    aspect-ratio: var(--card-cover-ratio, 2 / 3);
    overflow: hidden;
    border-bottom: 3px solid #000;
    position: relative;
    background: var(--black, #0C0C0C);
  }

  .card-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card-cover img.loaded {
    opacity: 1;
  }

  .skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, var(--skeleton-base, #333) 25%, var(--skeleton-shine, #444) 50%, var(--skeleton-base, #333) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    z-index: 1;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .card-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 0;
  }

  .card-placeholder-letter {
    font-family: var(--font-display, 'Anton', sans-serif);
    font-size: 4rem;
    color: var(--white, #FFFFFF);
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
    position: relative;
    z-index: 2;
    line-height: 1;
  }
  
  .fallback-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--red, #D80000) 0%, var(--black, #0C0C0C) 100%);
    z-index: 0;
  }

  .card-info {
    padding: 0.7rem 0.75rem;
    background: var(--color-surface-dark, #1A1A20);
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-title {
    font-family: var(--font-display, 'Anton', sans-serif);
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.2;
    color: var(--color-text-on-dark, #F0ECE2);
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: auto;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-subtitle {
    font-family: var(--font-body, sans-serif);
    font-size: 0.72rem;
    color: var(--color-text-muted-on-dark, rgba(240, 236, 226, 0.7));
    margin: 0.2rem 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
`);

const template = document.createElement('template');
template.innerHTML = `
  <button class="card" type="button">
    <div class="card-flash" aria-hidden="true"></div>
    <div class="card-cover">
      <div class="skeleton" aria-hidden="true"></div>
      <img loading="lazy" alt="" />
      <div class="card-placeholder" style="display: none;">
        <div class="fallback-bg"></div>
        <span class="card-placeholder-letter"></span>
      </div>
    </div>
    <div class="card-info">
      <span class="card-title"></span>
      <span class="card-subtitle"></span>
    </div>
  </button>
`;

export class DexCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'image-src', 'rotation', 'category'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.buttonEl = this.shadowRoot.querySelector('.card');
    this.imgEl = this.shadowRoot.querySelector('img');
    this.skeletonEl = this.shadowRoot.querySelector('.skeleton');
    this.titleEl = this.shadowRoot.querySelector('.card-title');
    this.subtitleEl = this.shadowRoot.querySelector('.card-subtitle');
    this.placeholderEl = this.shadowRoot.querySelector('.card-placeholder');
    this.letterEl = this.shadowRoot.querySelector('.card-placeholder-letter');

    this._handleImageLoad = this._handleImageLoad.bind(this);
    this._handleImageError = this._handleImageError.bind(this);
  }

  connectedCallback() {
    this.imgEl.addEventListener('load', this._handleImageLoad);
    this.imgEl.addEventListener('error', this._handleImageError);
    this._render();
  }

  disconnectedCallback() {
    this.imgEl.removeEventListener('load', this._handleImageLoad);
    this.imgEl.removeEventListener('error', this._handleImageError);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && oldValue !== newValue) {
      this._render();
    }
  }

  _render() {
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const imageSrc = this.getAttribute('image-src') || '';
    const rotation = this.getAttribute('rotation') || '0deg';

    this.style.setProperty('--rotation', rotation);

    this.titleEl.textContent = title;
    this.subtitleEl.textContent = subtitle;
    
    const ariaLabel = subtitle ? `${title}, ${subtitle}` : title;
    this.buttonEl.setAttribute('aria-label', ariaLabel);

    if (imageSrc) {
      const encodedSrc = encodeAssetPath(imageSrc);
      if (this.imgEl.getAttribute('src') !== encodedSrc) {
        this.skeletonEl.style.display = 'block';
        this.placeholderEl.style.display = 'none';
        this.imgEl.classList.remove('loaded');
        this.imgEl.style.display = 'block';
        this.imgEl.src = encodedSrc;

        // If image was already cached by browser, load event might have fired synchronously
        if (this.imgEl.complete && this.imgEl.naturalWidth > 0) {
          this._handleImageLoad();
        }
      }
    } else {
      this._showPlaceholder(title);
    }
  }

  _handleImageLoad() {
    this.skeletonEl.style.display = 'none';
    this.imgEl.classList.add('loaded');
    this.placeholderEl.style.display = 'none';
  }

  _handleImageError() {
    this._showPlaceholder(this.getAttribute('title') || '');
  }

  _showPlaceholder(title) {
    this.skeletonEl.style.display = 'none';
    this.imgEl.style.display = 'none';
    this.imgEl.classList.remove('loaded');
    this.placeholderEl.style.display = 'flex';
    
    const firstLetter = (title.trim()[0] || '?').toUpperCase();
    this.letterEl.textContent = firstLetter;
  }

  /**
   * Dismiss the loading state manually (e.g. timeout or forced show)
   */
  dismissLoading() {
    this.classList.remove('card-will-animate');
    this.classList.add('card-ready');
    if (!this.imgEl.classList.contains('loaded')) {
      this._showPlaceholder(this.getAttribute('title') || '');
    }
  }
}

if (!customElements.get('dex-card')) {
  customElements.define('dex-card', DexCard);
}
