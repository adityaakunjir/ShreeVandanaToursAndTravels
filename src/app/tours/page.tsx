import type { Metadata } from 'next';
import Link from 'next/link';
import tours from '@/data/tours.json';
import { destinations } from '@/data/site';
import TourCard from '@/components/TourCard';
import TourDiscovery from '@/components/TourDiscovery';
import { PageIntro } from '@/components/PageIntro';
import WhatsAppLink from '@/components/WhatsAppLink';
import {
  findRealTours,
  realTourFilters,
  type RealTourParams,
} from '@/lib/real-tours';
type Props = { searchParams: Promise<RealTourParams> };
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const filters = realTourFilters(await searchParams, tours);
  return {
    title: 'Domestic & international tours from Pune',
    description:
      'Explore eleven thoughtfully planned journeys across India, Dubai, Nepal, Sri Lanka, Bhutan and Egypt. Find your travel style, read the itinerary and ask for a personalised quote.',
    alternates: { canonical: '/tours' },
    robots: Object.values(filters).some(Boolean)
      ? { index: false, follow: true }
      : undefined,
  };
}
export default async function ToursPage({ searchParams }: Props) {
  const filters = realTourFilters(await searchParams, tours);
  const priority = destinations.map((d) => d.tourSlug);
  const ranked = [...tours].sort(
    (a, b) =>
      (priority.includes(a.slug) ? priority.indexOf(a.slug) : priority.length) -
      (priority.includes(b.slug) ? priority.indexOf(b.slug) : priority.length),
  );
  const found = findRealTours(ranked, filters);
  return (
    <main className="collection-page">
      <PageIntro
        path="/tours"
        eyebrow="The journey collection"
        title="A world to discover."
        accent="A journey that’s yours."
        description="Eleven journeys. Countless ways to make them personal. Find your kind of holiday, explore the route, then talk dates and details with our Pune team."
      />
      <section className="section wrap">
        <TourDiscovery filters={filters} />
        <div className="brochure-results">
          <p>
            {found.length} {found.length === 1 ? 'journey' : 'journeys'} to
            explore
          </p>
          <div className="collection-links">
            <Link href="/tours/saved">Saved tours</Link>
            <Link href="/tours/compare">Compare</Link>
            {Object.values(filters).some(Boolean) && (
              <Link href="/tours">Clear filters</Link>
            )}
          </div>
        </div>
        <div className="brochure-tour-grid">
          {found.map((t) => (
            <TourCard tour={t} index={ranked.indexOf(t)} key={t.slug} />
          ))}
        </div>
        {!found.length && (
          <div className="package-empty">
            <p className="eyebrow">Let curiosity lead</p>
            <h2>There’s more than one way to get away.</h2>
            <p>
              Try another filter, or tell us about the holiday you have in mind.
            </p>
            <Link href="/tours" className="button outline">
              See all journeys
            </Link>{' '}
            <WhatsAppLink destination={filters.q} className="button">
              Ask on WhatsApp ↗
            </WhatsAppLink>
          </div>
        )}
        <p className="brochure-confirmation">
          Tour outlines are a starting point. Dates, availability, prices and
          final inclusions are confirmed by our team before you book.
        </p>
      </section>
    </main>
  );
}
