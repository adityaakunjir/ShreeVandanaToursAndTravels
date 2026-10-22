import tours from '@/data/catalogue';
import { tourEnquiryContext } from '@/data/catalogue';
import Link from 'next/link';
import { comparisonSelection } from '@/lib/shortlist';
import { tourDuration } from '@/lib/real-tours';
import { PageIntro } from '@/components/PageIntro';
import WhatsAppLink from '@/components/WhatsAppLink';
import ShareComparison from '@/components/ShareComparison';
export const metadata = {
  title: 'Compare your next journeys',
  description:
    'Compare real tour durations, routes, travel styles and inclusions before discussing your personalised quote.',
  alternates: { canonical: '/tours/compare' },
  robots: { index: false, follow: true },
};
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string | string[] }>;
}) {
  const { selected, error } = comparisonSelection(
    tours,
    (await searchParams).tour,
  );
  return (
    <main>
      <PageIntro
        path="/tours/compare"
        eyebrow="A closer look"
        title="Different places."
        accent="Find your perfect fit."
        description="Choose two or three tour outlines. Compare the route and details, then let our team help you decide."
      />
      <section className="section wrap">
        <form
          action="/tours/compare"
          method="get"
          className="comparison-picker"
        >
          <fieldset>
            <legend>Choose two or three journeys</legend>
            <div className="comparison-options">
              {tours.map((t) => (
                <label key={t.slug}>
                  <input
                    type="checkbox"
                    name="tour"
                    value={t.slug}
                    defaultChecked={selected.some((s) => s.slug === t.slug)}
                  />
                  <span>
                    {t.name} · {t.duration} days ·{' '}
                    {t.source.order ? 'Newer itinerary' : 'Earlier outline'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <button className="button" type="submit">
            Compare journeys ↗
          </button>
        </form>
        {error && (
          <p className="comparison-error" role="alert">
            {error}
          </p>
        )}
        {!!selected.length && (
          <>
            <div className="collection-tools">
              <p>
                Tour outlines · final arrangements and prices confirmed by our
                team
              </p>
              <ShareComparison />
            </div>
            <div className="saved-real-grid">
              {selected.map((t) => (
                <article className="comparison-card" key={t.slug}>
                  <p className="eyebrow">{t.region}</p>
                  <h2>{t.name}</h2>
                  <dl>
                    <div>
                      <dt>Time away / source option</dt>
                      <dd>
                        {tourDuration(t)} days ·{' '}
                        {t.source.order ? 'Newer itinerary' : 'Earlier outline'}
                      </dd>
                    </div>
                    <div>
                      <dt>Travel style</dt>
                      <dd>{t.theme}</dd>
                    </div>
                    <div>
                      <dt>The route</dt>
                      <dd>{t.stops.join(' → ')}</dd>
                    </div>
                    <div>
                      <dt>Daily itinerary</dt>
                      <dd>
                        {t.days.length
                          ? `${t.days.length} days outlined`
                          : 'Request the detailed daily plan'}
                      </dd>
                    </div>
                    <div>
                      <dt>Outlined inclusions</dt>
                      <dd>
                        <ul>
                          {t.includes.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt>What’s extra</dt>
                      <dd>
                        <ul>
                          {t.excludes.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt>Things to confirm</dt>
                      <dd>
                        <ul>
                          {t.notes.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt>Your quote</dt>
                      <dd>Personalised on enquiry</dd>
                    </div>
                  </dl>
                  <Link href={`/tours/${t.slug}`} className="text-link">
                    Full itinerary ↗
                  </Link>
                  <WhatsAppLink
                    destination={tourEnquiryContext(t)}
                    className="button"
                  >
                    Discuss this journey ↗
                  </WhatsAppLink>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
