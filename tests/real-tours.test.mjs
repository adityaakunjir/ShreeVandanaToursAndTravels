import test from 'node:test';
import assert from 'node:assert/strict';
import tours from '../src/data/tours.json' with { type: 'json' };
import {
  realTourFilters,
  findRealTours,
  tourDuration,
} from '../src/lib/real-tours.ts';
const find = (params) => findRealTours(tours, realTourFilters(params, tours));
test('real collection combines region, country, style, duration and words', () => {
  assert.deepEqual(
    find({
      q: 'pokhara lakes',
      region: 'International',
      country: 'Nepal',
      style: 'coast',
      duration: '8',
    }).map((t) => t.slug),
    ['nepal'],
  );
  assert.equal(find({ country: 'Nepal', region: 'India' }).length, 0);
  assert.equal(find({ q: 'Dubai', duration: '10' }).length, 0);
});
test('stated Kashmir duration is preserved without invented itinerary days', () => {
  const kashmir = find({ duration: '10' });
  assert.equal(kashmir.length, 1);
  assert.equal(tourDuration(kashmir[0]), 10);
  assert.equal(kashmir[0].days.length, 0);
});
test('malformed filters preserve inventory and bound text', () => {
  assert.equal(find({}).length, 11);
  assert.equal(
    find({ region: 'fake', country: 'Venice', duration: '-1', style: 'fake' })
      .length,
    11,
  );
  assert.equal(realTourFilters({ q: [' Nepal ', 'Dubai'] }, tours).q, 'Nepal');
  assert.equal(realTourFilters({ q: 'a'.repeat(1000) }, tours).q.length, 120);
  const order = tours.map((t) => t.slug);
  find({ style: 'pilgrimage' });
  assert.deepEqual(
    tours.map((t) => t.slug),
    order,
  );
});
