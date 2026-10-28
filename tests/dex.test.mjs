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
