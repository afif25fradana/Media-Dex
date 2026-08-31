import { esc } from './ui.js';

const CLOSE_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

let activeModal = null;

function formatDate(dateAdded) {
  if (!dateAdded) return '';
  const d = new Date(dateAdded);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function openDetailModal(item) {
  if (!item || activeModal) return;

  const previouslyFocused = document.activeElement;
  const title = item.title || 'Unknown';
  const subtitle = item.subtitle || '';
  const category = item.categoryTitle || '';
  const dateStr = formatDate(item.dateAdded);
  const tagLabel = (category || '').split(' ')[0];

  const overlay = document.createElement('div');
  overlay.className = 'dex-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'dex-modal-title');

  let coverHTML;
  if (item.image) {
    coverHTML = `<div class="dex-modal-cover"><img src="${esc(encodeURI(item.image))}" alt="Cover for ${esc(title)}"></div>`;
  } else {
    coverHTML = `<div class="dex-modal-cover dex-modal-cover--empty"><span class="dex-modal-letter">${esc((title.charAt(0) || '?').toUpperCase())}</span></div>`;
  }

  overlay.innerHTML = `
    <div class="dex-modal" role="document" tabindex="-1">
      <button class="dex-modal-close" aria-label="Close details">${CLOSE_ICON_SVG}</button>
      ${coverHTML}
      <div class="dex-modal-body">
        ${category ? `<span class="dex-modal-tag">${esc(category)}</span>` : ''}
        <h2 id="dex-modal-title" class="dex-modal-title">${esc(title)}</h2>
        ${subtitle ? `<p class="dex-modal-sub">${esc(subtitle)}</p>` : ''}
        <dl class="dex-modal-meta">
          ${dateStr ? `<div><dt>Added</dt><dd>${esc(dateStr)}</dd></div>` : ''}
          ${tagLabel ? `<div><dt>Entry</dt><dd>${esc(tagLabel)}</dd></div>` : ''}
        </dl>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  activeModal = overlay;

  const close = () => {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    overlay.remove();
    activeModal = null;
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  };

  function onKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = overlay.querySelectorAll('.dex-modal-close, .dex-modal');
      if (focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  document.addEventListener('keydown', onKeydown);

  const closeBtn = overlay.querySelector('.dex-modal-close');
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    closeBtn.focus();
  });
}
