import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';
import tours from '@/data/tours.json';
export default function TourCard({
  tour,
  index,
}: {
  tour: (typeof tours)[number];
  index: number;
}) {
  return (
    <article className="brochure-tour-card">
      <div className="brochure-card-top">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{tour.region}</span>
      </div>
      <p className="eyebrow">{tour.theme}</p>
      <h2>
        <Link href={`/tours/${tour.slug}`}>{tour.name}</Link>
      </h2>
      <p>{tour.summary}</p>
      <div className="brochure-duration">
        <Clock size={16} />
        {tour.duration || tour.days.length} days<span>Price on enquiry</span>
      </div>
      <div className="brochure-card-actions">
        <Link className="text-link" href={`/tours/${tour.slug}`}>
          View itinerary <ArrowUpRight size={17} />
        </Link>
        <WhatsAppLink
          destination={tour.name}
          aria-label={`Enquire about ${tour.name} on WhatsApp`}
        >
          Enquire ↗
        </WhatsAppLink>
      </div>
    </article>
  );
}
