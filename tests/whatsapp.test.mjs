import assert from 'node:assert/strict';
import test from 'node:test';
import { whatsappEnquiry } from '../src/lib/whatsapp.ts';

test('generic enquiries open the primary WhatsApp number', () => {
  const url = new URL(whatsappEnquiry());
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/919665238966');
  assert.match(url.searchParams.get('text'), /plan a trip/);
});
test('destination and service context survives URL encoding', () => {
  const subject = 'Flights & hotels — Pune / Dubai';
  const url = new URL(whatsappEnquiry(subject));
  assert.ok(url.searchParams.get('text').includes(subject));
});
test('context is bounded and strips control characters', () => {
  const message = new URL(
    whatsappEnquiry('  Dubai\n' + 'a'.repeat(500)),
  ).searchParams.get('text');
  assert.ok(!message.includes('\n'));
  assert.ok(message.length < 240);
});
