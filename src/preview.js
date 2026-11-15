// Live frame preview. Builds an SVG whose viewBox is in centimetres, so it is always to scale.
import { COLORS, MATS, byId } from './catalog.js';
import { measure } from './pricing.js';

/**
 * Paints a small riverscape on a canvas so the preview looks real before the client uploads anything.
 * Browser only (needs a canvas).
 */
export function paintDefaultArtwork() {
  const c = document.createElement('canvas');
  c.width = 900;
  c.height = 700;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 700);
  g.addColorStop(0, '#F2C27A');
  g.addColorStop(0.45, '#E68A5C');
  g.addColorStop(0.62, '#8D5C78');
  g.addColorStop(1, '#2E3550');
  x.fillStyle = g;
  x.fillRect(0, 0, 900, 700);
  x.fillStyle = 'rgba(255,236,190,.9)';
  x.beginPath();
  x.arc(610, 300, 58, 0, Math.PI * 2);
  x.fill();
  const hill = (y, amp, col, seed) => {
    x.fillStyle = col;
    x.beginPath();
    x.moveTo(0, 700);
    for (let i = 0; i <= 900; i += 10) {
      x.lineTo(i, y + Math.sin(i / 140 + seed) * amp + Math.sin(i / 47 + seed * 2) * amp * 0.3);
    }
    x.lineTo(900, 700);
    x.fill();
  };
  hill(370, 40, '#6B4A6E', 1);
  hill(420, 30, '#4A3B5C', 3);
  hill(470, 22, '#2F2C45', 5);
  x.fillStyle = 'rgba(242,194,122,.35)';
  for (let i = 0; i < 9; i++) x.fillRect(560 - i * 6, 500 + i * 14, 100 + i * 12, 3);
  // Spire of a wat on the far bank
  x.fillStyle = '#2A2740';
  x.beginPath();
  x.moveTo(250, 470);
  x.lineTo(262, 410);
  x.lineTo(274, 470);
  x.fill();
  x.fillRect(238, 465, 48, 14);
  return c.toDataURL('image/jpeg', 0.85);
}

/**
 * Returns the SVG markup for a framed artwork. `imageHref` is a data: or same-origin URL.
 * `label` is the accessible description, already translated and HTML-escaped by the caller.
 */
export function frameSVG(config, imageHref, label = '') {
  const { margin: m, profileWidth: f, opening, outside } = measure(config);
  const W = outside.width;
  const H = outside.height;
  const col = byId(COLORS, config.color).hex;
  const mat = byId(MATS, config.mat);
  const pad = Math.max(W, H) * 0.06;
  const hasGlass = config.glazing !== 'none';
  const sheen = config.glazing === 'ar' ? 0.04 : 0.16;
  const bevel = config.mat === 'charcoal' ? '#E9E6DE' : '#FFFFFF';

  const matLayer = m
    ? `<rect x="${f}" y="${f}" width="${opening.width}" height="${opening.height}" fill="${mat.hex}"/>
       ${mat.texture === 'fiber' ? `<rect x="${f}" y="${f}" width="${opening.width}" height="${opening.height}" filter="url(#fiber)"/>` : ''}
       <rect x="${f + m - 0.35}" y="${f + m - 0.35}" width="${config.width + 0.7}" height="${config.height + 0.7}" fill="${bevel}" opacity=".9"/>`
    : '';

  return `
  <svg viewBox="${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}" width="100%" height="100%" role="img"
       aria-label="${label}">
    <defs>
      <filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${f * 0.5}" stdDeviation="${f * 0.6}" flood-color="#000" flood-opacity=".28"/></filter>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${sheen}"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="fiber"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.25  0 0 0 .22 0"/></filter>
    </defs>
    <g filter="url(#sh)"><rect x="0" y="0" width="${W}" height="${H}" fill="${col}"/></g>
    <!-- Four mitred sides, lit from the top left -->
    <polygon points="0,0 ${W},0 ${W - f},${f} ${f},${f}" fill="#fff" fill-opacity=".14"/>
    <polygon points="${W},0 ${W},${H} ${W - f},${H - f} ${W - f},${f}" fill="#000" fill-opacity=".10"/>
    <polygon points="0,${H} ${W},${H} ${W - f},${H - f} ${f},${H - f}" fill="#000" fill-opacity=".22"/>
    <polygon points="0,0 0,${H} ${f},${H - f} ${f},${f}" fill="#fff" fill-opacity=".05"/>
    <g stroke="#000" stroke-opacity=".18" stroke-width="${f * 0.03}"><line x1="0" y1="0" x2="${f}" y2="${f}"/><line x1="${W}" y1="0" x2="${W - f}" y2="${f}"/><line x1="0" y1="${H}" x2="${f}" y2="${H - f}"/><line x1="${W}" y1="${H}" x2="${W - f}" y2="${H - f}"/></g>
    ${matLayer}
    <image href="${imageHref}" x="${f + m}" y="${f + m}" width="${config.width}" height="${config.height}" preserveAspectRatio="xMidYMid slice"/>
    <rect x="${f}" y="${f}" width="${opening.width}" height="${opening.height}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="${Math.max(f * 0.05, 0.1)}"/>
    ${hasGlass ? `<rect x="${f}" y="${f}" width="${opening.width}" height="${opening.height}" fill="url(#sheen)"/>` : ''}
  </svg>`;
}
