import WhatsAppLink from '@/components/WhatsAppLink';
import { additionalDestinations } from '@/data/site';

export default function MoreDestinations({ query = '' }: { query?: string }) {
  const places = additionalDestinations.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  if (!places.length) return null;
  return (
    <section
      className="more-destinations"
      aria-label="More destinations we arrange"
    >
      <p className="eyebrow">More places. The same personal care.</p>
      <h2>Where else shall we go?</h2>
      <p>
        We also arrange holidays to these destinations. Chat with us about your
        dates, interests and a personalised quote.
      </p>
      <div className="destination-chips">
        {places.map((name) => (
          <WhatsAppLink
            key={name}
            destination={name}
            aria-label={`Enquire about ${name} on WhatsApp`}
          >
            {name}
            <span aria-hidden="true">↗</span>
          </WhatsAppLink>
        ))}
      </div>
      <WhatsAppLink className="text-link">
        Somewhere else in mind? Let’s talk →
      </WhatsAppLink>
    </section>
  );
}
