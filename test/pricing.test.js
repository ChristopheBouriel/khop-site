import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quote, findTier, findMatBand, measure, isValidSize, formatKip } from '../src/pricing.js';
import { DEFAULT_CONFIG, TIERS, MAT_BANDS } from '../src/catalog.js';

const cfg = (overrides = {}) => ({ ...DEFAULT_CONFIG, ...overrides });

test('default configuration: 40×30 with 6 cm mat → opening 52×42, size M', () => {
  const q = quote(cfg());
  assert.equal(q.valid, true);
  assert.deepEqual(q.measures.opening, { width: 52, height: 42 });
  assert.equal(q.tierId, 'M');
  // frame M + mat band 2 (0.2184 m²) + clear glass included
  assert.equal(q.total, 550_000 + 160_000 + 0);
});

test('outside size adds the moulding width on each side', () => {
  const m = measure(cfg({ profile: 'wide' }));
  assert.deepEqual(m.outside, { width: 52 + 10, height: 42 + 10 });
});

test('no mat: opening equals artwork and no mat line', () => {
  const q = quote(cfg({ mat: 'none' }));
  assert.deepEqual(q.measures.opening, { width: 40, height: 30 });
  assert.equal(q.tierId, 'S');
  assert.equal(q.lines.length, 2);
  assert.equal(q.total, 350_000);
});

test('tier ignores orientation', () => {
  assert.equal(findTier(40, 30).id, findTier(30, 40).id);
  assert.equal(findTier(100, 70).id, 'L');
});

test('tier bounds are inclusive', () => {
  for (const t of TIERS) assert.equal(findTier(t.fit[0], t.fit[1]).id, t.id);
  assert.equal(findTier(30.5, 40).id, 'M');
});

test('larger than the biggest tier → on quote', () => {
  const q = quote(cfg({ width: 130, height: 100 })); // opening 142 × 112
  assert.equal(q.valid, true);
  assert.equal(q.tierId, 'XXL');
  assert.equal(q.total, null);
});

test('mat bands: inclusive upper bounds', () => {
  for (const b of MAT_BANDS) assert.equal(findMatBand(b.maxArea).price, b.price);
  assert.equal(findMatBand(1.41), null);
});

test('every opening that has a tier also has a mat band', () => {
  for (const t of TIERS) {
    assert.ok(findMatBand((t.fit[0] * t.fit[1]) / 10_000), `no band for tier ${t.id}`);
  }
});

test('anti-reflective glass adds the tier surcharge', () => {
  const base = quote(cfg()).total;
  const ar = quote(cfg({ glazing: 'ar' })).total;
  assert.equal(ar - base, 200_000);
});

test('size validation', () => {
  assert.equal(isValidSize(10, 200), true);
  assert.equal(isValidSize(9.5, 30), false);
  assert.equal(isValidSize(40, 201), false);
  assert.equal(isValidSize(NaN, 30), false);
  assert.equal(quote(cfg({ width: 0 })).valid, false);
});

test('kip formatting', () => {
  assert.equal(formatKip(1_300_000), '1,300,000 ₭');
});
