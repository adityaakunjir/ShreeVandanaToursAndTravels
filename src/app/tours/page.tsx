import type { Metadata } from 'next';
import Link from 'next/link';
import tours from '@/data/tours.json';
import TourCard from '@/components/TourCard';
import { PageIntro } from '@/components/PageIntro';
import WhatsAppLink from '@/components/WhatsAppLink';
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; region?: string }>;
}): Promise<Metadata> {
  const p = await searchParams;
  return {
    title: 'Domestic & international tours from Pune',
    description:
      'Explore Shree Vandana tour itineraries across India, Dubai, Nepal, Sri Lanka, Bhutan and Egypt. View daily plans and enquire directly on WhatsApp.',
    alternates: { canonical: '/tours' },
    robots: p.q || p.region ? { index: false, follow: true } : undefined,
  };
}
export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; region?: string | string[] }>;
}) {
  const p = await searchParams;
  const q = typeof p.q === 'string' ? p.q.trim().slice(0, 120) : '';
  const region =
    p.region === 'India' || p.region === 'International' ? p.region : '';
  const found = tours.filter(
    (t) =>
      (!region ||
        (region === 'India' ? t.region === 'India' : t.region !== 'India')) &&
      [t.name, t.region, t.theme, ...t.stops]
        .join(' ')
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <main>
      <PageIntro
        path="/tours"
        eyebrow="Our tours"
        title="Find your next"
        accent="beautiful journey."
        description="Pilgrimages, mountain escapes and journeys further afield. Explore the itinerary, then chat with our Pune team about dates and your personalised quote."
      />
      <section className="section wrap">
        <form className="brochure-search" action="/tours" role="search">
          <div>
            <label htmlFor="tour-q">Where would you like to go?</label>
            <input
              id="tour-q"
              name="q"
              defaultValue={q}
              placeholder="Try Manali, Kerala or Bhutan"
              maxLength={120}
            />
          </div>
          <div>
            <label htmlFor="tour-region">Travel collection</label>
            <select id="tour-region" name="region" defaultValue={region}>
              <option value="">All journeys</option>
              <option>India</option>
              <option>International</option>
            </select>
          </div>
          <button className="button" type="submit">
            Find tours
          </button>
        </form>
        <div className="brochure-results">
          <p>
            {found.length} {found.length === 1 ? 'journey' : 'journeys'} to
            explore
          </p>
          {(q || region) && (
            <Link className="text-link" href="/tours">
              Clear filters
            </Link>
          )}
        </div>
        <div className="brochure-tour-grid">
          {found.map((t) => (
            <TourCard tour={t} index={tours.indexOf(t)} key={t.slug} />
          ))}
        </div>
        {!found.length && (
          <div className="package-empty">
            <h2>Let’s plan something for you.</h2>
            <p>
              Tell us where you want to go and we’ll help explore the options.
            </p>
            <WhatsAppLink destination={q} className="button">
              Ask on WhatsApp ↗
            </WhatsAppLink>
          </div>
        )}
        <p className="brochure-confirmation">
          Dates, availability, prices and final inclusions are confirmed by our
          team before you book.
        </p>
      </section>
    </main>
  );
}
