import Link from 'next/link';
import Image from 'next/image';
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
  return (
    <article className="brochure-tour-card">
      {photo && (
        <Link
          className="tour-card-photo"
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
        >
          Photo: {photo.author}
        </Link>
      )}
      <div className="brochure-card-top">
        <span>JOURNEY {String(index + 1).padStart(2, '0')}</span>
        <span>{tour.region}</span>
      </div>
      <p className="eyebrow">{tour.theme}</p>
      {tour.relatedSlugs.length > 0 && (
        <span className="variant-label">
          {tour.duration}-day route option ·{' '}
          {tour.source.order ? 'Newer itinerary' : 'Earlier outline'}
        </span>
      )}
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
          destination={tourEnquiryContext(tour)}
          aria-label={`Enquire about ${tour.name} on WhatsApp`}
        >
          Enquire ↗
        </WhatsAppLink>
      </div>
      <SaveRealTour slug={tour.slug} name={tour.name} />
    </article>
  );
}
