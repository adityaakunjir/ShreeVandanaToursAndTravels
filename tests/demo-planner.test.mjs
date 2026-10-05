import test from 'node:test';
import assert from 'node:assert/strict';
import { demoTotal } from '../src/lib/demo-planner.ts';
test('calculates party totals and deposit without losing currency precision', () => {
  assert.deepEqual(demoTotal(3990000, 1000000, 3), {
    total: 11970000,
    deposit: 3000000,
    balance: 8970000,
  });
});
test('rejects invalid party sizes, fractions and invalid deposits', () => {
  for (const count of [0, 9, 1.5, NaN])
    assert.throws(() => demoTotal(100, 20, count));
  assert.throws(() => demoTotal(100, 101, 1));
  assert.throws(() => demoTotal(100.5, 20, 1));
  assert.throws(() => demoTotal(Number.MAX_SAFE_INTEGER, 20, 8));
});
