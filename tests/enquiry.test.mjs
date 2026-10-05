import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEnquiry,
  enquiryLinks,
  enquiryMessage,
  indiaToday,
} from '../src/lib/enquiry.ts';
const valid = {
  name: 'Test Traveller',
  phone: '+91 90000 00000',
  email: '',
  destination: 'Dubai & Abu Dhabi',
  departure: '',
  travellers: '2',
  notes: '',
};
test('accepts a flexible-date enquiry without email', () =>
  assert.deepEqual(validateEnquiry(valid, '2026-10-05'), {}));
test('rejects missing contact and invalid traveller counts', () => {
  for (const travellers of ['0', '-2', '1.5', '101', 'two'])
    assert.ok(
      validateEnquiry({ ...valid, travellers }, '2026-10-05').travellers,
    );
  assert.ok(validateEnquiry({ ...valid, phone: '++----' }, '2026-10-05').phone);
  assert.ok(
    validateEnquiry({ ...valid, name: ' ', destination: '' }, '2026-10-05')
      .name,
  );
});
test('rejects past and impossible dates but accepts today', () => {
  for (const departure of ['2026-10-04', '2027-02-30', 'not-a-date'])
    assert.ok(validateEnquiry({ ...valid, departure }, '2026-10-05').departure);
  assert.deepEqual(
    validateEnquiry({ ...valid, departure: '2026-10-05' }, '2026-10-05'),
    {},
  );
});
test('uses Indian calendar date at UTC day boundary', () =>
  assert.equal(indiaToday(new Date('2026-10-04T19:00:00Z')), '2026-10-05'));
test('preserves punctuation and line breaks in draft links', () => {
  const data = { ...valid, notes: 'Beach & culture?\nBudget to discuss.' };
  const links = enquiryLinks(data, '919665238966', 'sales.svttpune@gmail.com');
  const url = new URL(links.whatsapp);
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/919665238966');
  assert.equal(url.searchParams.get('text'), enquiryMessage(data));
  const mail = new URL(links.email);
  assert.equal(mail.protocol, 'mailto:');
  assert.equal(mail.searchParams.get('body'), enquiryMessage(data));
});
test('rejects malformed email and overlong messages', () => {
  assert.ok(
    validateEnquiry({ ...valid, email: 'invalid@' }, '2026-10-05').email,
  );
  assert.ok(
    validateEnquiry({ ...valid, notes: 'x'.repeat(1001) }, '2026-10-05').notes,
  );
});
