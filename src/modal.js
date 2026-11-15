import { encodeAssetPath, esc, sanitizeUrl } from './utils.js';
import { CLOSE_ICON_SVG, SOCIAL_ICONS } from './icons.js';
import { prefersReducedMotion } from './motion.js';

let activeModal = null;
let activeCloseCleanup = null;
let activeCloseFn = null;

function formatDate(dateAdded) {
  if (!dateAdded) return '';
  const d = new Date(dateAdded);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function closeDetailModal() {
  if (typeof activeCloseFn === 'function') {
    activeCloseFn();
  } else if (typeof activeCloseCleanup === 'function') {
    activeCloseCleanup();
  }
}

export function openDetailModal(item) {
  if (!item) return;
  if (activeCloseCleanup) {
    activeCloseCleanup();
  }
  if (activeModal) return;

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
  let closeTimerId = null;

  const finish = () => {
    if (closeTimerId !== null) {
      clearTimeout(closeTimerId);
      closeTimerId = null;
    }
    activeCloseCleanup = null;
    activeCloseFn = null;
    if (dialog.open) {
      dialog.close();
    }
    dialog.remove();
    if (activeModal === dialog) {
      activeModal = null;
    }
    if (previouslyFocused) {
      if (previouslyFocused.shadowRoot) {
        const inner = previouslyFocused.shadowRoot.querySelector('.card') || previouslyFocused;
        if (inner && inner.focus) inner.focus({ preventScroll: true });
      } else if (previouslyFocused.focus) {
        previouslyFocused.focus({ preventScroll: true });
      }
    }
  };

  const close = () => {
    if (isClosing) return;
    isClosing = true;
    dialog.classList.remove('is-open');

    activeCloseCleanup = finish;
    if (prefersReducedMotion()) {
      finish();
    } else {
      closeTimerId = setTimeout(finish, 200);
    }
  };

  activeCloseFn = close;

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

export function openProfileModal(profile, socials) {
  if (!profile) return;
  if (activeCloseCleanup) activeCloseCleanup();
  if (activeModal) return;

  const previouslyFocused = document.activeElement;
  const name = profile.name || 'Curator';
  const handle = profile.handle || '';
  const tagline = profile.tagline || '';
  const bio = profile.bio || '';
  const currently = profile.currently || '';
  const location = profile.location || 'Solo, ID';
  const links = Array.isArray(profile.links) ? profile.links : [];
  const socialList = Array.isArray(socials) ? socials : [];
  const initialLetter = esc((name.charAt(0) || 'F').toUpperCase());
  const avatarSrc = profile.avatar || 'Asset/Profile/wisadel-poster.webp';
  const formattedAvatar = /^https?:\/\//i.test(avatarSrc) ? avatarSrc : encodeAssetPath(avatarSrc);

  const dialog = document.createElement('dialog');
  dialog.className = 'dex-modal-dialog dex-modal-dialog--profile';
  dialog.setAttribute('aria-labelledby', 'profile-modal-name');
  if (tagline) dialog.setAttribute('aria-describedby', 'profile-modal-tagline');

  dialog.innerHTML = `
    <div class="dex-modal dex-modal--profile">
      <button class="dex-modal-close" aria-label="Close profile">${CLOSE_ICON_SVG}</button>
      <div class="dex-modal-body dex-modal-body--profile">
        <div class="profile-modal-header">
          <div class="profile-avatar-slot">
            <div class="profile-avatar-fallback" aria-hidden="true">
              <span>${initialLetter}</span>
            </div>
            <img class="profile-avatar-img"
                 src="${esc(sanitizeUrl(formattedAvatar))}"
                 alt="Curator avatar for ${esc(name)}"
                 width="72"
                 height="72"
                 loading="eager"
                 referrerpolicy="no-referrer"
                 onerror="this.style.display='none'" />
          </div>
          <div class="profile-modal-identity">
            <div class="profile-modal-badges">
              ${handle ? `<span class="profile-modal-handle">${esc(handle)}</span>` : ''}
              <span class="profile-modal-badge">${esc(location.toUpperCase())}</span>
            </div>
            <h2 id="profile-modal-name" class="profile-modal-name">${esc(name)}</h2>
            ${tagline ? `<p id="profile-modal-tagline" class="profile-modal-tagline">${esc(tagline)}</p>` : ''}
          </div>
        </div>

        ${bio ? `<div class="profile-modal-section"><p class="profile-modal-bio">${esc(bio)}</p></div>` : ''}

        ${currently ? `
          <div class="profile-modal-section profile-modal-currently">
            <span class="profile-currently-label">CURRENTLY //</span>
            <p class="profile-currently-text">${esc(currently)}</p>
          </div>
        ` : ''}

        ${links.length > 0 ? `
          <div class="profile-modal-section">
            <h3 class="profile-section-title">LINKS</h3>
            <div class="profile-modal-links">
              ${links.map(l => `
                <a href="${esc(sanitizeUrl(l.url))}" class="profile-modal-link" target="_blank" rel="noopener noreferrer">
                  ${esc(l.label)} ↗
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${socialList.length > 0 ? `
          <div class="profile-modal-section profile-modal-socials">
            <h3 class="profile-section-title">PROFILES &amp; SOCIALS</h3>
            <div class="profile-social-chips">
              ${socialList.map(s => `
                <a href="${esc(sanitizeUrl(s.url))}" class="profile-social-chip" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.label || s.platform)}">
                  ${SOCIAL_ICONS[s.platform] ? `<span class="profile-social-chip-icon" aria-hidden="true">${SOCIAL_ICONS[s.platform]}</span>` : ''}
                  <span>${esc(s.label || s.platform)}</span> ↗
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
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
  let closeTimerId = null;
  let pointerDownInside = false;

  const finish = () => {
    if (closeTimerId !== null) {
      clearTimeout(closeTimerId);
      closeTimerId = null;
    }
    activeCloseCleanup = null;
    activeCloseFn = null;
    if (dialog.open) {
      dialog.close();
    }
    dialog.remove();
    if (activeModal === dialog) {
      activeModal = null;
    }
    if (previouslyFocused && previouslyFocused.isConnected && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus({ preventScroll: true });
    } else {
      document.getElementById('heroProfileBtn')?.focus({ preventScroll: true });
    }
  };

  const close = () => {
    if (isClosing) return;
    isClosing = true;
    dialog.classList.remove('is-open');
    activeCloseCleanup = finish;
    if (prefersReducedMotion()) {
      finish();
    } else {
      closeTimerId = setTimeout(finish, 200);
    }
  };

  activeCloseFn = close;

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });

  dialog.addEventListener('pointerdown', (e) => {
    pointerDownInside = Boolean(e.target.closest('.dex-modal'));
  });

  dialog.addEventListener('click', (e) => {
    if (pointerDownInside) {
      pointerDownInside = false;
      return;
    }
    if (!e.target.closest('.dex-modal')) {
      close();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  requestAnimationFrame(() => {
    dialog.classList.add('is-open');
  });
}

