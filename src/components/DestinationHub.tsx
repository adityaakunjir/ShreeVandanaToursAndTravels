import { destinationHubs } from '@/data/destination-hubs';
import TourCard from './TourCard';
import { PageIntro, JourneyCTA } from './PageIntro';
export default function DestinationHub({
  hub,
}: {
  hub: (typeof destinationHubs)[number];
}) {
  return (
    <main className="collection-page">
      <PageIntro
        path={`/destinations/${hub.slug}`}
        eyebrow="The destination journal"
        title={hub.name}
        accent="A story worth taking."
        description={`Explore ${hub.name} through the company’s route outlines. Compare the time away, daily experiences and arrangements, then shape the details with our Pune team.`}
      />
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE ROUTES / {hub.name.toUpperCase()}</p>
            <h2>
              One place.
              <br />
              <em>More possibilities.</em>
            </h2>
          </div>
          <p>
            {hub.tours.length} source outlines. Route variants remain separate;
            prices and departures are confirmed on enquiry.
          </p>
        </div>
        <div className="brochure-tour-grid">
          {hub.tours.map((t, i) => (
            <TourCard key={t.slug} tour={t} index={i} />
          ))}
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
