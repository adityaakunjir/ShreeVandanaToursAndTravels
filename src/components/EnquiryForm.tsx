'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, MessageCircle, Mail } from 'lucide-react';
import { business } from '@/data/site';
import {
  enquiryLinks,
  enquiryMessage,
  indiaToday,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from '@/lib/enquiry';
export default function EnquiryForm({
  destination,
  today,
}: {
  destination: string;
  today: string;
}) {
  const [data, setData] = useState<Enquiry>({
    name: '',
    phone: '',
    email: '',
    destination,
    departure: '',
    travellers: '2',
    notes: '',
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [ready, setReady] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (ready) result.current?.focus();
  }, [ready]);
  function update(key: keyof Enquiry, value: string) {
    setData((previous) => ({ ...previous, [key]: value }));
    setReady(false);
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateEnquiry(data, indiaToday());
    setErrors(validation);
    if (Object.keys(validation).length) {
      setReady(false);
      const first = Object.keys(validation)[0];
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setReady(true);
  }
  const field = (
    key: keyof Enquiry,
    label: string,
    type = 'text',
    optional = false,
    placeholder = '',
  ) => (
    <div className={`field ${key === 'destination' ? 'full' : ''}`}>
      <label htmlFor={`enquiry-${key}`}>
        {label} {optional && <span>(optional)</span>}
      </label>
      <input
        id={`enquiry-${key}`}
        name={key}
        type={type}
        inputMode={
          key === 'phone'
            ? 'tel'
            : key === 'travellers'
              ? 'numeric'
              : key === 'email'
                ? 'email'
                : undefined
        }
        required={!optional}
        value={data[key]}
        onChange={(event) => update(key, event.target.value)}
        placeholder={placeholder}
        min={key === 'departure' ? today : key === 'travellers' ? 1 : undefined}
        max={key === 'travellers' ? 100 : undefined}
        maxLength={
          key === 'name'
            ? 100
            : key === 'phone'
              ? 25
              : key === 'destination'
                ? 120
                : key === 'email'
                  ? 254
                  : undefined
        }
        autoComplete={
          key === 'name'
            ? 'name'
            : key === 'phone'
              ? 'tel'
              : key === 'email'
                ? 'email'
                : undefined
        }
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${key}-error` : undefined}
      />
      {errors[key] && (
        <p className="field-error" id={`${key}-error`}>
          {errors[key]}
        </p>
      )}
    </div>
  );
  const links = enquiryLinks(
    data,
    business.phones[0].number,
    business.contact.email,
  );
  return (
    <div className="enquiry-card">
      <h2>A few details. A world of possibilities.</h2>
      <p className="form-intro">
        Share your ideas and choose how you’d like to contact us.
      </p>
      <form ref={form} onSubmit={submit} noValidate>
        <div className="form-grid">
          {field('name', 'Your name', 'text', false, 'Your full name')}
          {field('phone', 'Contact number', 'tel', false, '+91 …')}
          {field('email', 'Email address', 'email', true, 'you@example.com')}
          {field('travellers', 'Number of travellers', 'number')}
          {field(
            'destination',
            'Where would you like to go?',
            'text',
            false,
            'A destination, or “Help me choose”',
          )}
          {field('departure', 'Preferred departure', 'date', true)}
          <div className="field full">
            <label htmlFor="enquiry-notes">
              Anything else? <span>(optional)</span>
            </label>
            <textarea
              name="notes"
              id="enquiry-notes"
              rows={4}
              maxLength={1000}
              value={data.notes}
              onChange={(event) => update('notes', event.target.value)}
              placeholder="Your budget, interests, trip length or special requests…"
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={errors.notes ? 'notes-error' : undefined}
            />
            {errors.notes && (
              <p className="field-error" id="notes-error">
                {errors.notes}
              </p>
            )}
          </div>
        </div>
        <p className="form-note">
          These details stay in this page until you open WhatsApp or your email
          app. Nothing is sent or booked automatically. You can review the
          message before sending.
        </p>
        <button className="button" type="submit">
          Prepare my enquiry <ArrowUpRight size={18} />
        </button>
      </form>
      {ready && (
        <div
          ref={result}
          className="form-result"
          tabIndex={-1}
          role="region"
          aria-label="Your enquiry is ready"
        >
          <h3>Your enquiry is ready.</h3>
          <p>
            Choose an app, review your message and send it to our team. This is
            an enquiry, not a confirmed booking.
          </p>
          <div className="result-links">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              <MessageCircle size={18} /> Open WhatsApp{' '}
              <ArrowUpRight size={16} />
            </a>
            <a href={links.email} className="text-link">
              <Mail size={17} /> Open email draft
            </a>
          </div>
          <details>
            <summary>Preview your message</summary>
            <pre>{enquiryMessage(data)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
