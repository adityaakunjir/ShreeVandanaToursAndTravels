# Enquiry storage foundation

The public form still prepares WhatsApp/email drafts. No database connection,
storage endpoint or operations console is active. This is the first backend
foundation, not a claim that persistent enquiries are ready.

`parseLeadIntake` in src/lib/enquiry.ts accepts only the known enquiry fields,
explicit contact consent, a selected contact channel and a UUID v4 retry key.
It rejects unexpected status/price fields, malformed values, impossible/past
dates, excessive party sizes and control characters. Email preference requires
an email address. Contact consent does not imply marketing consent.

`database/migrations/001_enquiries.sql` proposes PostgreSQL storage with a
unique submission key, contact consent time/text version, indexed work queue,
follow-up time and audit events. PostgreSQL CHECK, UNIQUE and foreign-key
constraints complement server validation; they do not replace authentication
or workflow authorization. Source: [PostgreSQL constraints documentation](https://www.postgresql.org/docs/18/ddl-constraints.html).

GitHub CI uses an isolated PostgreSQL 18 service, applies the migration and
runs database/tests/enquiries.sql. The public fixture password is only for this
temporary CI service; no production credential is stored in the repository.
Local Docker was unavailable during implementation.

Next integration requirements:

1. Choose hosting and connect a private managed database; configure scoped
   application/migration roles and backups. Apply versioned migrations before
   enabling intake, not on public requests.
2. Implement bounded JSON request parsing, server validation, origin checks,
   distributed rate limiting and spam controls. Preserve a retry key across
   network retries. HMAC the canonical normalized payload using a server secret.
3. Insert enquiry and created audit event in one transaction. A retry with the
   same key and payload returns the existing reference; a changed payload with
   the same key returns a conflict. Enforce this via database uniqueness, not
   an in-memory pre-check. Return success only after the transaction commits.
4. Publish approved privacy/contact-consent wording and retention rules. Build
   authenticated staff access and assignment before accepting live enquiries.
   Enquiry IDs are references, not access credentials. Never expose PII through
   unauthenticated reference lookup or log request bodies.
5. Wire the form with pending/error/retry states that preserve input, then test
   concurrent duplicate submissions, storage failure, refresh and interrupted
   responses. Notify staff via an idempotent outbox after commit; a notification
   failure must not erase a stored enquiry or create a false submission failure.

These prerequisites remain part of the full travel-platform goal. Real tour
records are deferred by the user and are not needed to complete lead storage.
