import { CATEGORY_ICONS } from '../ui.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      background: var(--color-surface-dark, #1A1A20);
      border: 3px solid var(--color-border-dark, #3A3A42);
      border-radius: 4px;
      text-align: center;
      position: relative;
      contain: layout style;
      isolation: isolate;
      min-height: 300px;
      width: 100%;
    }

    :host::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255, 255, 255, 0.05) 15%, transparent 16%);
      background-size: 6px 6px;
      pointer-events: none;
      z-index: 0;
    }

    .icon-container {
      width: 64px;
      height: 64px;
      background: var(--red, #FF0000);
      color: var(--white, #FFFFFF);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(4deg);
      clip-path: polygon(5% 0%, 100% 5%, 95% 100%, 0% 95%);
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
      box-shadow: inset 0px 4px 10px rgba(0, 0, 0, 0.4);
    }
    
    .icon-container svg {
      width: 32px;
      height: 32px;
    }

    .message {
      font-family: var(--font-display, 'Anton', sans-serif);
      font-size: 1.5rem;
      color: var(--color-text-on-dark, #F0ECE2);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin: 0 0 1.5rem 0;
      position: relative;
      z-index: 1;
    }

    .cta-button {
      appearance: none;
      background: transparent;
      color: var(--color-text-on-dark, #F0ECE2);
      font-family: var(--font-body, 'Inter', sans-serif);
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.85rem 2rem;
      border: 2px solid var(--color-text-on-dark, #F0ECE2);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
      position: relative;
      z-index: 1;
    }

    .cta-button:hover {
      background: var(--color-text-on-dark, #F0ECE2);
      color: var(--black, #0C0C0C);
      transform: translateY(-2px);
    }

    .cta-button:active {
      transform: translateY(1px);
    }
  </style>

  <div class="icon-container"></div>
  <h3 class="message"></h3>
  <button class="cta-button" style="display: none;"></button>
`;

export class DexEmptyState extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'message', 'action-text'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
    if (oldValue !== newValue) {
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

customElements.define('dex-empty-state', DexEmptyState);
