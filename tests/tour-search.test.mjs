import test from 'node:test';
import assert from 'node:assert/strict';
import { searchTours, tourFilters } from '../src/lib/tour-search.ts';
const tours = [
  {
    name: 'Dubai city',
    destination: 'Dubai',
    country: 'UAE',
    theme: 'Adventure',
    summary: 'Desert escape',
    model: 'fixed-departure',
    days: 4,
    adultPaise: 3990000,
    departures: ['2027-02-12', '2027-01-15'],
  },
  {
    name: 'Venice',
    destination: 'Venice',
    country: 'Italy',
    theme: 'Relaxed',
    summary: 'Quiet canals',
    model: 'custom-holiday',
    days: 5,
    adultPaise: null,
    departures: [],
  },
  {
    name: 'Kyoto gardens',
    destination: 'Kyoto',
    country: 'Japan',
    theme: 'Culture',
    summary: 'Quiet gardens',
    model: 'fixed-departure',
    days: 5,
    adultPaise: 6990000,
    departures: ['2027-03-12'],
  },
];
const filters = (params) =>
  tourFilters(params, ['Adventure', 'Relaxed', 'Culture']);
test('intersects month, duration, budget, theme and multi-word search', () => {
  assert.deepEqual(
    searchTours(
      tours,
      filters({
        q: 'UAE desert',
        month: '2027-02',
        duration: 'short',
        budget: '50000',
        theme: 'Adventure',
      }),
    ),
    [tours[0]],
  );
  assert.deepEqual(
    searchTours(tours, filters({ month: '2027-02', duration: 'long' })),
    [],
  );
});
test('budget and fixed-month filters exclude unknown quotes without inventing a cost', () => {
  assert.deepEqual(searchTours(tours, filters({ model: 'custom-holiday' })), [
    tours[1],
  ]);
  assert.deepEqual(
    searchTours(tours, filters({ model: 'custom-holiday', budget: '100000' })),
    [],
  );
  assert.deepEqual(
    searchTours(tours, filters({ model: 'custom-holiday', month: '2027-03' })),
    [],
  );
  assert.deepEqual(searchTours(tours, filters({ budget: '50000' })), [
    tours[0],
  ]);
});
test('sorts dates independently of input order, leaves quote-only last and does not mutate inventory', () => {
  const reversed = [...tours].reverse();
  assert.deepEqual(searchTours(reversed, filters({ sort: 'departure' })), [
    tours[0],
    tours[2],
    tours[1],
  ]);
  assert.deepEqual(searchTours(reversed, filters({ sort: 'price' })), [
    tours[0],
    tours[2],
    tours[1],
  ]);
  assert.deepEqual(reversed, [...tours].reverse());
  assert.deepEqual(tours[0].departures, ['2027-02-12', '2027-01-15']);
});
test('normalises repeated and hostile query values and bounds search strings', () => {
  assert.deepEqual(
    filters({
      q: [' Dubai ', 'Japan'],
      month: '2027-13',
      budget: '-1',
      duration: 'unbounded',
      model: 'bad',
      theme: 'unknown',
      sort: 'random',
    }),
    {
      q: 'Dubai',
      month: '',
      budget: '',
      duration: '',
      model: '',
      theme: '',
      sort: 'collection',
    },
  );
  assert.equal(filters({ q: 'x'.repeat(120) }).q.length, 100);
  assert.deepEqual(searchTours([], filters({})), []);
});
