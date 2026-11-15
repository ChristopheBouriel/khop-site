// Catalogue and price list.
// This is the only file to edit when prices or options change.
// All prices are in Lao kip (integers). Every value here is a PLACEHOLDER until validated.

/** Moulding finishes shown as swatches. `hex` is only used for the preview. */
export const COLORS = [
  { id: 'teak', name: 'Natural teak', hex: '#9A6A3C' },
  { id: 'darkteak', name: 'Dark teak', hex: '#4B301F' },
  { id: 'rosewood', name: 'Rosewood', hex: '#6E2F25' },
  { id: 'black', name: 'Matte black', hex: '#1F1F21' },
  { id: 'white', name: 'Chalk white', hex: '#ECEAE4' },
  { id: 'gold', name: 'Brushed gold', hex: '#B8934A' },
];

/** Moulding profiles. `width` is the visible face width in cm. */
export const PROFILES = [
  { id: 'fine', name: 'Fine', width: 2 },
  { id: 'classic', name: 'Classic', width: 3.5 },
  { id: 'wide', name: 'Wide', width: 5 },
];

/** Mats (passe-partout). `id: 'none'` means no mat. */
export const MATS = [
  { id: 'none', name: 'No mat' },
  { id: 'white', name: 'Bright white', hex: '#FAFAF6' },
  { id: 'antique', name: 'Antique white', hex: '#EEE7D8' },
  { id: 'saa', name: 'Saa paper', hex: '#E3D7BF', texture: 'fiber' },
  { id: 'charcoal', name: 'Charcoal', hex: '#2F3136' },
];

/** Mat border widths offered, in cm. */
export const MAT_MARGINS = [4, 6, 8];

/**
 * Frame price tiers, chosen on the OPENING size (artwork + mat on each side).
 * `fit` is [short side, long side] in cm; orientation does not matter.
 * Anything larger than the last tier is quoted individually.
 */
export const TIERS = [
  { id: 'S', fit: [30, 40], price: 350_000 },
  { id: 'M', fit: [50, 70], price: 550_000 },
  { id: 'L', fit: [70, 100], price: 850_000 },
  { id: 'XL', fit: [100, 140], price: 1_300_000 },
];

/** Mat price bands by mat surface (opening area) in m². */
export const MAT_BANDS = [
  { maxArea: 0.12, price: 90_000, example: 'up to 30 × 40 cm' },
  { maxArea: 0.35, price: 160_000, example: 'up to 50 × 70 cm' },
  { maxArea: 0.70, price: 260_000, example: 'up to 70 × 100 cm' },
  { maxArea: 1.40, price: 400_000, example: 'up to 100 × 140 cm' },
];

/** Glazing options. `extraByTier` is the surcharge per tier (missing = included). */
export const GLAZING = [
  { id: 'glass', name: 'Clear glass', note: 'included' },
  { id: 'ar', name: 'Anti-reflective glass', extraByTier: { S: 120_000, M: 200_000, L: 320_000, XL: 480_000 } },
  { id: 'none', name: 'No glazing', note: 'for canvas' },
];

/** Starting configuration shown when the page opens. */
export const DEFAULT_CONFIG = {
  width: 40,
  height: 30,
  color: 'teak',
  profile: 'classic',
  mat: 'white',
  margin: 6,
  glazing: 'glass',
};

export const byId = (list, id) => list.find((item) => item.id === id);
