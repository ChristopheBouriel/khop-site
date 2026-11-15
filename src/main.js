// DOM wiring: reads the form, keeps the configuration state, re-renders preview and price.
import { COLORS, PROFILES, MATS, MAT_MARGINS, TIERS, MAT_BANDS, GLAZING, DEFAULT_CONFIG } from './catalog.js';
import { quote, formatKip, MIN_CM, MAX_CM } from './pricing.js';
import { frameSVG, paintDefaultArtwork } from './preview.js';
import { makeReference, validateCustomer, orderSummary, whatsappLink } from './order.js';
import { BUSINESS } from './config.js';
import { LOCALES, pickLocale, translator } from './i18n.js';

const $ = (id) => document.getElementById(id);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---- Language ----------------------------------------------------------------

const LANG_STORAGE_KEY = 'khop.lang';

/** Order of preference: ?lang= in the URL, the last choice on this device, then the browser languages. */
function detectLocale() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  let stored = null;
  try {
    if (fromUrl && pickLocale([fromUrl]) === fromUrl.toLowerCase()) localStorage.setItem(LANG_STORAGE_KEY, fromUrl.toLowerCase());
    stored = localStorage.getItem(LANG_STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode); the URL and browser language still work.
  }
  return pickLocale([fromUrl, stored, ...(navigator.languages ?? [])]);
}

const locale = detectLocale();
const t = translator(locale);
const lower = (s) => s.toLocaleLowerCase(locale);

/** Fills every tagged element of index.html from the dictionary. */
function applyStaticTexts() {
  const globals = { city: BUSINESS.city };
  document.documentElement.lang = locale;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n, globals);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml, globals); // values come from our own dictionary files
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key, globals));
    }
  });
}

/** Shown only when more than one language is available. */
function languageSwitcher() {
  const codes = Object.keys(LOCALES);
  if (codes.length < 2) return;
  const el = $('langs');
  el.setAttribute('role', 'navigation');
  el.setAttribute('aria-label', t('lang.switch'));
  el.innerHTML = codes
    .map((code) => {
      const name = escapeHtml(LOCALES[code]['lang.name'] ?? code);
      const current = code === locale ? ' aria-current="true"' : '';
      return `<a href="?lang=${code}" lang="${code}" hreflang="${code}"${current}>${name}</a>`;
    })
    .join('');
  el.hidden = false;
}

// ---- State ---------------------------------------------------------------------

const state = { ...DEFAULT_CONFIG };
let artwork = null; // data URL of the client's image, or the painted default
let imageRatio = null; // height / width of the uploaded image

// ---- Option controls -------------------------------------------------------

function radioChips(container, name, items, label) {
  container.innerHTML = items
    .map((item) => {
      const value = item.id ?? item;
      const id = `${name}-${value}`;
      const checked = String(value) === String(state[name]) ? 'checked' : '';
      return `<label class="chip" for="${id}"><input type="radio" name="${name}" id="${id}" value="${value}" ${checked}><span>${label(item)}</span></label>`;
    })
    .join('');
  container.addEventListener('change', (e) => {
    const v = e.target.value;
    state[name] = Number.isNaN(Number(v)) ? v : Number(v);
    render();
  });
}

function colorSwatches() {
  const el = $('colors');
  el.innerHTML = COLORS.map(
    (c) =>
      `<button type="button" class="sw" data-c="${c.id}" aria-pressed="${c.id === state.color}"><span class="chipc" style="background:${c.hex}"></span>${escapeHtml(t(`catalog.color.${c.id}`))}</button>`,
  ).join('');
  el.addEventListener('click', (e) => {
    const b = e.target.closest('.sw');
    if (!b) return;
    state.color = b.dataset.c;
    el.querySelectorAll('.sw').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
}

// ---- Static content built from the catalogue and config -------------------

function priceTables() {
  const dims = ([w, h]) => ({ w, h });
  $('tierTable').querySelector('tbody').innerHTML =
    TIERS.map(
      (tier) =>
        `<tr><td><b>${tier.id}</b></td><td class="m">${escapeHtml(t('unit.dims', dims(tier.fit)))}</td><td class="m">${formatKip(tier.price)}</td></tr>`,
    ).join('') +
    `<tr><td><b>XXL</b></td><td class="m">${escapeHtml(t('prices.beyond', dims(TIERS.at(-1).fit)))}</td><td>${escapeHtml(t('total.onQuote'))}</td></tr>`;
  $('matTable').querySelector('tbody').innerHTML = MAT_BANDS.map((band, i) => {
    const area = i ? t('prices.areaRange', { min: MAT_BANDS[i - 1].maxArea, max: band.maxArea }) : t('prices.areaFirst', { max: band.maxArea });
    return `<tr><td class="m">${escapeHtml(area)}</td><td>${escapeHtml(t('prices.upTo', dims(band.example)))}</td><td class="m">${formatKip(band.price)}</td></tr>`;
  }).join('');
}

function contactBlock() {
  $('contact').innerHTML = [
    [t('contact.whatsapp'), `<b>${escapeHtml(BUSINESS.whatsappDisplay)}</b>`],
    [t('contact.email'), `<b>${escapeHtml(BUSINESS.email)}</b>`],
    [t('contact.workshop'), `<span>${escapeHtml(BUSINESS.address)}, ${escapeHtml(BUSINESS.city)}</span>`],
    [t('contact.open'), `<span>${escapeHtml(BUSINESS.hours)}</span>`],
  ]
    .map(([k, v]) => `<div><span>${escapeHtml(k)}</span>${v}</div>`)
    .join('');
  $('year').textContent = new Date().getFullYear();
}

// ---- Render ------------------------------------------------------------------

/** Text of a price line returned by quote(). */
function lineLabel(line) {
  if (line.type === 'frame') {
    return t('line.frame', {
      size: line.tierId,
      profile: lower(t(`catalog.profile.${line.profileId}`)),
      color: lower(t(`catalog.color.${line.colorId}`)),
    });
  }
  if (line.type === 'mat') {
    return t('line.mat', { mat: lower(t(`catalog.mat.${line.matId}`)), area: line.areaM2.toFixed(2) });
  }
  return t(`catalog.glazing.${line.glazingId}`);
}

function render() {
  const q = quote(state);
  const note = $('quoteNote');
  const range = { min: MIN_CM, max: MAX_CM };

  if (!q.valid) {
    $('stage').innerHTML = `<p class="hint">${escapeHtml(t('preview.invalid', range))}</p>`;
    $('readout').innerHTML = '';
    $('lines').innerHTML = '';
    $('grand').textContent = '—';
    note.hidden = false;
    note.textContent = t('total.invalidNote', range);
    return;
  }

  const alt = t('preview.alt', { width: state.width, height: state.height, color: lower(t(`catalog.color.${state.color}`)) });
  $('stage').innerHTML = frameSVG(state, artwork, escapeHtml(alt));
  const { opening, outside } = q.measures;
  $('readout').innerHTML = [
    [t('readout.artwork'), t('unit.dims', { w: state.width, h: state.height })],
    [t('readout.opening'), t('unit.dims', { w: opening.width, h: opening.height })],
    [t('readout.outside'), t('unit.dims', { w: +outside.width.toFixed(1), h: +outside.height.toFixed(1) })],
    [t('readout.size'), q.tierId],
  ]
    .map(([k, v]) => `<span>${escapeHtml(k)} <b>${escapeHtml(v)}</b></span>`)
    .join('');

  $('lines').innerHTML = q.lines
    .map((l) => `<div><span>${escapeHtml(lineLabel(l))}</span><span>${l.amount ? formatKip(l.amount) : escapeHtml(t('total.included'))}</span></div>`)
    .join('');

  if (q.total === null) {
    $('grand').textContent = t('total.onQuote');
    note.hidden = false;
    note.textContent = t('total.oversizeNote');
  } else {
    $('grand').textContent = formatKip(q.total);
    note.hidden = true;
  }
}

// ---- Inputs ------------------------------------------------------------------

function wireSize() {
  const w = $('w');
  const h = $('h');
  w.value = state.width;
  h.value = state.height;
  const onInput = () => {
    state.width = Number(w.value) || 0;
    state.height = Number(h.value) || 0;
    render();
  };
  w.addEventListener('input', onInput);
  h.addEventListener('input', onInput);
  $('rotate').addEventListener('click', () => {
    [state.width, state.height] = [state.height, state.width];
    w.value = state.width;
    h.value = state.height;
    render();
  });
}

function wireUpload() {
  $('photo').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        imageRatio = img.naturalHeight / img.naturalWidth;
        artwork = reader.result;
        $('matchRatio').hidden = false;
        render();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  $('matchRatio').addEventListener('click', () => {
    if (!imageRatio) return;
    state.height = Math.round(state.width * imageRatio * 2) / 2; // nearest 0.5 cm
    $('h').value = state.height;
    render();
  });
}

function wireOrder() {
  const form = $('orderForm');
  const done = $('done');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const customer = {
      name: $('name').value,
      phone: $('phone').value,
      email: $('email').value,
      quantity: Number($('qty').value),
      dropOff: $('drop').value,
      notes: $('notes').value,
    };
    const err = $('err');
    const problem = !quote(state).valid ? 'invalidSize' : validateCustomer(customer);
    if (problem) {
      err.hidden = false;
      err.textContent = t(`error.${problem}`);
      return;
    }
    err.hidden = true;

    // The summary is written in the workshop's language (ORDER_LOCALE), not the page language.
    const text = orderSummary(state, customer, makeReference());
    $('summary').textContent = text;
    const link = whatsappLink(BUSINESS.whatsapp, text);
    const wa = $('waLink');
    wa.hidden = !link;
    if (link) wa.href = link;
    $('doneText').textContent = t(link ? 'done.withWhatsapp' : 'done.copyOnly');
    form.hidden = true;
    done.hidden = false;
  });

  $('editBtn').addEventListener('click', () => {
    form.hidden = false;
    done.hidden = true;
    $('copyMsg').hidden = true;
  });

  $('copyBtn').addEventListener('click', () => {
    const msg = $('copyMsg');
    const text = $('summary').textContent;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        msg.hidden = false;
        msg.textContent = t('done.copied');
      })
      .catch(() => {
        const range = document.createRange();
        range.selectNodeContents($('summary'));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        msg.hidden = false;
        msg.textContent = t('done.selected');
      });
  });
}

// ---- Boot --------------------------------------------------------------------

applyStaticTexts();
languageSwitcher();
artwork = paintDefaultArtwork();
colorSwatches();
radioChips($('profiles'), 'profile', PROFILES, (p) => `${escapeHtml(t(`catalog.profile.${p.id}`))}<small>${p.width} cm</small>`);
radioChips($('mats'), 'mat', MATS, (m) => escapeHtml(t(`catalog.mat.${m.id}`)));
radioChips($('margins'), 'margin', MAT_MARGINS, (m) => escapeHtml(t('mat.border', { cm: m })));
radioChips($('glazing'), 'glazing', GLAZING, (g) => `${escapeHtml(t(`catalog.glazing.${g.id}`))}${g.note ? `<small>${escapeHtml(t(`catalog.glazingNote.${g.note}`))}</small>` : ''}`);
priceTables();
contactBlock();
wireSize();
wireUpload();
wireOrder();
render();
