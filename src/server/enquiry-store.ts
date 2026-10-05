import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { Pool } from 'pg';
import type { LeadIntake } from '../lib/enquiry';

export class EnquiryRetryConflict extends Error {
  constructor() {
    super(
      'Submission reference was already used for different enquiry details.',
    );
    this.name = 'EnquiryRetryConflict';
  }
}

/** Server-only persistence service; never import into a client component. */
export function createEnquiryStore(
  pool: Pool,
  fingerprintSecret: string,
  consentTextVersion: string,
) {
  if (
    Buffer.byteLength(fingerprintSecret) < 32 ||
    !consentTextVersion.trim() ||
    consentTextVersion.length > 80
  )
    throw new Error('Enquiry storage configuration is incomplete.');
  return {
    async save(
      data: LeadIntake,
    ): Promise<{ reference: string; created: boolean }> {
      const enquiry = data.enquiry;
      const fingerprint = createHmac('sha256', fingerprintSecret)
        .update(
          JSON.stringify([
            enquiry.name,
            enquiry.phone,
            enquiry.email,
            enquiry.destination,
            enquiry.departure,
            Number(enquiry.travellers),
            enquiry.notes,
            data.contactPreference,
            data.consent,
          ]),
        )
        .digest('hex');
      const client = await pool.connect();
      let discard = false;
      try {
        await client.query('BEGIN');
        await client.query("SET LOCAL statement_timeout = '5s'");
        await client.query("SET LOCAL lock_timeout = '5s'");
        const inserted = await client.query<{ id: string }>(
          `
          INSERT INTO travel_enquiries
            (id, submission_key, request_fingerprint, name, phone, email, destination,
             departure, travellers, notes, contact_preference, contact_consent_at, consent_text_version)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,CURRENT_TIMESTAMP,$12)
          ON CONFLICT (submission_key) DO NOTHING RETURNING id`,
          [
            randomUUID(),
            data.submissionKey,
            fingerprint,
            enquiry.name,
            enquiry.phone,
            enquiry.email || null,
            enquiry.destination,
            enquiry.departure || null,
            Number(enquiry.travellers),
            enquiry.notes,
            data.contactPreference,
            consentTextVersion,
          ],
        );
        let reference = inserted.rows[0]?.id;
        const created = Boolean(reference);
        if (created) {
          await client.query(
            'INSERT INTO travel_enquiry_events (id,enquiry_id,event_type) VALUES ($1,$2,$3)',
            [randomUUID(), reference, 'created'],
          );
        } else {
          const existing = await client.query<{
            id: string;
            request_fingerprint: string;
          }>(
            'SELECT id,request_fingerprint FROM travel_enquiries WHERE submission_key = $1 FOR UPDATE',
            [data.submissionKey],
          );
          const row = existing.rows[0];
          if (!row)
            throw new Error('Submission reference could not be recovered.');
          const stored = Buffer.from(row.request_fingerprint, 'hex');
          const incoming = Buffer.from(fingerprint, 'hex');
          if (
            stored.length !== incoming.length ||
            !timingSafeEqual(stored, incoming)
          )
            throw new EnquiryRetryConflict();
          reference = row.id;
        }
        await client.query('COMMIT');
        return { reference, created };
      } catch (error) {
        try {
          await client.query('ROLLBACK');
        } catch {
          discard = true;
        }
        throw error;
      } finally {
        client.release(discard);
      }
    },
  };
}
