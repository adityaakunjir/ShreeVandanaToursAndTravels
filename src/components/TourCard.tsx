import Link from 'next/link';
import Image from '@/components/TravelImage';
import { tourPhoto, tourEnquiryContext } from '@/data/catalogue';
import JournalCover from './JournalCover';
import { ArrowUpRight, Clock } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';
import tours from '@/data/catalogue';
import { SaveRealTour } from './RealShortlist';
export default function TourCard({
  tour,
  index,
}: {
  tour: (typeof tours)[number];
  index: number;
}) {
  const photo = tourPhoto(tour);
  const synopsis = /source itinerary/i.test(tour.summary)
    ? tour.stops.slice(0, 3).join(' · ')
    : tour.summary;
  return (
    <article className="brochure-tour-card" data-order={index + 1}>
      {photo && (
        <Link
          className="tour-card-photo"
          prefetch={false}
          href={`/tours/${tour.slug}`}
          aria-label={`Explore ${tour.name}`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw"
            quality={60}
          />
        </Link>
      )}
      {!photo && (
        <Link href={`/tours/${tour.slug}`} className="tour-card-photo">
          <JournalCover tour={tour} />
        </Link>
      )}
      {photo && (
        <Link
          className="tour-card-credit"
          href={`/photo-credits#${photo.slug}`}
          aria-label={`Photo credits: ${photo.author}`}
        >
          Photo credits
        </Link>
      )}
      <p className="eyebrow">
        {tour.country} · {tour.theme}
      </p>
      <h2>
        <Link href={`/tours/${tour.slug}`}>{tour.name}</Link>
      </h2>
      <p className="tour-card-description">{synopsis}</p>
      <div className="brochure-duration">
        <Clock size={16} />
        {tour.duration || tour.days.length} days<span>Price on enquiry</span>
      </div>
      <div className="brochure-card-actions">
        <Link className="text-link" href={`/tours/${tour.slug}`}>
          View itinerary <ArrowUpRight size={17} />
        </Link>
        <WhatsAppLink
          destination={tourEnquiryContext(tour)}
          aria-label={`Enquire about ${tour.name} on WhatsApp`}
        >
          Enquire
        </WhatsAppLink>
      </div>
      <SaveRealTour slug={tour.slug} name={tour.name} />
    </article>
  );
}
