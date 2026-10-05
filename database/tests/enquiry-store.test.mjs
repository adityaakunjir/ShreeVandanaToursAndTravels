import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { parseLeadIntake } from '../../src/lib/enquiry.ts';
import {
  createEnquiryStore,
  EnquiryRetryConflict,
} from '../../src/server/enquiry-store.ts';

const url = new URL(process.env.DATABASE_TEST_URL || 'http://missing');
if (
  !['localhost', '127.0.0.1'].includes(url.hostname) ||
  !url.pathname.endsWith('_test') ||
  !['postgres:', 'postgresql:'].includes(url.protocol)
)
  throw new Error(
    'Set DATABASE_TEST_URL to an isolated local PostgreSQL database ending in _test.',
  );
const pool = new Pool({
  connectionString: url.href,
  max: 8,
  connectionTimeoutMillis: 5000,
});
const store = createEnquiryStore(
  pool,
  'isolated-test-fingerprint-secret-32-bytes',
  'ci-fixture',
);
const keys = [];
function intake(change = {}) {
  const submissionKey = randomUUID();
  keys.push(submissionKey);
  const result = parseLeadIntake(
    {
      name: 'CI Test Traveller',
      phone: '+91 90000 00000',
      email: '',
      destination: 'Test Destination',
      departure: '',
      travellers: '2',
      notes: "Quiet hotels; '); DROP TABLE travel_enquiries; --",
      contactPreference: 'whatsapp',
      consent: true,
      submissionKey,
      ...change,
    },
    '2026-10-05',
  );
  assert.equal(result.ok, true);
  return result.data;
}
test.after(async () => {
  try {
    await pool.query(
      'DELETE FROM travel_enquiry_events WHERE enquiry_id IN (SELECT id FROM travel_enquiries WHERE submission_key = ANY($1::uuid[]))',
      [keys],
    );
    await pool.query(
      'DELETE FROM travel_enquiries WHERE submission_key = ANY($1::uuid[])',
      [keys],
    );
  } finally {
    await pool.end();
  }
});
test('concurrent same-key retries create one lead and one audit event and retain literal input', async () => {
  const data = intake();
  const results = await Promise.all(
    Array.from({ length: 8 }, () => store.save(data)),
  );
  assert.equal(new Set(results.map((result) => result.reference)).size, 1);
  assert.equal(results.filter((result) => result.created).length, 1);
  const rows = await pool.query(
    'SELECT id,notes FROM travel_enquiries WHERE submission_key=$1',
    [data.submissionKey],
  );
  assert.equal(rows.rows.length, 1);
  assert.equal(rows.rows[0].notes, data.enquiry.notes);
  const events = await pool.query(
    'SELECT count(*)::int AS count FROM travel_enquiry_events WHERE enquiry_id=$1',
    [rows.rows[0].id],
  );
  assert.equal(events.rows[0].count, 1);
  assert.equal((await store.save(data)).created, false);
});
test('changed payload under the same retry key conflicts and preserves the original lead', async () => {
  const data = intake();
  await store.save(data);
  await assert.rejects(
    store.save({ ...data, enquiry: { ...data.enquiry, travellers: '3' } }),
    EnquiryRetryConflict,
  );
  const rows = await pool.query(
    'SELECT travellers FROM travel_enquiries WHERE submission_key=$1',
    [data.submissionKey],
  );
  assert.equal(rows.rows[0].travellers, 2);
});
test('audit-write failure rolls back the lead and the connection remains reusable', async () => {
  const data = intake();
  // A connection-local fault exercises real transactional rollback without
  // modifying shared tables or relying on an in-memory repository mock.
  const client = await pool.connect();
  try {
    const failingPool = {
      connect: async () => ({
        query: async (text, values) => {
          if (text.startsWith('INSERT INTO travel_enquiry_events'))
            return client.query('SELECT 1 / 0');
          return client.query(text, values);
        },
        release: () => {},
      }),
    };
    const failingStore = createEnquiryStore(
      failingPool,
      'isolated-test-fingerprint-secret-32-bytes',
      'ci-fixture',
    );
    await assert.rejects(failingStore.save(data));
    assert.equal(
      (
        await client.query(
          'SELECT count(*)::int AS count FROM travel_enquiries WHERE submission_key=$1',
          [data.submissionKey],
        )
      ).rows[0].count,
      0,
    );
  } finally {
    client.release();
  }
  assert.equal((await store.save(data)).created, true);
});
