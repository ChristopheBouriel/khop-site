import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { LOCALES, DEFAULT_LOCALE, ORDER_LOCALE, pickLocale, translator } from '../src/i18n.js';
import { COLORS, PROFILES, MATS, GLAZING } from '../src/catalog.js';
import { DROP_OFF } from '../src/order.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mainJs = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const reference = LOCALES[DEFAULT_LOCALE];
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

test('translator: interpolation and fallbacks', () => {
  const locales = { en: { hello: 'Hello {name}', only: 'English only' }, xx: { hello: 'Yo {name}' } };
  assert.equal(translator('xx', locales)('hello', { name: 'Noy' }), 'Yo Noy');
  assert.equal(translator('xx', locales)('only'), 'English only'); // falls back to the default locale
  assert.equal(translator('xx', locales)('missing.key'), 'missing.key'); // then to the key
  assert.equal(translator('en', locales)('hello'), 'Hello {name}'); // unknown placeholder left as is
  assert.equal(translator('en', locales)('hello', { name: 0 }), 'Hello 0');
});

test('pickLocale: exact match, language match, default', () => {
  const available = ['en', 'fr', 'lo'];
  assert.equal(pickLocale(['fr'], available), 'fr');
  assert.equal(pickLocale(['FR-fr', 'en'], available), 'fr');
  assert.equal(pickLocale([null, undefined, 'de', 'lo-LA'], available), 'lo');
  assert.equal(pickLocale(['de'], available), DEFAULT_LOCALE);
  assert.equal(pickLocale([], available), DEFAULT_LOCALE);
});

test('default and order locales exist', () => {
  assert.ok(LOCALES[DEFAULT_LOCALE]);
  assert.ok(LOCALES[ORDER_LOCALE]);
});

test('every locale has the same keys and placeholders as the reference', () => {
  for (const [code, dict] of Object.entries(LOCALES)) {
    assert.deepEqual(Object.keys(dict).sort(), Object.keys(reference).sort(), `keys differ in "${code}"`);
    for (const key of Object.keys(reference)) {
      assert.equal(typeof dict[key], 'string', `${code}: ${key} is not a string`);
      assert.ok(dict[key].trim(), `${code}: ${key} is empty`);
      assert.deepEqual(placeholders(dict[key]), placeholders(reference[key]), `${code}: placeholders differ in ${key}`);
    }
  }
});

test('every catalogue option has a label', () => {
  const expected = [
    ...COLORS.map((c) => `catalog.color.${c.id}`),
    ...PROFILES.map((p) => `catalog.profile.${p.id}`),
    ...MATS.map((m) => `catalog.mat.${m.id}`),
    ...GLAZING.map((g) => `catalog.glazing.${g.id}`),
    ...GLAZING.filter((g) => g.note).map((g) => `catalog.glazingNote.${g.note}`),
    ...DROP_OFF.map((d) => `drop.${d}`),
  ];
  for (const key of expected) assert.ok(reference[key], `missing label ${key}`);
});

test('index.html: every tagged text exists and matches the English dictionary', () => {
  const tagged = [...html.matchAll(/data-i18n="([^"]+)"[^>]*>([^<]*)</g)];
  assert.ok(tagged.length > 40, 'expected the page texts to be tagged');
  for (const [, key, text] of tagged) {
    assert.ok(key in reference, `index.html uses unknown key ${key}`);
    if (reference[key].includes('{')) continue; // filled with live values at runtime
    assert.equal(decode(text), reference[key], `index.html text differs from en.js for ${key}`);
  }
});

test('index.html: markup and attribute keys exist', () => {
  const htmlKeys = [...html.matchAll(/data-i18n-html="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(htmlKeys.length > 0);
  for (const key of htmlKeys) {
    assert.ok(key in reference, `unknown key ${key}`);
    assert.ok(key.endsWith('.html'), `${key} holds markup, its name should end in .html`);
    assert.ok(html.includes(`data-i18n-html="${key}">${reference[key]}<`), `index.html markup differs from en.js for ${key}`);
  }
  // Only keys named *.html may hold markup; everything else is inserted as plain text.
  for (const [key, value] of Object.entries(reference)) {
    if (!key.endsWith('.html')) assert.doesNotMatch(value, /<[a-z/]/i, `${key} contains markup`);
  }

  for (const [, pairs] of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const pair of pairs.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      assert.ok(key in reference, `unknown key ${key}`);
      const fallback = html.match(new RegExp(`${attr}="([^"]*)"[^>]*data-i18n-attr="[^"]*${key.replace(/\./g, '\\.')}`));
      assert.ok(fallback, `no ${attr} fallback next to ${key}`);
      assert.equal(decode(fallback[1]), reference[key], `${attr} differs from en.js for ${key}`);
    }
  }
});

test('index.html: the drop-off select offers exactly the DROP_OFF values', () => {
  const select = html.match(/<select id="drop">(.*?)<\/select>/s)[1];
  assert.deepEqual([...select.matchAll(/value="([^"]+)"/g)].map((m) => m[1]), DROP_OFF);
});

test('main.js: every literal key passed to t() exists', () => {
  const keys = [...mainJs.matchAll(/\bt\(\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(keys.length > 20);
  for (const key of keys) assert.ok(key in reference, `main.js uses unknown key ${key}`);
});

test('no dictionary key is unused', () => {
  const orderJs = readFileSync(new URL('../src/order.js', import.meta.url), 'utf8');
  const sources = html + mainJs + orderJs;
  const dynamicPrefixes = ['catalog.', 'drop.', 'error.', 'done.withWhatsapp', 'done.copyOnly', 'lang.name'];
  for (const key of Object.keys(reference)) {
    if (dynamicPrefixes.some((p) => key.startsWith(p))) continue;
    assert.ok(sources.includes(key), `${key} is defined but never used`);
  }
});
