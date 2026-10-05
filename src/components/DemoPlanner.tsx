'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ArrowUpRight } from 'lucide-react';
import type { DemoPackage } from '@/data/demo-packages';
import { rupees } from '@/data/demo-packages';
import { demoTotal } from '@/lib/demo-planner';
export default function DemoPlanner({ tour }: { tour: DemoPackage }) {
  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState('2');
  const [departure, setDeparture] = useState(
    tour.departures[0] || 'Flexible dates',
  );
  const [preference, setPreference] = useState('Relaxed pace');
  const [error, setError] = useState('');
  const count = Number(adults);
  const valid = Number.isInteger(count) && count >= 1 && count <= 8;
  const cost =
    tour.adultPaise && tour.depositPaise && valid
      ? demoTotal(tour.adultPaise, tour.depositPaise, count)
      : null;
  function review(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !valid ||
      (tour.departures.length && !tour.departures.includes(departure))
    ) {
      setError('Choose a sample departure and 1–8 adults.');
      return;
    }
    setError('');
    setStep(2);
  }
  return (
    <div className="planner-layout">
      <section className="package-panel planner-main">
        <ol className="planner-steps" aria-label="Preview progress">
          {['Your trip', 'Review', 'Finish'].map((label, index) => (
            <li
              key={label}
              aria-current={step === index + 1 ? 'step' : undefined}
            >
              <span>{step > index + 1 ? <Check size={14} /> : index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <h2
          tabIndex={-1}
          ref={(element) => {
            if (element && step > 1) element.focus();
          }}
        >
          {step === 1
            ? 'Make it your kind of journey.'
            : step === 2
              ? 'A clear picture before you go.'
              : 'You’ve reached the end of the preview.'}
        </h2>
        {step === 1 && (
          <form onSubmit={review} className="planner-form">
            <div>
              <label htmlFor="sample-departure">
                {tour.departures.length
                  ? 'Sample departure'
                  : 'Preferred travel season'}
              </label>
              <select
                id="sample-departure"
                value={departure}
                onChange={(event) => setDeparture(event.target.value)}
              >
                {(tour.departures.length
                  ? tour.departures
                  : ['Flexible dates', 'Spring', 'Summer', 'Autumn', 'Winter']
                ).map((date) => (
                  <option key={date} value={date}>
                    {tour.departures.length
                      ? new Intl.DateTimeFormat('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          timeZone: 'UTC',
                        }).format(new Date(`${date}T00:00:00Z`))
                      : date}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sample-adults">Adults</label>
              <select
                id="sample-adults"
                value={adults}
                onChange={(event) => setAdults(event.target.value)}
              >
                {Array.from({ length: 8 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1} {index ? 'adults' : 'adult'}
                  </option>
                ))}
              </select>
              <small>
                This preview supports adults only. Child pricing and room
                options will be added with real tour data.
              </small>
            </div>
            {!tour.departures.length && (
              <div>
                <label htmlFor="sample-pace">How do you like to travel?</label>
                <select
                  id="sample-pace"
                  value={preference}
                  onChange={(event) => setPreference(event.target.value)}
                >
                  {[
                    'Relaxed pace',
                    'Culture & discovery',
                    'A little adventure',
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
            {cost && (
              <p className="planner-inline-total">
                <strong>Sample party total: {rupees(cost.total)}</strong>
                <br />
                Sample deposit: {rupees(cost.deposit)} · balance:{' '}
                {rupees(cost.balance)}
                <br />
                <small>
                  Taxes included. Flights and listed extras excluded. No payment
                  collected.
                </small>
              </p>
            )}
            {error && <p role="alert">{error}</p>}
            <button className="button" type="submit">
              Review my sample trip <ArrowUpRight size={18} />
            </button>
          </form>
        )}
        {step === 2 && (
          <div className="planner-review">
            <dl>
              <div>
                <dt>Journey</dt>
                <dd>{tour.name}</dd>
              </div>
              <div>
                <dt>{tour.departures.length ? 'Sample date' : 'Season'}</dt>
                <dd>{departure}</dd>
              </div>
              <div>
                <dt>Travellers</dt>
                <dd>
                  {count} {count === 1 ? 'adult' : 'adults'}
                </dd>
              </div>
              {!tour.departures.length && (
                <div>
                  <dt>Travel style</dt>
                  <dd>{preference}</dd>
                </div>
              )}
            </dl>
            {cost && (
              <p className="planner-inline-total">
                <strong>Sample party total: {rupees(cost.total)}</strong>
                <br />
                Sample deposit: {rupees(cost.deposit)} · balance:{' '}
                {rupees(cost.balance)}
              </p>
            )}
            <p className="package-policy-note">
              Demo only: no availability has been checked and no reservation
              will be made. Real booking requires approved tour terms, current
              inventory and secure payment confirmation.
            </p>
            <div className="planner-actions">
              <button className="text-link" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Edit trip
              </button>
              <button className="button" onClick={() => setStep(3)}>
                Finish preview <Check size={18} />
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="planner-finish">
            <p>
              Your selections were used only to demonstrate the journey.{' '}
              <strong>
                No booking or quote request was submitted, and nothing was
                charged.
              </strong>
            </p>
            <Link className="button" href="/packages">
              Explore more sample tours →
            </Link>
            <Link
              className="text-link"
              href={`/enquire?destination=${encodeURIComponent(tour.destination)}`}
            >
              Plan a real {tour.destination} holiday with our team →
            </Link>
            <button className="text-link" onClick={() => setStep(1)}>
              Start this preview again
            </button>
          </div>
        )}
      </section>
      <aside className="package-summary planner-cost">
        <p className="eyebrow">Sample trip summary</p>
        <h3>{tour.name}</h3>
        <p>
          {tour.days} days · {tour.nights} nights · {count} adults
        </p>
        {cost ? (
          <>
            <dl className="cost-lines">
              <div>
                <dt>Adult price × {count}</dt>
                <dd>{rupees(cost.total)}</dd>
              </div>
              <div>
                <dt>Taxes</dt>
                <dd>Included in sample total</dd>
              </div>
              <div className="cost-total">
                <dt>Sample total</dt>
                <dd>{rupees(cost.total)}</dd>
              </div>
              <div>
                <dt>Sample deposit</dt>
                <dd>{rupees(cost.deposit)}</dd>
              </div>
              <div>
                <dt>Sample remaining balance</dt>
                <dd>{rupees(cost.balance)}</dd>
              </div>
            </dl>
            <p>
              Price assumes twin sharing. Flights, visa, insurance and unlisted
              extras are excluded. No payment is collected.
            </p>
          </>
        ) : (
          <>
            <h2>Quote on request.</h2>
            <p>
              A real quote would confirm your hotels, dates, inclusions and
              total cost before you commit. This preview has no payable price.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
