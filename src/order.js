// Builds the order request. Pure functions, testable in Node.
// V1 sends nothing to a server: the client copies the text or opens WhatsApp (see docs/DECISIONS.md, D4).
import { COLORS, PROFILES, MATS, GLAZING, byId } from './catalog.js';
import { quote, formatKip } from './pricing.js';

/** Short reference like "KH-1115-4F2A" (month+day, then 4 random chars). */
export function makeReference(date = new Date(), rand = Math.random) {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const suffix = rand().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
  return `KH-${mmdd}-${suffix}`;
}

/** Returns an error message, or null when the customer details are usable. */
export function validateCustomer({ name, phone }) {
  if (!name?.trim() || !phone?.trim()) {
    return 'Add your name and a phone or WhatsApp number so we can confirm the order.';
  }
  return null;
}

/** Plain-text order summary sent to the workshop. */
export function orderSummary(config, customer, reference) {
  const q = quote(config);
  const qty = Math.max(1, Math.floor(customer.quantity) || 1);
  const profile = byId(PROFILES, config.profile);
  const mat = byId(MATS, config.mat);
  const { opening } = q.measures;
  const estimate = q.total === null ? `on quote (size ${q.tierId})` : formatKip(q.total * qty);

  return [
    `Order request ${reference}`,
    `Artwork: ${config.width} × ${config.height} cm`,
    `Moulding: ${byId(COLORS, config.color).name}, ${profile.name} (${profile.width} cm)`,
    `Mat: ${config.mat === 'none' ? 'none' : `${mat.name}, ${config.margin} cm border`} → opening ${opening.width} × ${opening.height} cm`,
    `Glazing: ${byId(GLAZING, config.glazing).name}`,
    `Quantity: ${qty}`,
    `Estimate: ${estimate}`,
    `Artwork drop-off: ${customer.dropOff}`,
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    customer.email?.trim() ? `Email: ${customer.email.trim()}` : null,
    customer.notes?.trim() ? `Notes: ${customer.notes.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

/** wa.me link with the summary prefilled, or null when no number is configured. */
export function whatsappLink(number, text) {
  const digits = String(number ?? '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}
