import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import tours from '../src/data/catalogue.ts';
import fresh from '../src/data/imported-tours.json' with { type: 'json' };
import legacy from '../src/data/tours.json' with { type: 'json' };
import { findRealTours, realTourFilters } from '../src/lib/real-tours.ts';
test('accounts for all 45 sections and all 11 legacy URLs without merging variants', () => {
  assert.equal(fresh.length, 45);
  assert.equal(fresh.filter((t) => t.scope === 'India').length, 31);
  assert.equal(fresh.filter((t) => t.scope === 'International').length, 14);
  assert.deepEqual(
    fresh.map((t) => t.source.order),
    Array.from({ length: 45 }, (_, i) => i + 1),
  );
  assert.equal(new Set(tours.map((t) => t.slug)).size, tours.length);
  for (const t of legacy)
    assert.deepEqual(tours.find((x) => x.slug === t.slug).days, t.days);
  for (const t of fresh) {
    assert.equal(t.days.length, t.duration);
    assert.equal(t.nights + 1, t.duration);
    assert.ok(t.includes.length && t.excludes.length);
    assert.equal(t.publication, 'published-outline');
    for (const id of t.relatedSlugs)
      assert.ok(legacy.some((x) => x.slug === id));
  }
});
test('provenance matches the actual supplied document and paragraph coverage is contiguous', async () => {
  const hash = createHash('sha256')
    .update(
      await readFile(
        new URL('../client_details/TOUR ITINERARIES.docx', import.meta.url),
      ),
    )
    .digest('hex');
  for (let i = 0; i < fresh.length; i++) {
    assert.equal(fresh[i].source.sha256, hash);
    if (i)
      assert.equal(
        fresh[i].source.paragraphRange[0],
        fresh[i - 1].source.paragraphRange[1] + 1,
      );
  }
});
test('conflicting durations stay distinct and tax language is confirmation-led', () => {
  assert.equal(tours.find((t) => t.slug === 'sri-lanka').duration, 8);
  assert.equal(
    fresh.find((t) => t.relatedSlugs.includes('sri-lanka')).duration,
    7,
  );
  assert.equal(tours.find((t) => t.slug === 'egypt-hurghada').duration, 9);
  assert.equal(
    fresh.find((t) => t.relatedSlugs.includes('egypt-hurghada')).duration,
    8,
  );
  assert.ok(fresh[0].notes.some((x) => /not confirmed departures/.test(x)));
  assert.ok(
    !JSON.stringify(
      fresh.flatMap((t) => [...t.includes, ...t.excludes]),
    ).includes('2% TCS'),
  );
});
test('expanded discovery derives durations and supports multi-country outlines without changing inventory', () => {
  for (const days of ['5', '7', '12', '13'])
    assert.ok(
      findRealTours(tours, realTourFilters({ duration: days }, tours)).length >
        0,
    );
  const singapore = findRealTours(
    tours,
    realTourFilters({ country: 'Singapore' }, tours),
  );
  assert.ok(singapore.length >= 2);
  const original = tours.map((t) => t.slug);
  const sorted = findRealTours(
    tours,
    realTourFilters({ sort: 'longest' }, tours),
  );
  assert.equal(sorted[0].duration, 13);
  assert.deepEqual(
    tours.map((t) => t.slug),
    original,
  );
});
test('every outline exposes source-aware enquiry context and credited media or explicit artwork fallback', () => {
  for (const tour of tours) {
    assert.ok(tour.enquiryContext.includes(`${tour.duration} days`));
    if (tour.image) {
      assert.ok(tour.image.licenseUrl.startsWith('https://'));
      assert.ok(tour.image.author);
      assert.equal(tour.image.usageRights, 'licensed-destination-inspiration');
    } else assert.equal(tour.image, null);
  }
  assert.notEqual(
    tours.find((t) => t.slug === 'nepal').enquiryContext,
    tours.find((t) => t.slug === 'nepal-8-days').enquiryContext,
  );
});
