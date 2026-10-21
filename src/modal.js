function encodeAssetPath(path) {
  if (!path || typeof path !== 'string') return '';
  return path.split('/').map(encodeURIComponent).join('/');
}

import { esc, CLOSE_ICON_SVG } from './ui.js';

let activeModal = null;

function formatDate(dateAdded) {
  if (!dateAdded) return '';
  const d = new Date(dateAdded);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function openDetailModal(item) {
  if (!item || activeModal) return;

  const previouslyFocused = document.activeElement;
  const title = item.title || 'Unknown';
  const subtitle = item.subtitle || '';
  const category = item.categoryTitle || '';
  const dateStr = formatDate(item.dateAdded);

  const dialog = document.createElement('dialog');
  dialog.className = 'dex-modal-dialog';
  if (item.categoryId) dialog.setAttribute('data-category', item.categoryId);
  dialog.setAttribute('aria-labelledby', 'dex-modal-title');
  if (subtitle) dialog.setAttribute('aria-describedby', 'dex-modal-sub');

  let coverHTML;
  if (item.image) {
    coverHTML = `<div class="dex-modal-cover"><img src="${esc(encodeAssetPath(item.image))}" alt="Cover for ${esc(title)}"></div>`;
  } else {
    coverHTML = `<div class="dex-modal-cover dex-modal-cover--empty"><span class="dex-modal-letter">${esc((title.charAt(0) || '?').toUpperCase())}</span></div>`;
  }

  dialog.innerHTML = `
    <div class="dex-modal">
      <button class="dex-modal-close" aria-label="Close details">${CLOSE_ICON_SVG}</button>
      ${coverHTML}
      <div class="dex-modal-body">
        ${category ? `<span class="dex-modal-tag">${esc(category)}</span>` : ''}
        <h2 id="dex-modal-title" class="dex-modal-title">${esc(title)}</h2>
        ${subtitle ? `<p id="dex-modal-sub" class="dex-modal-sub">${esc(subtitle)}</p>` : ''}
        <dl class="dex-modal-meta">
          ${dateStr ? `<div><dt>Added</dt><dd>${esc(dateStr)}</dd></div>` : ''}
          ${category ? `<div><dt>Category</dt><dd>${esc(category)}</dd></div>` : ''}
        </dl>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  const currentScrollY = window.scrollY;
  dialog.showModal();
  if (window.scrollY !== currentScrollY) {
    window.scrollTo({ top: currentScrollY, behavior: 'instant' });
  }
  activeModal = dialog;
  const closeBtn = dialog.querySelector('.dex-modal-close');
  if (closeBtn) closeBtn.focus();

  let isClosing = false;
  const close = () => {
    if (isClosing) return;
    isClosing = true;
    dialog.classList.remove('is-open');

    const finish = () => {
      if (dialog.open) {
        dialog.close();
      }
      dialog.remove();
      activeModal = null;
      if (previouslyFocused) {
        if (previouslyFocused.shadowRoot) {
          const inner = previouslyFocused.shadowRoot.querySelector('.card') || previouslyFocused;
          if (inner && inner.focus) inner.focus({ preventScroll: true });
        } else if (previouslyFocused.focus) {
          previouslyFocused.focus({ preventScroll: true });
        }
      }
    };

    setTimeout(finish, 150);
  };

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });

  dialog.addEventListener('click', (e) => {
    if (!e.target.closest('.dex-modal')) {
      close();
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', close);

  requestAnimationFrame(() => {
    dialog.classList.add('is-open');
  });
}
