// Pure pricing logic. No DOM access here, so it runs in Node tests and in the browser.
import { TIERS, MAT_BANDS, GLAZING, PROFILES, COLORS, MATS, byId } from './catalog.js';

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
 * Returns { valid, measures, tierId, lines: [{label, amount}], total }
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

  const profile = byId(PROFILES, config.profile);
  const color = byId(COLORS, config.color);
  const lines = [
    {
      label: `Frame, size ${tier.id} (${profile.name.toLowerCase()} ${color.name.toLowerCase()})`,
      amount: tier.price,
    },
  ];

  if (config.mat !== 'none') {
    const band = findMatBand(measures.areaM2);
    const mat = byId(MATS, config.mat);
    // Tiers and bands share the same upper bound, so a band always exists when a tier does.
    lines.push({ label: `Mat, ${mat.name.toLowerCase()} (${measures.areaM2.toFixed(2)} m²)`, amount: band.price });
  }

  const glazing = byId(GLAZING, config.glazing);
  lines.push({ label: glazing.name, amount: glazing.extraByTier?.[tier.id] ?? 0 });

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { valid: true, measures, tierId: tier.id, lines, total };
}
