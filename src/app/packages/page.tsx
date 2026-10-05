import WhatsAppLink from '@/components/WhatsAppLink';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { getDemoPackages, rupees } from '@/data/demo-packages';
import {
  tourFilters,
  searchTours,
  type TourSearchParams,
} from '@/lib/tour-search';
import { PageIntro } from '@/components/PageIntro';
import DemoNotice from '@/components/DemoNotice';
import { SaveTour } from '@/components/Shortlist';
export const metadata: Metadata = {
  title: 'Tour collection preview',
  robots: { index: false, follow: false },
};
export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<TourSearchParams>;
}) {
  const params = await searchParams;
  const catalogue = getDemoPackages();
  const themes = [...new Set(catalogue.map((item) => item.theme))];
  const months = [
    ...new Set(
      catalogue.flatMap((item) =>
        item.departures.map((date) => date.slice(0, 7)),
      ),
    ),
  ].sort();
  const filters = tourFilters(params, themes);
  const { q, model, sort, month, duration, budget, theme } = filters;
  const items = searchTours(catalogue, filters);
  const hasFilters = Boolean(
    q || model || month || duration || budget || theme || sort !== 'collection',
  );
  return (
    <main>
      <PageIntro
        eyebrow="Tour collection"
        title="Find a journey"
        accent="that feels like you."
        description="Explore the package experience: clear itineraries, considered details and a simple next step."
      />
      <section className="wrap section">
        {catalogue.length ? (
          <>
            <DemoNotice />
            <div className="collection-tools">
              <Link className="text-link" href="/packages/saved">
                Your saved tours ♡
              </Link>
              <Link className="text-link" href="/packages/compare">
                Compare journeys →
              </Link>
            </div>
            <form
              action="/packages"
              method="get"
              className="discovery-search package-search"
              role="search"
              aria-label="Search sample tours"
            >
              <div>
                <label htmlFor="tour-search">Destination or experience</label>
                <input
                  id="tour-search"
                  type="search"
                  name="q"
                  defaultValue={q}
                  maxLength={100}
                  placeholder="Dubai, Japan, slow & scenic"
                />
              </div>
              <div>
                <label htmlFor="tour-type">Journey type</label>
                <select id="tour-type" name="model" defaultValue={model}>
                  <option value="">All journeys</option>
                  <option value="fixed-departure">Fixed departures</option>
                  <option value="custom-holiday">Customised holidays</option>
                </select>
              </div>
              <div>
                <label htmlFor="tour-sort">Sort by</label>
                <select id="tour-sort" name="sort" defaultValue={sort}>
                  <option value="collection">Collection order</option>
                  <option value="price">Sample price: low to high</option>
                  <option value="departure">Next sample departure</option>
                </select>
              </div>
              <details
                className="tour-more-filters"
                open={Boolean(month || duration || budget || theme)}
              >
                <summary>
                  Refine your journey <span>Month, length, style & budget</span>
                </summary>
                <div className="tour-filter-grid">
                  <div>
                    <label htmlFor="tour-month">Sample departure month</label>
                    <select id="tour-month" name="month" defaultValue={month}>
                      <option value="">Any month</option>
                      {months.map((value) => (
                        <option key={value} value={value}>
                          {new Intl.DateTimeFormat('en-IN', {
                            month: 'long',
                            year: 'numeric',
                            timeZone: 'UTC',
                          }).format(new Date(`${value}-01T00:00:00Z`))}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tour-duration">Time away</label>
                    <select
                      id="tour-duration"
                      name="duration"
                      defaultValue={duration}
                    >
                      <option value="">Any length</option>
                      <option value="short">Up to 4 days</option>
                      <option value="long">5 days or more</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tour-theme">Travel style</label>
                    <select id="tour-theme" name="theme" defaultValue={theme}>
                      <option value="">All styles</option>
                      {themes.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tour-budget">Sample budget per adult</label>
                    <select
                      id="tour-budget"
                      name="budget"
                      defaultValue={budget}
                    >
                      <option value="">Any budget</option>
                      <option value="50000">Up to ₹50,000</option>
                      <option value="75000">Up to ₹75,000</option>
                      <option value="100000">Up to ₹1,00,000</option>
                    </select>
                  </div>
                </div>
                <p className="tour-filter-note">
                  Month filters apply to sample fixed departures. Budget filters
                  exclude quote-only holidays and use the displayed adult price;
                  flights and other extras are excluded.
                </p>
              </details>
              <button type="submit" className="button">
                Find my journey →
              </button>
            </form>
            <div className="discovery-results">
              <p>
                {items.length} sample{' '}
                {items.length === 1 ? 'journey' : 'journeys'}
                {sort === 'price' ? ' · Quote-only tours appear last' : ''}
              </p>
              {hasFilters && (
                <Link className="text-link" href="/packages">
                  Clear filters
                </Link>
              )}
            </div>
            <div className="package-grid">
              {items.map((item) => (
                <article className="package-card" key={item.slug}>
                  <Link
                    className="package-photo"
                    href={`/packages/${item.slug}`}
                    aria-label={`View sample tour: ${item.name}`}
                  >
                    <Image
                      src={`/assets/images/${item.image}`}
                      alt={`${item.destination} inspiration`}
                      fill
                      sizes="(max-width:640px) calc(100vw - 40px), (max-width:900px) 45vw, 380px"
                    />
                    <span className="travel-tag">
                      Sample ·{' '}
                      {item.model === 'fixed-departure'
                        ? 'Fixed departure'
                        : 'Custom holiday'}
                    </span>
                  </Link>
                  <div className="package-card-body">
                    <p className="eyebrow">{item.theme}</p>
                    <h2>
                      <Link href={`/packages/${item.slug}`}>{item.name}</Link>
                    </h2>
                    <p>{item.summary}</p>
                    <div className="package-facts">
                      <span>
                        <Clock size={15} /> {item.days} days · {item.nights}{' '}
                        nights
                      </span>
                      <span>
                        <MapPin size={15} /> {item.country}
                      </span>
                    </div>
                    <div className="package-price">
                      <div>
                        <small>
                          {item.adultPaise
                            ? 'Sample adult price · twin sharing'
                            : 'Personalised around you'}
                        </small>
                        <strong>
                          {item.adultPaise
                            ? rupees(item.adultPaise)
                            : 'Quote on request'}
                        </strong>
                        {item.adultPaise && (
                          <small>Taxes included · flights excluded</small>
                        )}
                      </div>
                      <Link
                        className="package-arrow"
                        href={`/packages/${item.slug}`}
                        aria-label={`View ${item.name}`}
                      >
                        <ArrowUpRight size={23} />
                      </Link>
                    </div>
                    <SaveTour slug={item.slug} name={item.name} />
                  </div>
                </article>
              ))}
            </div>
            {!items.length && (
              <div className="discovery-empty">
                <h2>A different direction?</h2>
                <p>
                  Try another destination or clear your filters to see the
                  sample collection.
                </p>
                <Link className="button" href="/packages">
                  See all sample tours →
                </Link>
                <WhatsAppLink className="text-link" destination={q}>
                  Plan a custom holiday instead →
                </WhatsAppLink>
              </div>
            )}
          </>
        ) : (
          <div className="discovery-empty">
            <h2>A holiday built around you.</h2>
            <p>
              Our online tour collection is being prepared. Tell us your
              destination and dates for a personalised quote from our team.
            </p>
            <WhatsAppLink className="button">Plan my holiday →</WhatsAppLink>
          </div>
        )}
      </section>
    </main>
  );
}
