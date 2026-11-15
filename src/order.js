// Builds the order request. Pure functions, testable in Node.
// V1 sends nothing to a server: the client copies the text or opens WhatsApp (see docs/DECISIONS.md, D4).
import { PROFILES, byId } from './catalog.js';
import { quote, formatKip } from './pricing.js';
import { translator, ORDER_LOCALE } from './i18n.js';

/** Values of the "How will you bring the artwork?" select; each has a drop.<value> label. */
export const DROP_OFF = ['workshop', 'frameOnly', 'print'];

/** Short reference like "KH-1115-4F2A" (month+day, then 4 random chars). */
export function makeReference(date = new Date(), rand = Math.random) {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const suffix = rand().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
  return `KH-${mmdd}-${suffix}`;
}

/** Returns an error code (an `error.<code>` text key), or null when the customer details are usable. */
export function validateCustomer({ name, phone }) {
  return !name?.trim() || !phone?.trim() ? 'missingContact' : null;
}

/**
 * Plain-text order summary sent to the workshop.
 * Written in the workshop's language (ORDER_LOCALE) by default, not the client's.
 */
export function orderSummary(config, customer, reference, t = translator(ORDER_LOCALE)) {
  const q = quote(config);
  const qty = Math.max(1, Math.floor(customer.quantity) || 1);
  const profile = byId(PROFILES, config.profile);
  const { opening } = q.measures;
  const size = { w: opening.width, h: opening.height };
  const estimate = q.total === null ? t('summary.onQuote', { size: q.tierId }) : formatKip(q.total * qty);

  return [
    t('summary.title', { ref: reference }),
    t('summary.artwork', { w: config.width, h: config.height }),
    t('summary.moulding', {
      color: t(`catalog.color.${config.color}`),
      profile: t(`catalog.profile.${config.profile}`),
      width: profile.width,
    }),
    config.mat === 'none'
      ? t('summary.matNone', size)
      : t('summary.mat', { mat: t(`catalog.mat.${config.mat}`), margin: config.margin, ...size }),
    t('summary.glazing', { glazing: t(`catalog.glazing.${config.glazing}`) }),
    t('summary.quantity', { qty }),
    t('summary.estimate', { amount: estimate }),
    t('summary.drop', { drop: t(`drop.${customer.dropOff}`) }),
    t('summary.name', { name: customer.name.trim() }),
    t('summary.phone', { phone: customer.phone.trim() }),
    customer.email?.trim() ? t('summary.email', { email: customer.email.trim() }) : null,
    customer.notes?.trim() ? t('summary.notes', { notes: customer.notes.trim() }) : null,
  ]
    .filter(Boolean)
    .join('\n');
}

/** wa.me link with the summary prefilled, or null when no number is configured. */
export function whatsappLink(number, text) {
  const digits = String(number ?? '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}
