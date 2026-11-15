// DOM wiring: reads the form, keeps the configuration state, re-renders preview and price.
import { COLORS, PROFILES, MATS, MAT_MARGINS, TIERS, MAT_BANDS, GLAZING, DEFAULT_CONFIG } from './catalog.js';
import { quote, formatKip } from './pricing.js';
import { frameSVG, paintDefaultArtwork } from './preview.js';
import { makeReference, validateCustomer, orderSummary, whatsappLink } from './order.js';
import { BUSINESS } from './config.js';

const $ = (id) => document.getElementById(id);
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

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
    (c) => `<button type="button" class="sw" data-c="${c.id}" aria-pressed="${c.id === state.color}"><span class="chipc" style="background:${c.hex}"></span>${c.name}</button>`,
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
  $('tierTable').querySelector('tbody').innerHTML =
    TIERS.map((t) => `<tr><td><b>${t.id}</b></td><td class="m">${t.fit[0]} × ${t.fit[1]} cm</td><td class="m">${formatKip(t.price)}</td></tr>`).join('') +
    `<tr><td><b>XXL</b></td><td class="m">beyond ${TIERS.at(-1).fit[0]} × ${TIERS.at(-1).fit[1]} cm</td><td>On quote</td></tr>`;
  $('matTable').querySelector('tbody').innerHTML = MAT_BANDS.map(
    (b, i) => `<tr><td class="m">${i ? `${MAT_BANDS[i - 1].maxArea}–` : '≤ '}${b.maxArea} m²</td><td>${b.example}</td><td class="m">${formatKip(b.price)}</td></tr>`,
  ).join('');
}

function contactBlock() {
  $('contact').innerHTML = [
    ['WhatsApp', `<b>${escapeHtml(BUSINESS.whatsappDisplay)}</b>`],
    ['Email', `<b>${escapeHtml(BUSINESS.email)}</b>`],
    ['Workshop', `<span>${escapeHtml(BUSINESS.address)}, ${escapeHtml(BUSINESS.city)}</span>`],
    ['Open', `<span>${escapeHtml(BUSINESS.hours)}</span>`],
  ]
    .map(([k, v]) => `<div><span>${k}</span>${v}</div>`)
    .join('');
  $('year').textContent = new Date().getFullYear();
}

// ---- Render ------------------------------------------------------------------

function render() {
  const q = quote(state);
  const note = $('quoteNote');

  if (!q.valid) {
    $('stage').innerHTML = '<p class="hint">Enter a size between 10 and 200 cm.</p>';
    $('readout').innerHTML = '';
    $('lines').innerHTML = '';
    $('grand').textContent = '—';
    note.hidden = false;
    note.textContent = 'Enter a size between 10 and 200 cm to see the price.';
    return;
  }

  $('stage').innerHTML = frameSVG(state, artwork);
  const { opening, outside } = q.measures;
  $('readout').innerHTML = [
    ['Artwork', `${state.width} × ${state.height} cm`],
    ['Opening', `${opening.width} × ${opening.height} cm`],
    ['Outside', `${+outside.width.toFixed(1)} × ${+outside.height.toFixed(1)} cm`],
    ['Size', q.tierId],
  ]
    .map(([k, v]) => `<span>${k} <b>${v}</b></span>`)
    .join('');

  $('lines').innerHTML = q.lines
    .map((l) => `<div><span>${l.label}</span><span>${l.amount ? formatKip(l.amount) : 'included'}</span></div>`)
    .join('');

  if (q.total === null) {
    $('grand').textContent = 'On quote';
    note.hidden = false;
    note.textContent = 'This piece is larger than our standard sizes. Send the request and we will quote it individually.';
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
    const problem = !quote(state).valid ? 'Enter a valid artwork size first.' : validateCustomer(customer);
    if (problem) {
      err.hidden = false;
      err.textContent = problem;
      return;
    }
    err.hidden = true;

    const text = orderSummary(state, customer, makeReference());
    $('summary').textContent = text;
    const link = whatsappLink(BUSINESS.whatsapp, text);
    const wa = $('waLink');
    wa.hidden = !link;
    if (link) wa.href = link;
    $('doneText').textContent = link
      ? 'Send it to the workshop on WhatsApp, or copy it and send it however you like.'
      : 'Copy it and send it to the workshop by WhatsApp or email.';
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
        msg.textContent = 'Copied.';
      })
      .catch(() => {
        const range = document.createRange();
        range.selectNodeContents($('summary'));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        msg.hidden = false;
        msg.textContent = 'Text selected. Copy it with your keyboard or long-press.';
      });
  });
}

// ---- Boot --------------------------------------------------------------------

artwork = paintDefaultArtwork();
colorSwatches();
radioChips($('profiles'), 'profile', PROFILES, (p) => `${p.name}<small>${p.width} cm</small>`);
radioChips($('mats'), 'mat', MATS, (m) => m.name);
radioChips($('margins'), 'margin', MAT_MARGINS, (m) => `${m} cm border`);
radioChips($('glazing'), 'glazing', GLAZING, (g) => `${g.name}${g.note ? `<small>${g.note}</small>` : ''}`);
priceTables();
contactBlock();
wireSize();
wireUpload();
wireOrder();
render();
