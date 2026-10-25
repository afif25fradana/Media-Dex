/**
 * src/utils.js
 * Pure utility functions for Media-Dex: asset encoding, string escaping,
 * WHATWG URL sanitization, and deterministic UTC date sorting.
 */

export function encodeAssetPath(path) {
  if (!path || typeof path !== 'string') return '';
  return path.split('/').map(encodeURIComponent).join('/');
}

const ESC_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
};

export function esc(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, c => ESC_MAP[c]);
}

/**
 * Validates and sanitizes external URLs to prevent DOM XSS (e.g. javascript:, data:, vbscript:).
 * Conforms to WHATWG URL parsing and OWASP URL validation standards.
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  try {
    const parsed = new URL(url.trim());
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (allowedProtocols.includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch (_) {
    // Malformed, relative, or dangerous scheme
  }
  return '#';
}

/**
 * Deterministic ISO 8601 UTC date sorting with null/empty safety.
 * Empty or unparseable dates are permanently pinned to the bottom of the list
 * in both descending (newest first) and ascending (oldest first) orders.
 */
export function sortItemsByDate(items, direction = 'desc') {
  if (!Array.isArray(items)) return [];
  const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

  return [...items].sort((a, b) => {
    let valA = null;
    let valB = null;

    if (a && typeof a.dateAdded === 'string') {
      const strA = a.dateAdded.trim();
      if (strA) {
        valA = ISO_DATE_REGEX.test(strA)
          ? Date.parse(`${strA}T00:00:00.000Z`)
          : Date.parse(strA);
      }
    }

    if (b && typeof b.dateAdded === 'string') {
      const strB = b.dateAdded.trim();
      if (strB) {
        valB = ISO_DATE_REGEX.test(strB)
          ? Date.parse(`${strB}T00:00:00.000Z`)
          : Date.parse(strB);
      }
    }

    const validA = valA !== null && !Number.isNaN(valA);
    const validB = valB !== null && !Number.isNaN(valB);

    // Items with missing/invalid dates are ALWAYS pinned to the bottom
    if (!validA && !validB) return 0;
    if (!validA) return 1;
    if (!validB) return -1;

    return direction === 'desc' ? valB - valA : valA - valB;
  });
}
