import type { Metadata } from 'next';
import Link from 'next/link';
import { getDemoPackages, rupees } from '@/data/demo-packages';
import { comparisonSelection } from '@/lib/shortlist';
import { PageIntro } from '@/components/PageIntro';
import DemoNotice from '@/components/DemoNotice';
import ShareComparison from '@/components/ShareComparison';
export const metadata: Metadata = {
  title: 'Compare sample tours',
  robots: { index: false, follow: false },
};
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string | string[] }>;
}) {
  const { tour } = await searchParams;
  const catalogue = getDemoPackages();
  const { selected, error } = comparisonSelection(catalogue, tour);
  return (
    <main>
      <PageIntro
        eyebrow="Compare journeys"
        title="A clearer choice."
        accent="A better fit for you."
        description="Compare the details that matter, from time away to what’s included."
      />
      <section className="wrap section">
        {catalogue.length ? (
          <>
            <DemoNotice />
            <form
              method="get"
              action="/packages/compare"
              className="comparison-picker"
            >
              <fieldset>
                <legend>Choose two or three sample tours</legend>
                <div>
                  {catalogue.map((item) => (
                    <label key={item.slug}>
                      <input
                        type="checkbox"
                        name="tour"
                        value={item.slug}
                        defaultChecked={selected.some(
                          (choice) => choice.slug === item.slug,
                        )}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button className="button" type="submit">
                Compare journeys →
              </button>
            </form>
            {error && (
              <p className="comparison-error" role="alert">
                {error}
              </p>
            )}
            {selected.length >= 2 && (
              <>
                <div className="collection-tools">
                  <p>
                    {selected.length} sample journeys · prices are per adult,
                    not whole-party totals
                  </p>
                  <ShareComparison />
                </div>
                <div
                  className="comparison-grid"
                  style={
                    {
                      '--compare-count': selected.length,
                    } as React.CSSProperties
                  }
                >
                  {selected.map((item) => (
                    <article className="comparison-card" key={item.slug}>
                      <p className="eyebrow">{item.country}</p>
                      <h2>{item.name}</h2>
                      <dl>
                        <div>
                          <dt>Journey type</dt>
                          <dd>
                            {item.model === 'fixed-departure'
                              ? 'Sample fixed departure'
                              : 'Custom holiday · quote-only'}
                          </dd>
                        </div>
                        <div>
                          <dt>Time away</dt>
                          <dd>
                            {item.days} days · {item.nights} nights
                          </dd>
                        </div>
                        <div>
                          <dt>Travel style</dt>
                          <dd>{item.theme}</dd>
                        </div>
                        <div>
                          <dt>Sample adult cost</dt>
                          <dd>
                            <strong>
                              {item.adultPaise
                                ? rupees(item.adultPaise)
                                : 'Quote on request'}
                            </strong>
                            <small>
                              {item.adultPaise
                                ? 'Twin sharing · taxes included'
                                : 'No published payable price'}
                            </small>
                          </dd>
                        </div>
                        <div>
                          <dt>Sample deposit</dt>
                          <dd>
                            {item.depositPaise
                              ? rupees(item.depositPaise)
                              : 'Agreed with your quote'}
                          </dd>
                        </div>
                        <div>
                          <dt>Sample dates</dt>
                          <dd>
                            {item.departures.length
                              ? item.departures.map((date) => (
                                  <span key={date}>
                                    {new Intl.DateTimeFormat('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      timeZone: 'UTC',
                                    }).format(new Date(`${date}T00:00:00Z`))}
                                    <br />
                                  </span>
                                ))
                              : 'Shaped around your dates'}
                          </dd>
                        </div>
                        <div>
                          <dt>Sample inclusions</dt>
                          <dd>
                            <ul>
                              {item.inclusions.map((value) => (
                                <li key={value}>{value}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                        <div>
                          <dt>What’s extra</dt>
                          <dd>
                            <ul>
                              {item.exclusions.map((value) => (
                                <li key={value}>{value}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                      </dl>
                      <Link className="button" href={`/packages/${item.slug}`}>
                        Explore this sample →
                      </Link>
                    </article>
                  ))}
                </div>
                <p className="package-policy-note">
                  Different durations and destinations make these prices
                  different products, not like-for-like quotations. Real
                  policies, room choices, child prices and live availability are
                  still to be added. This comparison cannot reserve or book a
                  tour.
                </p>
              </>
            )}
            <Link className="text-link" href="/packages">
              ← Back to the tour collection
            </Link>
          </>
        ) : (
          <div className="discovery-empty">
            <h2>Your holiday, thoughtfully planned.</h2>
            <Link className="button" href="/enquire">
              Get a personalised quote →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
