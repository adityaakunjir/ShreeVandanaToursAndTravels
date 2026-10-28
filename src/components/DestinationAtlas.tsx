import Link from 'next/link';
import { destinationHubs } from '@/data/destination-hubs';
export default function DestinationAtlas() {
  return (
    <section className="section wrap journal-atlas" id="atlas">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE ATLAS / FOLLOW YOUR CURIOSITY</p>
          <h2>
            A little closer.
            <br />
            <em>A little further.</em>
          </h2>
        </div>
        <p>
          Choose a place to open its travel journal. Each destination connects
          to company-supplied route outlines.
        </p>
      </div>
      <div className="atlas-columns">
        {[
          ['India', 'Journeys closer to home'],
          ['International', 'Beyond familiar borders'],
        ].map(([scope, title]) => (
          <div key={scope}>
            <h3>{title}</h3>
            <div className="atlas-grid">
              {destinationHubs
                .filter((h) =>
                  scope === 'India'
                    ? h.name === 'India' ||
                      (h.kind === 'region' && h.name !== 'Bali')
                    : (h.kind === 'country' && h.name !== 'India') ||
                      h.name === 'Bali',
                )
                .map((h) => (
                  <Link href={`/destinations/${h.slug}`} key={h.slug}>
                    <span>{h.name}</span>
                    <small>
                      {h.tours.length}{' '}
                      {h.tours.length === 1 ? 'outline' : 'outlines'}
                    </small>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
