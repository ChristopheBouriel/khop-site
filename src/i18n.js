// Translations. Pure (no DOM access), so it runs in Node tests and in the browser.
//
// To add a language:
//   1. copy src/i18n/en.js to src/i18n/<code>.js and translate the values (keep the keys);
//   2. import it here and add it to LOCALES.
// The language switcher appears by itself as soon as LOCALES has more than one entry.
import en from './i18n/en.js';

export const LOCALES = { en };
export const DEFAULT_LOCALE = 'en';

/** Language of the order summary sent to the workshop, whatever language the client browses in. */
export const ORDER_LOCALE = 'en';

/**
 * First candidate that matches an available locale, exactly or by language ("fr-FR" → "fr").
 * Candidates may be null or undefined. Falls back to DEFAULT_LOCALE.
 */
export function pickLocale(candidates, available = Object.keys(LOCALES)) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const code = String(candidate).toLowerCase();
    if (available.includes(code)) return code;
    const language = code.split('-')[0];
    if (available.includes(language)) return language;
  }
  return DEFAULT_LOCALE;
}

/**
 * Returns t(key, params) for a locale. Missing keys fall back to the default locale,
 * then to the key itself, so a gap is visible on the page instead of breaking it.
 */
export function translator(locale = DEFAULT_LOCALE, locales = LOCALES) {
  const dict = locales[locale] ?? {};
  const fallback = locales[DEFAULT_LOCALE] ?? {};
  return (key, params = {}) => {
    const template = dict[key] ?? fallback[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
  };
}
