import type { Metadata } from 'next';
import Link from 'next/link';
import DestinationGrid from '@/components/DestinationGrid';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import { destinations } from '@/data/site';
import { filterDestinations, searchValue } from '@/lib/discovery';
type Props = {
  searchParams: Promise<{ q?: string | string[]; style?: string | string[] }>;
};
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  return {
    title: 'Discover destinations',
    description:
      'Find holiday inspiration by destination, country and travel style. Plan a personalised trip with our Pune travel team.',
    alternates: { canonical: '/destinations' },
    robots:
      searchValue(params.q) || searchValue(params.style)
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}
export default async function DestinationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = searchValue(params.q);
  const styles = [...new Set(destinations.map((item) => item.tag))];
  const requestedStyle = searchValue(params.style);
  const style = styles.includes(requestedStyle) ? requestedStyle : '';
  const matches = filterDestinations(destinations, query, style);
  return (
    <main>
      <PageIntro
        path="/destinations"
        eyebrow="Discover destinations"
        title="Follow your curiosity."
        accent="Find your kind of escape."
        description="A little inspiration for your next holiday. Every journey is personalised around your dates, interests and the people travelling with you."
      />
      <section className="section wrap">
        <form
          action="/destinations"
          method="get"
          className="discovery-search"
          role="search"
          aria-label="Find destination inspiration"
        >
          <div>
            <label htmlFor="destination-search">
              Where would you like to go?
            </label>
            <input
              id="destination-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Try Dubai, Japan or canals"
              maxLength={100}
            />
          </div>
          <div>
            <label htmlFor="travel-style">Your travel style</label>
            <select id="travel-style" name="style" defaultValue={style}>
              <option value="">All travel styles</option>
              {styles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <button className="button" type="submit">
            Find inspiration →
          </button>
        </form>
        <div className="discovery-results">
          <p>
            {matches.length}{' '}
            {matches.length === 1 ? 'destination' : 'destinations'}
            {query ? ` matching “${query}”` : ' to inspire your next journey'}
            {style ? ` · ${style}` : ''}
          </p>
          {(query || style) && (
            <Link href="/destinations" className="text-link">
              Clear filters
            </Link>
          )}
        </div>
        {matches.length ? (
          <DestinationGrid items={matches} />
        ) : (
          <div className="discovery-empty">
            <h2>Your journey can go beyond this collection.</h2>
            <p>
              Try a different destination or travel style, or tell our team what
              you have in mind. This collection is inspiration; dates and prices
              are confirmed in your personalised quote.
            </p>
            <Link
              className="button"
              href={
                query
                  ? `/enquire?destination=${encodeURIComponent(query)}`
                  : '/enquire'
              }
            >
              Plan a custom holiday →
            </Link>
          </div>
        )}
        <div className="destination-note">
          <span>
            Looking for a holiday in India, or somewhere beyond this collection?
          </span>
          <Link href="/enquire">Tell us your destination →</Link>
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
