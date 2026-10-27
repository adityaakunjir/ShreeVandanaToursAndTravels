import type { Metadata } from 'next';
import Link from 'next/link';
import tours from '@/data/catalogue';
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
type Props = { searchParams: Promise<RealTourParams & { page?: string }> };
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const filters = realTourFilters(params, tours);
  return {
    title: 'Domestic & international tours from Pune',
    description: `Explore ${tours.length} company-supplied tour outlines and route variants across India and the world. Find your travel mood, read the itinerary and ask for a personalised quote.`,
    alternates: { canonical: '/tours' },
    robots:
      Object.values(filters).some(Boolean) || Boolean(params.page)
        ? { index: false, follow: true }
        : undefined,
  };
}
export default async function ToursPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = realTourFilters(params, tours);
  const priority = destinations.map((d) => d.tourSlug);
  const ranked = [...tours].sort(
    (a, b) =>
      (priority.includes(a.slug) ? priority.indexOf(a.slug) : priority.length) -
      (priority.includes(b.slug) ? priority.indexOf(b.slug) : priority.length),
  );
  const found = findRealTours(ranked, filters);
  const pages = Math.max(1, Math.ceil(found.length / 12));
  const page = Math.min(
    pages,
    Math.max(1, Math.floor(Number(params.page) || 1)),
  );
  const visible = found.slice((page - 1) * 12, page * 12);
  const pageHref = (next: number) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => Boolean(value)),
    );
    query.set('page', String(next));
    return `/tours?${query}#tour-results`;
  };
  return (
    <main className="collection-page">
      <PageIntro
        path="/tours"
        eyebrow="The journey collection"
        title="Find your next trip."
        accent="Make it your own."
        description={`Explore ${tours.length} itineraries and route options across India and the world. Compare the details, then plan your dates with our Pune team.`}
      />
      <section className="section wrap">
        <TourDiscovery filters={filters} />
        <div className="brochure-results" id="tour-results">
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
          {visible.map((t) => (
            <TourCard tour={t} index={ranked.indexOf(t)} key={t.slug} />
          ))}
        </div>
        {pages > 1 && (
          <nav className="catalogue-pagination" aria-label="Tour results pages">
            {page > 1 ? (
              <Link href={pageHref(page - 1)}>← Previous</Link>
            ) : (
              <span />
            )}
            <span aria-current="page">
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link href={pageHref(page + 1)}>Next tours →</Link>
            ) : (
              <span />
            )}
          </nav>
        )}
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
