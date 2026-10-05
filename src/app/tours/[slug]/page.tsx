import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, ArrowUpRight, Phone } from 'lucide-react';
import tours from '@/data/tours.json';
import Breadcrumb from '@/components/Breadcrumb';
import WhatsAppLink from '@/components/WhatsAppLink';
import { business } from '@/data/site';
export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = tours.find((t) => t.slug === slug);
  if (!t) return {};
  return {
    title: t.name + ' tour from Pune',
    description:
      t.summary +
      ' View the route and enquire on WhatsApp for dates and a quote.',
    alternates: { canonical: `/tours/${t.slug}` },
  };
}
export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();
  const duration = tour.duration || tour.days.length;
  return (
    <main className="brochure-detail wrap">
      <Breadcrumb
        items={[
          { name: 'Home', path: '/' },
          { name: 'Our tours', path: '/tours' },
          { name: tour.name, path: `/tours/${tour.slug}` },
        ]}
      />
      <div className="brochure-detail-hero">
        <div>
          <p className="eyebrow">
            {tour.region} · {tour.theme} · {duration} days
          </p>
          <h1>{tour.name}</h1>
          <p className="brochure-lead">{tour.summary}</p>
          <div className="brochure-route" aria-label="Tour route">
            {tour.stops.map((stop) => (
              <span key={stop}>{stop}</span>
            ))}
          </div>
        </div>
        <aside className="brochure-enquire">
          <p className="eyebrow">Your next journey</p>
          <h2>Let’s make it yours.</h2>
          <p>
            Ask our team for travel dates, availability and a quote for your
            group.
          </p>
          <WhatsAppLink
            destination={`the ${duration}-day ${tour.name} tour`}
            className="button"
          >
            Enquire on WhatsApp <ArrowUpRight size={18} />
          </WhatsAppLink>
          <a className="text-link" href={`tel:+${business.phones[0].number}`}>
            <Phone size={16} />
            Prefer to call?
          </a>
          <small>
            No booking commitment. Our team confirms the final itinerary and
            price.
          </small>
        </aside>
      </div>
      <div className="package-content-grid">
        <section className="package-panel">
          <p className="eyebrow">The journey unfolds</p>
          <h2>Your itinerary, day by day.</h2>
          {tour.days.length ? (
            <div className="itinerary-list">
              {tour.days.map((day, i) => (
                <details key={day.title} open={i === 0}>
                  <summary>
                    <span className="itinerary-number">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      Day {i + 1}
                      <strong>{day.title}</strong>
                    </span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{day.description}</p>
                </details>
              ))}
            </div>
          ) : (
            <>
              <p>
                This {duration}-day tour visits {tour.stops.join(', ')}. Our
                team will share the detailed daily plan with your quote.
              </p>
              {'highlights' in tour && tour.highlights && (
                <ul className="brochure-exclusions">
                  {tour.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <WhatsAppLink
                destination={tour.name + ' daily itinerary'}
                className="text-link"
              >
                Request the itinerary ↗
              </WhatsAppLink>
            </>
          )}
        </section>
        <section className="package-panel">
          <p className="eyebrow">The details that matter</p>
          <h2>What’s included.</h2>
          <p className="brochure-small">
            The tour outline includes the following. Confirm your selected
            departure’s arrangements with our team.
          </p>
          <ul className="brochure-inclusions">
            {tour.includes.map((item) => (
              <li key={item}>
                <Check size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3>What’s extra</h3>
          <ul className="brochure-exclusions">
            {tour.excludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <section className="brochure-before">
        <p className="eyebrow">Before you go</p>
        <h2>A few helpful details.</h2>
        <ul>
          {tour.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
          <li>
            Dates, prices, accommodation, transport, taxes and cancellation
            terms are confirmed in your final quotation. Sightseeing may change
            with permits, weather and local operating conditions.
          </li>
        </ul>
        <WhatsAppLink destination={tour.name} className="button">
          Let’s talk about this tour <ArrowUpRight size={18} />
        </WhatsAppLink>
      </section>
      <nav className="brochure-mobile-action" aria-label="Tour enquiry">
        <div>
          <strong>{duration} days</strong>
          <span>Price on enquiry</span>
        </div>
        <WhatsAppLink destination={tour.name} className="button">
          WhatsApp <ArrowUpRight size={16} />
        </WhatsAppLink>
      </nav>
    </main>
  );
}
