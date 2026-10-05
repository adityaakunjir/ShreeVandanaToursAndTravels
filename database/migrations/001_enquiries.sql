-- Proposed PostgreSQL foundation. Apply through the eventual migration runner,
-- never automatically on public requests. No production database is connected.
BEGIN;
CREATE TABLE travel_enquiries (
  id uuid PRIMARY KEY,
  submission_key uuid NOT NULL UNIQUE,
  -- HMAC of the canonical intake; use an application secret, not plain PII hashing.
  request_fingerprint varchar(64) NOT NULL CHECK (request_fingerprint ~ '^[0-9a-f]{64}$'),
  name varchar(100) NOT NULL CHECK (char_length(btrim(name)) >= 2),
  phone varchar(25) NOT NULL,
  email varchar(254),
  destination varchar(120) NOT NULL CHECK (char_length(btrim(destination)) > 0),
  departure date,
  travellers integer NOT NULL CHECK (travellers BETWEEN 1 AND 100),
  notes varchar(1000) NOT NULL DEFAULT '',
  contact_preference varchar(8) NOT NULL CHECK (contact_preference IN ('whatsapp', 'phone', 'email')),
  contact_consent_at timestamptz NOT NULL,
  consent_text_version varchar(80) NOT NULL,
  -- No inferred marketing consent.
  status varchar(16) NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'assigned', 'contacted', 'quote_sent', 'accepted', 'lost')),
  assigned_operator_id uuid,
  next_action_at timestamptz,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (contact_preference <> 'email' OR NULLIF(btrim(email), '') IS NOT NULL)
);
CREATE INDEX travel_enquiries_queue_idx ON travel_enquiries (status, created_at);
CREATE INDEX travel_enquiries_followup_idx ON travel_enquiries (next_action_at) WHERE next_action_at IS NOT NULL;
CREATE TABLE travel_enquiry_events (
  id uuid PRIMARY KEY,
  enquiry_id uuid NOT NULL REFERENCES travel_enquiries(id),
  operator_id uuid,
  event_type varchar(40) NOT NULL,
  -- Do not copy names, contact numbers or message bodies into audit metadata.
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX travel_enquiry_events_history_idx ON travel_enquiry_events (enquiry_id, created_at);
COMMIT;
