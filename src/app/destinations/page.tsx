import MoreDestinations from '@/components/MoreDestinations';
import DestinationAtlas from '@/components/DestinationAtlas';
import WhatsAppLink from '@/components/WhatsAppLink';
import type { Metadata } from 'next';
import Link from 'next/link';
import DestinationGrid from '@/components/DestinationGrid';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import { destinations, additionalDestinations } from '@/data/site';
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
  const additionalMatches = style
    ? []
    : additionalDestinations.filter((name) =>
        name.toLowerCase().includes(query.toLowerCase()),
      );
  const resultCount = matches.length + additionalMatches.length;
  return (
    <main className="collection-page">
      <PageIntro
        path="/destinations"
        eyebrow="Discover destinations"
        title="Follow your curiosity."
        accent="Find your kind of escape."
        description="Start with our most-booked destinations: Dubai, Nepal, Kerala, Kashmir and Sikkim–Darjeeling. Every holiday is personalised around your dates and interests."
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
              placeholder="Try Dubai, Kerala or Darjeeling"
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
            {resultCount} {resultCount === 1 ? 'destination' : 'destinations'}
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
        ) : additionalMatches.length ? null : (
          <div className="discovery-empty">
            <h2>Your journey can go beyond this collection.</h2>
            <p>
              Try a different destination or travel style, or tell our team what
              you have in mind. This collection is inspiration; dates and prices
              are confirmed in your personalised quote.
            </p>
            <WhatsAppLink className="button" destination={query}>
              Plan a custom holiday →
            </WhatsAppLink>
          </div>
        )}
        {!style && <MoreDestinations query={query} />}
        <div className="destination-note">
          <span>
            Looking for a holiday in India, or somewhere beyond this collection?
          </span>
          <WhatsAppLink>Tell us your destination →</WhatsAppLink>
        </div>
      </section>
      <JourneyCTA />
      <DestinationAtlas />
    </main>
  );
}
