import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeReference, validateCustomer, orderSummary, whatsappLink } from '../src/order.js';
import { DEFAULT_CONFIG } from '../src/catalog.js';

const customer = {
  name: '  Noy  ',
  phone: '+856 20 5555 1234',
  email: '',
  quantity: 2,
  dropOff: 'workshop',
  notes: '',
};

test('reference format', () => {
  assert.equal(makeReference(new Date(2026, 10, 5), () => 0.123456), 'KH-1105-4FZY');
  assert.match(makeReference(), /^KH-\d{4}-[0-9A-Z]{4}$/);
});

test('customer validation requires name and phone', () => {
  assert.equal(validateCustomer(customer), null);
  assert.equal(validateCustomer({ ...customer, phone: '  ' }), 'missingContact');
  assert.equal(validateCustomer({ ...customer, name: '' }), 'missingContact');
});

test('summary: full text for the default configuration', () => {
  const text = orderSummary(DEFAULT_CONFIG, { ...customer, email: ' noy@example.com ', notes: 'Hanging wire' }, 'KH-0000-TEST');
  assert.equal(
    text,
    [
      'Order request KH-0000-TEST',
      'Artwork: 40 × 30 cm',
      'Moulding: Natural teak, Classic (3.5 cm)',
      'Mat: Bright white, 6 cm border → opening 52 × 42 cm',
      'Glazing: Clear glass',
      'Quantity: 2',
      'Estimate: 1,420,000 ₭',
      "Artwork drop-off: I'll drop it at the workshop",
      'Name: Noy',
      'Phone: +856 20 5555 1234',
      'Email: noy@example.com',
      'Notes: Hanging wire',
    ].join('\n'),
  );
});

test('summary without a mat', () => {
  const text = orderSummary({ ...DEFAULT_CONFIG, mat: 'none' }, customer, 'R');
  assert.match(text, /Mat: none → opening 40 × 30 cm/);
});

test('summary uses the translator it is given', () => {
  const t = (key, params = {}) => `${key}${params.ref ?? ''}`;
  assert.match(orderSummary(DEFAULT_CONFIG, customer, 'R1', t), /^summary\.titleR1\n/);
});

test('summary multiplies the estimate by quantity and trims fields', () => {
  const text = orderSummary(DEFAULT_CONFIG, customer, 'KH-0000-TEST');
  assert.match(text, /^Order request KH-0000-TEST/);
  assert.match(text, /Estimate: 1,420,000 ₭/); // (550k + 160k) × 2
  assert.match(text, /Name: Noy\n/);
  assert.doesNotMatch(text, /Email:/);
});

test('summary for an oversized piece says "on quote"', () => {
  const text = orderSummary({ ...DEFAULT_CONFIG, width: 150, height: 120 }, customer, 'R');
  assert.match(text, /Estimate: on quote \(size XXL\)/);
});

test('WhatsApp link', () => {
  assert.equal(whatsappLink('', 'hi'), null);
  assert.equal(whatsappLink('+856 20 1234', 'a b'), 'https://wa.me/856201234?text=a%20b');
});
