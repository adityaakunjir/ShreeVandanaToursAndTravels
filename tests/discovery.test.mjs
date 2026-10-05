import test from 'node:test';
import assert from 'node:assert/strict';
import { filterDestinations, searchValue } from '../src/lib/discovery.ts';

const items = [
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    tag: 'City & adventure',
    description: 'Desert adventures',
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    tag: 'Culture & discovery',
    description: 'Quiet gardens',
  },
];
test('matches country and multiple words without case sensitivity', () => {
  assert.deepEqual(filterDestinations(items, '  UNITED desert ', ''), [
    items[0],
  ]);
});
test('requires both query and selected style to match', () => {
  assert.deepEqual(
    filterDestinations(items, 'Dubai', 'Culture & discovery'),
    [],
  );
});
test('empty query returns the whole collection and unknown query is empty', () => {
  assert.deepEqual(filterDestinations(items, '', ''), items);
  assert.deepEqual(filterDestinations(items, 'Antarctica', ''), []);
});
test('handles repeated URL parameters and bounds submitted text', () => {
  assert.equal(searchValue([' Japan ', 'Italy']), 'Japan');
  assert.equal(searchValue(undefined), '');
  assert.equal(searchValue('a'.repeat(150)).length, 100);
});
