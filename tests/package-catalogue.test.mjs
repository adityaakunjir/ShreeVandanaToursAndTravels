import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  packageIssues,
  validateCatalogue,
} from '../src/lib/package-catalogue.ts';

// Synthetic contract fixture only. It is never imported by the public site.
const fixture = () => ({
  id: 'test-tour',
  slug: 'test-tour',
  name: 'Synthetic test tour',
  model: 'fixed-departure',
  destination: 'Test destination',
  departureCity: 'Test origin',
  days: 2,
  nights: 1,
  itinerary: [
    { day: 1, title: 'Arrival', description: 'Test arrival' },
    { day: 2, title: 'Return', description: 'Test return' },
  ],
  inclusions: ['Test transport'],
  exclusions: ['Test personal expenses'],
  accommodation: 'Test hotel basis',
  transport: 'Test transfer basis',
  suitability: 'Test adult travellers',
  policy: {
    version: 'test-v1',
    cancellation: 'Test cancellation terms',
    payment: 'Test payment terms',
  },
  approval: { by: 'Test approver', at: '2026-10-05' },
  departures: [
    {
      id: 'test-departure',
      date: '2026-11-10',
      bookingCloses: '2026-11-01',
      capacity: 20,
      price: {
        currency: 'INR',
        adultPaise: 100000,
        occupancy: 'Test twin sharing',
        taxesIncluded: true,
        depositPaise: 20000,
        validUntil: '2026-11-01',
      },
    },
  ],
});
const today = '2026-10-05';

test('accepts complete fixed departure and quote-only custom holiday', () => {
  assert.deepEqual(packageIssues(fixture(), today), []);
  assert.deepEqual(
    packageIssues(
      { ...fixture(), model: 'custom-holiday', departures: [] },
      today,
    ),
    [],
  );
});
test('rejects the incomplete business input template', async () => {
  const template = JSON.parse(
    await readFile(
      new URL('../docs/package-input-template.json', import.meta.url),
      'utf8',
    ),
  );
  const result = validateCatalogue(template, today);
  assert.equal(result.packages.length, 0);
  for (const field of ['name', 'days', 'policy', 'approval', 'price'])
    assert.ok(
      result.issues.some((x) => x.includes(field)),
      field,
    );
});
test('rejects fractional money, deposits over total and undisclosed taxes', () => {
  const record = fixture();
  Object.assign(record.departures[0].price, {
    adultPaise: 100.25,
    depositPaise: 500,
    taxesIncluded: false,
  });
  const issues = packageIssues(record, today);
  assert.ok(issues.some((x) => x.includes('adultPaise')));
  assert.ok(issues.some((x) => x.includes('depositPaise')));
  assert.ok(issues.some((x) => x.includes('taxesIncluded')));
});
test('rejects expired and impossible dates and booking after departure', () => {
  const record = fixture();
  record.departures[0].price.validUntil = '2026-10-04';
  record.departures[0].bookingCloses = '2026-12-01';
  assert.ok(packageIssues(record, today).some((x) => x.includes('validUntil')));
  assert.ok(
    packageIssues(record, today).some((x) => x.includes('bookingCloses')),
  );
  record.departures[0].date = '2026-02-30';
  assert.ok(packageIssues(record, today).some((x) => x.includes('.date')));
});
test('rejects missing itinerary days and duplicate departures', () => {
  const record = fixture();
  record.itinerary[1].day = 1;
  record.departures.push(structuredClone(record.departures[0]));
  const issues = packageIssues(record, today);
  assert.ok(issues.some((x) => x.includes('itinerary[1]')));
  assert.ok(issues.some((x) => x.includes('unique')));
});
test('rejects conflicting identities and prevents partial imports', () => {
  const a = fixture();
  const b = fixture();
  const result = validateCatalogue([a, b], today);
  assert.equal(result.packages.length, 0);
  assert.equal(
    result.issues.filter((x) => x.includes('duplicate value')).length,
    2,
  );
  b.id = 'other';
  b.slug = 'other';
  b.departures[0].capacity = 0;
  assert.equal(validateCatalogue([a, b], today).packages.length, 0);
});
test('custom holidays cannot accidentally expose fixed-price departure inventory', () => {
  assert.ok(
    packageIssues({ ...fixture(), model: 'custom-holiday' }, today).some((x) =>
      x.includes('quote-only'),
    ),
  );
});
test('untrusted malformed JSON shapes produce issues rather than publishing', () => {
  for (const input of [
    null,
    'tour',
    [],
    { itinerary: [null], departures: [null] },
  ])
    assert.ok(packageIssues(input, today).length > 0);
  assert.throws(() => packageIssues(fixture(), 'not-a-date'));
  assert.equal(validateCatalogue({}, today).packages.length, 0);
});
