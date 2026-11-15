import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Load src/utils.js as an ES module via data URL so Node runs it without needing package.json
const utilsSource = fs.readFileSync(path.join(rootDir, 'src/utils.js'), 'utf8');
const utilsModuleUrl = `data:text/javascript;base64,${Buffer.from(utilsSource).toString('base64')}`;
const { encodeAssetPath, esc, sanitizeUrl, sortItemsByDate } = await import(utilsModuleUrl);

test('sanitizeUrl blocks dangerous XSS protocols and preserves valid http/https/mailto URLs', () => {
  assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
  assert.equal(sanitizeUrl('  javascript:alert(document.cookie)  '), '#');
  assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '#');
  assert.equal(sanitizeUrl('vbscript:msgbox(1)'), '#');
  assert.equal(sanitizeUrl(''), '#');
  assert.equal(sanitizeUrl(null), '#');
  assert.equal(sanitizeUrl('https://github.com/afif25fradana'), 'https://github.com/afif25fradana');
  assert.equal(sanitizeUrl('mailto:user@example.com'), 'mailto:user@example.com');
});

test('esc escapes all five HTML special characters and handles nullish inputs', () => {
  assert.equal(esc('<script src="x">&\'</script>'), '&lt;script src=&quot;x&quot;&gt;&amp;&#039;&lt;/script&gt;');
  assert.equal(esc(null), '');
  assert.equal(esc(undefined), '');
});

test('encodeAssetPath encodes special characters per path segment while keeping slashes', () => {
  assert.equal(
    encodeAssetPath('Asset/Music/Papparazi(Dubstep)-Alximo.webp'),
    'Asset/Music/Papparazi(Dubstep)-Alximo.webp'
  );
  assert.equal(encodeAssetPath('Asset/Games/My Game #1.webp'), 'Asset/Games/My%20Game%20%231.webp');
  assert.equal(encodeAssetPath(''), '');
});

test('sortItemsByDate sorts deterministically and pins missing/invalid dates to the bottom in both directions', () => {
  const sample = [
    { title: 'NoDate', dateAdded: '' },
    { title: 'Old', dateAdded: '2026-01-19' },
    { title: 'Invalid', dateAdded: 'not-a-date' },
    { title: 'New', dateAdded: '2026-10-25' }
  ];

  const desc = sortItemsByDate(sample, 'desc');
  assert.deepEqual(desc.map(i => i.title), ['New', 'Old', 'NoDate', 'Invalid']);

  const asc = sortItemsByDate(sample, 'asc');
  assert.deepEqual(asc.map(i => i.title), ['Old', 'New', 'NoDate', 'Invalid']);
});

test('data.json schema and asset existence on disk', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'data.json'), 'utf8');
  const data = JSON.parse(raw);

  assert.ok(data.profile && typeof data.profile.name === 'string');
  assert.ok(Array.isArray(data.categories) && data.categories.length === 4);
  assert.ok(data.lastfm && typeof data.lastfm.apiKey === 'string');

  // Verify every referenced image exists on disk
  if (data.profile.heroImage) {
    assert.ok(fs.existsSync(path.join(rootDir, data.profile.heroImage)), `Missing heroImage: ${data.profile.heroImage}`);
  }
  let totalItems = 0;
  for (const cat of data.categories) {
    for (const item of cat.items || []) {
      totalItems++;
      if (item.image) {
        assert.ok(fs.existsSync(path.join(rootDir, item.image)), `Missing item asset: ${item.image}`);
      }
    }
  }
  assert.equal(totalItems, 54, 'data.json should contain exactly 54 catalog items');
});

test('data.json profile.operators schema, videoReady, video and poster integrity on disk', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'data.json'), 'utf8');
  const data = JSON.parse(raw);

  assert.ok(data.profile?.operators && typeof data.profile.operators === 'object', 'profile.operators must be an object');
  assert.ok(data.profile.operators.wisadel, 'profile.operators must contain wisadel');
  assert.ok(data.profile.operators.shu, 'profile.operators must contain shu');

  const requiredFields = ['id', 'displayName', 'code', 'tagline', 'quote', 'video', 'poster', 'alt'];
  const operators = data.profile.operators;

  for (const [key, op] of Object.entries(operators)) {
    assert.ok(op && typeof op === 'object', `operator ${key} must be an object`);
    for (const field of requiredFields) {
      assert.equal(typeof op[field], 'string', `operator ${key}.${field} must be a string`);
      assert.ok(op[field].length > 0, `operator ${key}.${field} must not be empty`);
    }

    assert.equal(op.videoReady, true, `operator ${key}.videoReady must be true`);

    assert.ok(op.video.endsWith('.webm'), `operator ${key}.video must be a .webm file`);
    const videoPath = path.join(rootDir, op.video);
    assert.ok(fs.existsSync(videoPath), `Missing video asset for operator ${key}: ${op.video}`);
    assert.ok(fs.statSync(videoPath).size > 1024, `video asset for operator ${key} must be > 1KB`);

    assert.ok(op.poster.endsWith('.webp'), `operator ${key}.poster must be a .webp file`);
    const posterPath = path.join(rootDir, op.poster);
    assert.ok(fs.existsSync(posterPath), `Missing poster asset for operator ${key}: ${op.poster}`);
    assert.ok(fs.statSync(posterPath).size > 1024, `poster asset for operator ${key} must be > 1KB`);
  }

  const posterPaths = Object.values(operators).map(op => op.poster);
  const distinctPosters = new Set(posterPaths);
  assert.equal(
    distinctPosters.size,
    Object.keys(operators).length,
    'Each operator must have a distinct poster asset'
  );
});

test('modularized stylesheets exist, are non-empty, and contain zero @import rules', () => {
  const modularStylesheets = [
    'src/styles/tokens.css',
    'src/styles/base.css',
    'src/styles/sections.css'
  ];

  for (const relPath of modularStylesheets) {
    const fullPath = path.join(rootDir, relPath);
    assert.ok(fs.existsSync(fullPath), `Stylesheet must exist: ${relPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Stylesheet must not be empty: ${relPath}`);

    const content = fs.readFileSync(fullPath, 'utf8');
    assert.doesNotMatch(
      content,
      /@import\b/,
      `Stylesheet ${relPath} must not contain @import rules to avoid loading waterfalls`
    );
  }
});

test('legacy monolithic stylesheet src/style.css does not exist on disk', () => {
  const legacyPath = path.join(rootDir, 'src/style.css');
  assert.equal(
    fs.existsSync(legacyPath),
    false,
    'legacy src/style.css must not exist on disk'
  );
});

test('index.html platform meta tags and head bootstrap operator synchronization', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.match(
    html,
    /<meta\s+name=["']theme-color["']\s+content=["'][^"']+["']\s*\/?>/i,
    'index.html must declare a theme-color meta tag'
  );
  assert.match(
    html,
    /<meta\s+name=["']color-scheme["']\s+content=["'][^"']+["']\s*\/?>/i,
    'index.html must declare a color-scheme meta tag'
  );

  const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
  assert.ok(headMatch, 'index.html must contain a <head> element');
  const head = headMatch[1];

  assert.match(head, /localStorage\.getItem\(['"]media-dex-operator['"]\)/, 'Bootstrap script must read media-dex-operator');
  assert.match(head, /setAttribute\(['"]data-operator['"]/, 'Bootstrap script must set data-operator attribute');
  assert.match(head, /querySelector\(['"]meta\[name=["']theme-color["']\]['"]\)/, 'Bootstrap script must query theme-color meta');
  assert.match(head, /querySelector\(['"]meta\[name=["']color-scheme["']\]['"]\)/, 'Bootstrap script must query color-scheme meta');

  assert.match(head, /#090A0D/i, 'Bootstrap script must define Wisadel dark theme-color (#090A0D)');
  assert.match(head, /#F5F2EB/i, 'Bootstrap script must define Shu light theme-color (#F5F2EB)');
  assert.match(head, /'dark'|"dark"/, 'Bootstrap script must define dark color-scheme');
  assert.match(head, /'light'|"light"/, 'Bootstrap script must define light color-scheme');
});

test('NAV_LINKS contains exactly 4 navigation items and prunes About / #dex-overview', async () => {
  const uiSource = fs.readFileSync(path.join(rootDir, 'src/ui.js'), 'utf8');
  const navLinksMatch = uiSource.match(/export\s+const\s+NAV_LINKS\s*=\s*\[[\s\S]*?\];/);
  assert.ok(navLinksMatch, 'NAV_LINKS declaration must exist in src/ui.js');
  const mod = await import(`data:text/javascript;base64,${Buffer.from(navLinksMatch[0]).toString('base64')}`);
  const { NAV_LINKS } = mod;

  assert.equal(NAV_LINKS.length, 4, 'NAV_LINKS must contain exactly 4 navigation entries');
  const labels = NAV_LINKS.map(l => l.label);
  const hrefs = NAV_LINKS.map(l => l.href);

  assert.ok(labels.includes('Home'), 'NAV_LINKS must include Home');
  assert.ok(labels.includes('Last.fm'), 'NAV_LINKS must include Last.fm');
  assert.ok(labels.includes('Collection'), 'NAV_LINKS must include Collection');
  assert.ok(labels.includes('Recently Added'), 'NAV_LINKS must include Recently Added');

  assert.ok(!labels.includes('About'), 'NAV_LINKS must not contain About');
  assert.ok(!hrefs.includes('#dex-overview'), 'NAV_LINKS must not contain #dex-overview');
});

test('openProfileModal is exported as a function from src/modal.js', async () => {
  const modalModule = await import('../src/modal.js');
  assert.equal(typeof modalModule.openProfileModal, 'function', 'openProfileModal must be exported from src/modal.js');
});

test('data.json profile contains required bio, currently, location, and avatar fields', () => {
  const raw = fs.readFileSync(path.join(rootDir, 'data.json'), 'utf8');
  const data = JSON.parse(raw);
  const { profile } = data;

  assert.ok(profile, 'profile must exist in data.json');
  assert.equal(typeof profile.avatar, 'string', 'profile.avatar must be a string');
  assert.ok(profile.avatar.trim().length > 0, 'profile.avatar must not be empty');

  assert.equal(typeof profile.bio, 'string', 'profile.bio must be a string');
  assert.ok(profile.bio.trim().length > 0, 'profile.bio must not be empty');

  assert.equal(typeof profile.currently, 'string', 'profile.currently must be a string');
  assert.ok(profile.currently.trim().length > 0, 'profile.currently must not be empty');

  assert.equal(typeof profile.location, 'string', 'profile.location must be a string');
  assert.ok(profile.location.trim().length > 0, 'profile.location must not be empty');
});



