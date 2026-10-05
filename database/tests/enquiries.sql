BEGIN;
INSERT INTO travel_enquiries (id, submission_key, request_fingerprint, name, phone, destination, travellers, contact_preference, contact_consent_at, consent_text_version)
VALUES ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', repeat('a',64), 'CI Test Traveller', '+91 90000 00000', 'Test Destination', 2, 'whatsapp', CURRENT_TIMESTAMP, 'ci-fixture');
DO $$
BEGIN
  IF (SELECT status FROM travel_enquiries WHERE id = '00000000-0000-4000-8000-000000000001') <> 'new' THEN RAISE EXCEPTION 'Wrong initial state'; END IF;
  BEGIN
    UPDATE travel_enquiries SET travellers = 101;
    RAISE EXCEPTION 'Excessive party size accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE travel_enquiries SET contact_preference = 'email';
    RAISE EXCEPTION 'Email contact without an email accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    UPDATE travel_enquiries SET status = 'confirmed';
    RAISE EXCEPTION 'Booking status accepted on enquiry';
  EXCEPTION WHEN check_violation THEN NULL; END;
  BEGIN
    INSERT INTO travel_enquiries (id, submission_key, request_fingerprint, name, phone, destination, travellers, contact_preference, contact_consent_at, consent_text_version)
    VALUES ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000002', repeat('a',64), 'Duplicate Retry', '+91 90000 00000', 'Test Destination', 2, 'phone', CURRENT_TIMESTAMP, 'ci-fixture');
    RAISE EXCEPTION 'Duplicate submission key accepted';
  EXCEPTION WHEN unique_violation THEN NULL; END;
  BEGIN
    INSERT INTO travel_enquiry_events (id, enquiry_id, event_type) VALUES ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000099', 'created');
    RAISE EXCEPTION 'Orphan audit event accepted';
  EXCEPTION WHEN foreign_key_violation THEN NULL; END;
END $$;
INSERT INTO travel_enquiry_events (id, enquiry_id, event_type) VALUES ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'created');
ROLLBACK;
