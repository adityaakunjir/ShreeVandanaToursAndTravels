import WhatsAppLink from '@/components/WhatsAppLink';
import type { Metadata } from 'next';
import Image from '@/components/TravelImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ArrowUpRight } from 'lucide-react';
import { getDemoPackages, rupees } from '@/data/demo-packages';
import DemoNotice from '@/components/DemoNotice';
import { SaveTour } from '@/components/Shortlist';
import ShareTour from '@/components/ShareTour';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sample tour details',
  robots: { index: false, follow: false },
};
export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getDemoPackages().find((item) => item.slug === slug);
  if (!tour) notFound();
  return (
    <main className="wrap package-detail">
      <div className="breadcrumb">
        <Link href="/packages">Tour collection</Link>
        <span> / {tour.destination}</span>
      </div>
      <DemoNotice />
      <div className="package-detail-grid">
        <div>
          <p className="eyebrow">
            {tour.theme} · {tour.country}
          </p>
          <h1>{tour.name}</h1>
          <p className="package-lead">{tour.summary}</p>
          <div className="tour-detail-tools">
            <SaveTour slug={tour.slug} name={tour.name} />
            <ShareTour />
            <Link className="text-link" href="/packages/saved">
              Your shortlist →
            </Link>
          </div>
          <div className="package-facts">
            <span>
              {tour.days} days / {tour.nights} nights
            </span>
            <span>
              {tour.model === 'fixed-departure'
                ? 'Sample group departure'
                : 'A private, personalised holiday'}
            </span>
          </div>
          <div className="package-detail-photo">
            <Image
              src={`/assets/images/${tour.image}`}
              fill
              sizes="(max-width:900px) calc(100vw - 40px), 700px"
              alt={`${tour.destination} travel inspiration`}
              loading="eager"
            />
          </div>
        </div>
        <aside className="package-summary">
          <p className="eyebrow">Your journey, at a glance</p>
          <h2>{tour.adultPaise ? rupees(tour.adultPaise) : 'Made for you.'}</h2>
          <p>
            {tour.adultPaise
              ? 'Sample price per adult, twin sharing. Taxes included; international flights and visa excluded.'
              : 'Your real dates, hotels and preferences would shape a personalised quote.'}
          </p>
          <hr />
          <p>
            <strong>{tour.days} days of discovery</strong>
            <br />
            {tour.nights} nights · {tour.destination}
          </p>
          <p>
            {tour.adultPaise
              ? 'Demo departure dates and totals are available in the planner.'
              : 'Explore the custom-holiday request flow without submitting anything.'}
          </p>
          <Link className="button" href={`/packages/${tour.slug}/plan`}>
            {tour.adultPaise ? 'Preview booking' : 'Preview custom plan'}{' '}
            <ArrowUpRight size={18} />
          </Link>
          <small>
            Demo only. No seats held, payment taken or booking confirmed.
          </small>
          <WhatsAppLink className="text-link" destination={tour.destination}>
            Ask about a real {tour.destination} holiday →
          </WhatsAppLink>
        </aside>
      </div>
      <div className="package-content-grid">
        <section className="package-panel">
          <p className="eyebrow">The journey unfolds</p>
          <h2>A little more, day by day.</h2>
          <div className="itinerary-list">
            {tour.itinerary.map((day, index) => (
              <details key={day.title} open={index === 0}>
                <summary>
                  <span className="itinerary-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    Day {index + 1}
                    <strong>{day.title}</strong>
                  </span>
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{day.description}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="package-panel">
          <p className="eyebrow">No guesswork</p>
          <h2>What’s in. What’s extra.</h2>
          <h3>Sample inclusions</h3>
          <ul className="package-checks">
            {tour.inclusions.map((item) => (
              <li key={item}>
                <Check size={17} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3>Sample exclusions</h3>
          <ul>
            {tour.exclusions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="package-policy-note">
            These are design examples. Actual hotel names, room options, child
            prices, departure city, payment schedule and cancellation/refund
            terms will be published with approved tours before real bookings are
            enabled.
          </p>
        </section>
      </div>
      <nav className="tour-mobile-bar" aria-label="Sample tour planning">
        <div>
          <small>
            Design preview · {tour.adultPaise ? 'per adult' : 'custom holiday'}
          </small>
          <strong>
            {tour.adultPaise ? rupees(tour.adultPaise) : 'Quote on request'}
          </strong>
          <small>
            {tour.adultPaise
              ? 'Twin sharing · taxes in · flights extra'
              : 'No confirmed price or availability'}
          </small>
        </div>
        <Link className="button" href={`/packages/${tour.slug}/plan`}>
          Preview plan <ArrowUpRight size={17} />
        </Link>
      </nav>
    </main>
  );
}
