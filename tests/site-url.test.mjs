import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalOrigin } from '../src/lib/site-url.ts';
test('business canonicals match the served www host even with the old environment value', () => {
  assert.equal(
    canonicalOrigin('https://shreevandanatoursandtravels.com'),
    'https://www.shreevandanatoursandtravels.com',
  );
  assert.equal(
    canonicalOrigin('https://www.shreevandanatoursandtravels.com/'),
    'https://www.shreevandanatoursandtravels.com',
  );
});
test('preserves other project, CI and local origins', () => {
  assert.equal(canonicalOrigin('https://example.com/'), 'https://example.com');
  assert.equal(
    canonicalOrigin('http://localhost:3002/'),
    'http://localhost:3002',
  );
});
