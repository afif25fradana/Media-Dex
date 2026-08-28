const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      contain: layout style;
      isolation: isolate;
      --rotation: 0deg;
      --delay: 0ms;
      min-width: 0; /* Prevents grid blowout from long text */
    }
    
    :host(.card-will-animate) {
      opacity: 0;
      transform: translateY(50px) rotate(var(--rotation)) translateZ(0);
    }
    :host(.card-visible) {
      opacity: 1;
      transform: translateY(0) rotate(var(--rotation)) translateZ(0);
      transition: opacity 80ms step-start var(--delay),
                  transform 380ms var(--ease-snap) var(--delay);
    }
    :host(.card-ready) {
      opacity: 1;
      transform: translateY(0) rotate(var(--rotation)) translateZ(0);
      transition: opacity 0.2s var(--ease-snap), transform 0.2s var(--ease-snap);
    }

    .card {
      position: relative;
      background: var(--color-surface-dark, #1A1A20);
      cursor: pointer;
      opacity: 1;
      -webkit-font-smoothing: subpixel-antialiased;
      outline: 1px solid transparent;
      transition: transform 0.2s var(--ease-snap), box-shadow 0.2s var(--ease-snap);
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
      background: rgba(255, 0, 85, 0.4);
      opacity: 0;
      pointer-events: none;
      z-index: 10;
      transition: opacity 0.2s var(--ease-snap);
    }

    .card:hover {
      transform: translateY(-8px) scale(1.05) rotate(0deg) translateZ(0);
      z-index: 20;
      box-shadow: var(--shadow-card-hover, 10px 10px 0 #000, -6px -6px 0 #D80000);
    }

    .card:hover .card-flash {
      opacity: 0.6;
    }

    .card:active {
      transform: translateY(-2px) scale(0.95) rotate(0deg) translateZ(0);
      box-shadow: var(--shadow-card-press, 2px 2px 0 #000, -2px -2px 0 #D80000);
      transition-duration: 60ms;
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none !important;
      }
      .card:hover, .card:active {
        transform: rotate(var(--rotation, 0deg)) translateZ(0) !important;
      }
    }

    .card-cover {
      aspect-ratio: 1;
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
      z-index: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card-cover img.loaded {
      opacity: 1;
    }

    .skeleton {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
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
      /* Text truncation edge case */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-subtitle {
      font-family: var(--font-messy, 'Caveat', cursive);
      font-size: 0.85rem;
      font-weight: 700;
      color: rgba(240, 236, 226, 0.45);
      margin: 0.2rem 0 0 0;
      line-height: 1.3;
      letter-spacing: 0.01em;
      /* Max 2 lines */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>

  <button class="card" aria-label="Media item">
    <div class="card-flash"></div>
    <div class="card-cover">
      <div class="skeleton" aria-hidden="true"></div>
      <img loading="lazy" alt="" />
      <div class="card-placeholder" style="display: none;">
        <div class="fallback-bg"></div>
        <span class="card-placeholder-letter"></span>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title"></h3>
      <p class="card-subtitle"></p>
    </div>
  </button>
`;

export class DexCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'image-src', 'rotation'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
    if (oldValue !== newValue) {
      this._render();
    }
  }

  _render() {
    const title = this.getAttribute('title') || 'Unknown';
    const subtitle = this.getAttribute('subtitle') || '';
    const imageSrc = this.getAttribute('image-src');
    const rotation = this.getAttribute('rotation') || '0';

    this.titleEl.textContent = title;
    this.subtitleEl.textContent = subtitle;
    this.buttonEl.setAttribute('aria-label', `${title}${subtitle ? ', ' + subtitle : ''}`);
    this.buttonEl.style.setProperty('--rotation', `${rotation}deg`);

    if (imageSrc) {
      const newSrc = encodeURI(imageSrc);
      
      // Only set src if it has actually changed to prevent aborting pending loads
      if (this.imgEl.getAttribute('src') !== newSrc) {
        this.imgEl.src = newSrc;
        this.imgEl.alt = `Cover for ${title}`;
        this.imgEl.style.display = '';
        this.placeholderEl.style.display = 'none';
        
        this.imgEl.classList.remove('loaded');
        this.skeletonEl.style.display = 'block';
      }

      // Handle instantly cached images.
      if (this.imgEl.complete) {
        if (this.imgEl.naturalWidth > 0) {
          this._handleImageLoad();
        } else if (this.imgEl.naturalWidth === 0 && this.imgEl.src) {
          this._handleImageError();
        }
      }
    } else {
      this._showFallback(title);
    }
  }

  _handleImageLoad() {
    this.skeletonEl.style.display = 'none';
    this.imgEl.classList.add('loaded');
  }

  _handleImageError() {
    this._showFallback(this.getAttribute('title') || '?');
  }

  _showFallback(title) {
    this.skeletonEl.style.display = 'none';
    this.imgEl.style.display = 'none';
    this.placeholderEl.style.display = 'flex';
    this.letterEl.textContent = title.charAt(0).toUpperCase();
  }
}

customElements.define('dex-card', DexCard);
