import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readShortlist,
  toggleShortlist,
  comparisonSelection,
} from '../src/lib/shortlist.ts';
const catalogue = ['one', 'two', 'three', 'four'].map((slug) => ({ slug }));
test('recovers from corrupt storage and rejects invalid identifiers', () => {
  assert.deepEqual(readShortlist('{'), []);
  assert.deepEqual(readShortlist('{"one":true}'), []);
  assert.deepEqual(
    readShortlist('["one","one",7,"../admin","<script>","two"]'),
    ['one', 'two'],
  );
  assert.equal(
    readShortlist(
      JSON.stringify(Array.from({ length: 40 }, (_, i) => `tour-${i}`)),
    ).length,
    30,
  );
});
test('saved tour toggling removes rather than duplicating and bounds storage', () => {
  assert.deepEqual(toggleShortlist(['one'], 'one'), []);
  assert.deepEqual(toggleShortlist(['one'], 'two'), ['one', 'two']);
  assert.throws(() => toggleShortlist([], '../admin'));
  assert.equal(
    toggleShortlist(
      Array.from({ length: 30 }, (_, i) => `tour-${i}`),
      'new-tour',
    ).length,
    30,
  );
});
test('comparison deduplicates identifiers and rejects oversized or stale requests', () => {
  assert.deepEqual(
    comparisonSelection(catalogue, ['two', 'one', 'one']).selected,
    [catalogue[1], catalogue[0]],
  );
  for (const requested of [
    ['one'],
    ['one', 'unknown'],
    ['one', 'two', 'three', 'four'],
  ]) {
    const result = comparisonSelection(catalogue, requested);
    assert.equal(result.selected.length, 0);
    assert.ok(result.error);
  }
});
test('empty selection is a picker and disabled catalogue cannot expose saved tours', () => {
  assert.deepEqual(comparisonSelection(catalogue, undefined), {
    selected: [],
    error: '',
  });
  assert.equal(comparisonSelection([], ['one', 'two']).selected.length, 0);
});
