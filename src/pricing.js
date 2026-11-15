// Pure pricing logic. No DOM access here, so it runs in Node tests and in the browser.
import { TIERS, MAT_BANDS, GLAZING, PROFILES, byId } from './catalog.js';

export const MIN_CM = 10;
export const MAX_CM = 200;

/** Formats an integer amount of Lao kip, e.g. 350000 -> "350,000 ₭". */
export const formatKip = (amount) => `${Math.round(amount).toLocaleString('en-US')} ₭`;

/** True when both artwork sides are within the accepted range. */
export function isValidSize(width, height) {
  return [width, height].every((v) => Number.isFinite(v) && v >= MIN_CM && v <= MAX_CM);
}

/** Opening (artwork + mat border on each side) and outside size, in cm. */
export function measure(config) {
  const margin = config.mat === 'none' ? 0 : config.margin;
  const profile = byId(PROFILES, config.profile);
  const opening = { width: config.width + 2 * margin, height: config.height + 2 * margin };
  const outside = {
    width: opening.width + 2 * profile.width,
    height: opening.height + 2 * profile.width,
  };
  const areaM2 = (opening.width * opening.height) / 10_000;
  return { margin, profileWidth: profile.width, opening, outside, areaM2 };
}

/** Smallest tier whose [short, long] fit contains the opening, in either orientation. */
export function findTier(width, height) {
  const [short, long] = [width, height].sort((a, b) => a - b);
  return TIERS.find((t) => short <= t.fit[0] && long <= t.fit[1]) ?? null;
}

/** Mat price band for a mat surface in m². */
export function findMatBand(areaM2) {
  return MAT_BANDS.find((b) => areaM2 <= b.maxArea) ?? null;
}

/**
 * Full quote for one frame.
 * Returns { valid, measures, tierId, lines, total }.
 * Lines carry ids, not texts, so the caller labels them in the page language:
 * { type: 'frame', tierId, profileId, colorId, amount }, { type: 'mat', matId, areaM2, amount },
 * { type: 'glazing', glazingId, amount }.
 * `total` is null when the piece is larger than the biggest tier (quoted individually).
 */
export function quote(config) {
  if (!isValidSize(config.width, config.height)) {
    return { valid: false, measures: null, tierId: null, lines: [], total: null };
  }
  const measures = measure(config);
  const tier = findTier(measures.opening.width, measures.opening.height);
  if (!tier) {
    return { valid: true, measures, tierId: 'XXL', lines: [], total: null };
  }

  const lines = [{ type: 'frame', tierId: tier.id, profileId: config.profile, colorId: config.color, amount: tier.price }];

  if (config.mat !== 'none') {
    const band = findMatBand(measures.areaM2);
    // Tiers and bands share the same upper bound, so a band always exists when a tier does.
    lines.push({ type: 'mat', matId: config.mat, areaM2: measures.areaM2, amount: band.price });
  }

  const glazing = byId(GLAZING, config.glazing);
  lines.push({ type: 'glazing', glazingId: glazing.id, amount: glazing.extraByTier?.[tier.id] ?? 0 });

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { valid: true, measures, tierId: tier.id, lines, total };
}
