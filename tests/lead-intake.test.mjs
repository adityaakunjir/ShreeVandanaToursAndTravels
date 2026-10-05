import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLeadIntake } from '../src/lib/enquiry.ts';
const input = {
  name: ' Test Traveller ',
  phone: '+91 90000 00000',
  email: '',
  destination: ' Dubai ',
  departure: '',
  travellers: '2',
  notes: 'Quiet hotels\nFlexible dates',
  contactPreference: 'whatsapp',
  consent: true,
  submissionKey: 'dc61b09a-b098-4539-a845-67c408dc53de',
};
test('normalises valid intake without mutating it or dropping message line breaks', () => {
  const result = parseLeadIntake(input, '2026-10-05');
  assert.equal(result.ok, true);
  assert.equal(result.data.enquiry.name, 'Test Traveller');
  assert.equal(result.data.enquiry.notes, input.notes);
  assert.equal(input.name, ' Test Traveller ');
});
test('rejects malformed payloads and privilege/price mass assignment', () => {
  for (const value of [
    null,
    [],
    'data',
    { ...input, name: 10 },
    { ...input, status: 'accepted' },
    { ...input, price: 1 },
  ])
    assert.equal(parseLeadIntake(value, '2026-10-05').ok, false);
});
test('requires explicit contact consent, valid retry key and selected contact channel', () => {
  for (const change of [
    { consent: 'true' },
    { submissionKey: 'guessable' },
    { contactPreference: 'email' },
    { contactPreference: 'fax' },
  ])
    assert.equal(
      parseLeadIntake({ ...input, ...change }, '2026-10-05').ok,
      false,
    );
  assert.equal(
    parseLeadIntake(
      { ...input, contactPreference: 'email', email: 'test@example.com' },
      '2026-10-05',
    ).ok,
    true,
  );
});
test('server intake independently rejects impossible dates, excessive party size, controls and overlong notes', () => {
  for (const change of [
    { departure: '2027-02-30' },
    { departure: '2020-01-01' },
    { travellers: '101' },
    { notes: 'x'.repeat(1001) },
    { name: 'Test\u0000Traveller' },
  ])
    assert.equal(
      parseLeadIntake({ ...input, ...change }, '2026-10-05').ok,
      false,
    );
});
