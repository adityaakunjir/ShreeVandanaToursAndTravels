import assert from 'node:assert/strict';
import test from 'node:test';
import { mediaPolicy } from '../src/lib/media-policy.ts';

test('explicit data-saving and reduced-motion preferences prevent automatic downloads', () => {
  for (const input of [{ connection: { saveData: true } }, { reduced: true }]) {
    assert.equal(
      mediaPolicy({ wide: false, cores: 8, memory: 8, ...input }).autoplay,
      false,
    );
  }
});
test('high-capacity devices receive portrait HD or desktop full HD', () => {
  const device = {
    cores: 8,
    memory: 8,
    connection: { downlink: 20, effectiveType: '4g' },
  };
  assert.equal(mediaPolicy({ ...device, wide: false }).profile, 'mobile');
  assert.equal(mediaPolicy({ ...device, wide: true }).profile, 'desktop');
  assert.equal(mediaPolicy({ ...device, wide: true }).richMotion, true);
});
test('modest devices and connections automatically receive lighter files', () => {
  assert.equal(mediaPolicy({ wide: false }).profile, 'lite');
  assert.equal(mediaPolicy({ wide: true, cores: 4 }).profile, 'balanced');
  assert.equal(
    mediaPolicy({ wide: false, cores: 8, connection: { saveData: true } })
      .profile,
    'lite',
  );
  assert.equal(
    mediaPolicy({
      wide: false,
      cores: 2,
      memory: 2,
      connection: { downlink: 0.3 },
    }).autoplay,
    true,
  );
});
