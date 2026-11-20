import { destinationHubs } from '@/data/destination-hubs';
import TourCard from './TourCard';
import { PageIntro, JourneyCTA } from './PageIntro';
import { DestinationStructuredData } from './TravelStructuredData';
import { destinations } from '@/data/site';
export default function DestinationHub({
  hub,
}: {
  hub: (typeof destinationHubs)[number];
}) {
  const priority = destinations.map((d) => d.tourSlug);
  const routes = [...hub.tours].sort(
    (a, b) =>
      Number(priority.includes(b.slug)) - Number(priority.includes(a.slug)),
  );
  return (
    <main className="collection-page">
      <DestinationStructuredData
        name={hub.name}
        path={`/destinations/${hub.slug}`}
        description={`Explore ${hub.name} holidays and itineraries with our Pune travel team.`}
        tours={hub.tours}
      />
      <PageIntro
        photoSlug={hub.tours.find((t) => t.image)?.image?.slug}
        path={`/destinations/${hub.slug}`}
        eyebrow="The destination journal"
        title={hub.name}
        accent="Tour packages"
        description={`Explore ${routes.length} ${routes.length === 1 ? 'itinerary' : 'itineraries'} with our Pune team. Compare stops and trip lengths, then ask for a quote for your dates.`}
      />
      <section id="destination-tours" className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE ROUTES / {hub.name.toUpperCase()}</p>
            <h2>Choose your journey.</h2>
          </div>
          <p>{hub.tours.length} itineraries. Your dates, your pace.</p>
        </div>
        <div className="brochure-tour-grid">
          {routes.slice(0, 6).map((t, i) => (
            <TourCard key={t.slug} tour={t} index={i} />
          ))}
        </div>
        {routes.length > 6 && (
          <details className="optional-discovery">
            <summary>Explore {routes.length - 6} more journeys</summary>
            <div className="brochure-tour-grid">
              {routes.slice(6).map((t, i) => (
                <TourCard key={t.slug} tour={t} index={i + 6} />
              ))}
            </div>
          </details>
        )}
      </section>
      <JourneyCTA />
    </main>
  );
}
