import { CATEGORY_ICONS } from '../icons.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: var(--bg-surface, #121318);
    border: 1px solid var(--border-default, rgba(255, 255, 255, 0.14));
    border-radius: var(--radius-card, 0px);
    text-align: center;
    position: relative;
    contain: layout style;
    isolation: isolate;
    min-height: 300px;
    width: 100%;
  }

  .icon-container {
    width: 64px;
    height: 64px;
    background: var(--operator-accent, #D01E25);
    color: var(--ink-inverse, #FAF8F2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-card, 0px);
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .icon-container svg {
    width: 32px;
    height: 32px;
  }

  .message {
    font-family: var(--font-display, 'Anton', sans-serif);
    font-size: 1.5rem;
    line-height: 1.05;
    color: var(--ink-primary, #F2F0EB);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin: 0 0 1.5rem 0;
    position: relative;
    z-index: 1;
  }

  .cta-button {
    appearance: none;
    background: transparent;
    color: var(--ink-primary, #F2F0EB);
    font-family: var(--font-body, 'Schibsted Grotesk', sans-serif);
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.85rem 2rem;
    border: 1px solid var(--border-default, rgba(255, 255, 255, 0.2));
    border-radius: var(--radius-btn, 0px);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
    position: relative;
    z-index: 1;
  }

  .cta-button:hover {
    background: var(--ink-primary, #F0ECE2);
    color: var(--bg-canvas);
    border-color: var(--ink-primary, #F0ECE2);
    transform: translateY(-2px);
  }

  .cta-button:active {
    transform: translateY(1px);
  }

  .cta-button:focus-visible {
    outline: 2px solid var(--operator-accent, #D01E25);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .cta-button {
      transition: none !important;
      transform: none !important;
    }
  }
`);

const template = document.createElement('template');
template.innerHTML = `
  <div class="icon-container"></div>
  <h3 class="message"></h3>
  <button type="button" class="cta-button" style="display: none;"></button>
`;

export class DexEmptyState extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'message', 'action-text'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.iconEl = this.shadowRoot.querySelector('.icon-container');
    this.messageEl = this.shadowRoot.querySelector('.message');
    this.ctaEl = this.shadowRoot.querySelector('.cta-button');

    this._handleActionClick = this._handleActionClick.bind(this);
  }

  connectedCallback() {
    this.ctaEl.addEventListener('click', this._handleActionClick);
    this._render();
  }

  disconnectedCallback() {
    this.ctaEl.removeEventListener('click', this._handleActionClick);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && oldValue !== newValue) {
      this._render();
    }
  }

  _render() {
    const iconKey = this.getAttribute('icon') || 'bookmark';
    const message = this.getAttribute('message') || 'No items found.';
    const actionText = this.getAttribute('action-text');

    this.iconEl.innerHTML = CATEGORY_ICONS[iconKey] || CATEGORY_ICONS.bookmark;
    this.messageEl.textContent = message;

    if (actionText) {
      this.ctaEl.textContent = actionText;
      this.ctaEl.style.display = 'inline-block';
    } else {
      this.ctaEl.style.display = 'none';
    }
  }

  _handleActionClick() {
    this.dispatchEvent(new CustomEvent('action-click', {
      bubbles: true,
      composed: true
    }));
  }
}

if (!customElements.get('dex-empty-state')) {
  customElements.define('dex-empty-state', DexEmptyState);
}
