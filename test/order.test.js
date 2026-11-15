import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeReference, validateCustomer, orderSummary, whatsappLink } from '../src/order.js';
import { DEFAULT_CONFIG } from '../src/catalog.js';

const customer = {
  name: '  Noy  ',
  phone: '+856 20 5555 1234',
  email: '',
  quantity: 2,
  dropOff: "I'll drop it at the workshop",
  notes: '',
};

test('reference format', () => {
  assert.equal(makeReference(new Date(2026, 10, 5), () => 0.123456), 'KH-1105-4FZY');
  assert.match(makeReference(), /^KH-\d{4}-[0-9A-Z]{4}$/);
});

test('customer validation requires name and phone', () => {
  assert.equal(validateCustomer(customer), null);
  assert.ok(validateCustomer({ ...customer, phone: '  ' }));
  assert.ok(validateCustomer({ ...customer, name: '' }));
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
