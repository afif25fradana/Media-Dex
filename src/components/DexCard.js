import { encodeAssetPath } from '../utils.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    display: block;
    contain: layout style;
    isolation: isolate;
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
    transform: translateY(50px) translateZ(0);
  }
  :host(.card-visible) {
    opacity: 1;
    transform: translateY(0) translateZ(0);
    transition: opacity 80ms step-start var(--delay),
                transform 340ms cubic-bezier(0.15, 0.85, 0.35, 1.15) var(--delay);
  }
  :host(.card-ready) {
    opacity: 1;
    transform: translateY(0) translateZ(0);
    transition: opacity 0.2s var(--ease-snap, ease), transform 0.2s var(--ease-snap, ease);
  }

  .card {
    position: relative;
    background: var(--bg-surface, #121318);
    cursor: pointer;
    opacity: 1;
    -webkit-font-smoothing: subpixel-antialiased;
    outline: 1px solid transparent;
    transition: transform 0.2s var(--ease-snap, ease), box-shadow 0.2s var(--ease-snap, ease);
    border: 1px solid var(--border-default, rgba(255, 255, 255, 0.14));
    border-radius: var(--radius-card, 0px);
    overflow: hidden;
    box-shadow: var(--shadow-card, 0 4px 16px -2px rgba(0, 0, 0, 0.5));
    
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
  }
  
  .card:focus-visible {
    outline: 2px solid var(--operator-accent, #D01E25);
    outline-offset: 2px;
  }

  .card-flash {
    position: absolute;
    inset: 0;
    background: var(--card-flash-bg, rgba(208, 30, 37, 0.35));
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    transition: opacity 0.18s var(--ease-snap, ease);
  }

  .card:hover {
    transform: translateY(-2px);
    z-index: 20;
    box-shadow: var(--shadow-card-hover, 0 12px 32px -4px rgba(0, 0, 0, 0.7));
  }

  .card:hover .card-flash {
    opacity: 0.6;
  }

  .card:hover .card-img,
  .card:hover .card-cover img {
    transform: scale(1.025);
  }

  .card:active {
    transform: translateY(0);
    box-shadow: var(--shadow-card-press, 0 2px 6px rgba(0, 0, 0, 0.6));
    transition-duration: 60ms;
  }

  @media (prefers-reduced-motion: reduce) {
    :host,
    :host(.card-will-animate),
    :host(.card-visible),
    :host(.card-ready) {
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .card {
      transition: none !important;
      transform: none !important;
    }
    .card:hover, .card:active {
      transform: none !important;
      transition: none !important;
    }
    .card-cover img,
    .card-img,
    .card:hover .card-cover img,
    .card:hover .card-img {
      transform: none !important;
      transition: none !important;
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
    border-bottom: 1px solid var(--border-default, rgba(255, 255, 255, 0.14));
    position: relative;
    background: var(--black, #0C0C0C);
  }

  .card-cover img,
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: relative;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease, transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card-cover img.loaded,
  .card-img.loaded {
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
    background: linear-gradient(135deg, var(--operator-accent, #D01E25) 0%, var(--bg-canvas, #090A0D) 100%);
    z-index: 0;
  }

  .card-info {
    padding: 0.7rem 0.75rem;
    background: var(--bg-surface, #121318);
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
    color: var(--ink-primary, #F2F0EB);
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
    color: var(--ink-secondary, #A6A49F);
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
      <img class="card-img" loading="lazy" alt="" />
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

    this.style.setProperty('--rotation', '0deg');

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
}

if (!customElements.get('dex-card')) {
  customElements.define('dex-card', DexCard);
}
