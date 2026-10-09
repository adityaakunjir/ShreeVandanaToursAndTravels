import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { destinations } from '@/data/site';
import photos from '@/data/tour-photos.json';
import tours from '@/data/tours.json';
import { tourDuration } from '@/lib/real-tours';
export default function DestinationGrid({
  items = destinations,
}: {
  items?: typeof destinations;
}) {
  return (
    <div className="destination-grid">
      {items.map((destination, index) => (
        <article className="destination-card" key={destination.name}>
          <Link
            className="destination-image"
            href={`/destinations/${destination.slug}`}
            aria-label={`Explore ${destination.name}`}
          >
            <Image
              src={`/assets/images/${destination.image}`}
              alt={
                photos.find((photo) => photo.slug === destination.tourSlug)
                  ?.alt || destination.name
              }
              fill
              quality={60}
              sizes="(max-width:640px) calc(100vw - 40px), (max-width:900px) 45vw, 380px"
            />
            <span className="travel-tag">{destination.tag}</span>
            <span className="image-arrow">
              <ArrowUpRight size={21} />
            </span>
          </Link>
          <div className="destination-body">
            <Link
              className="tour-card-credit"
              href={`/photo-credits#${destination.tourSlug}`}
            >
              Photo credits
            </Link>
            <p className="destination-country">
              0{index + 1} / {destination.country}
            </p>
            <h3>
              <Link href={`/destinations/${destination.slug}`}>
                {destination.name}
              </Link>
            </h3>
            <p>{destination.description}</p>
            <p className="destination-source-route">
              {tourDuration(
                tours.find((t) => t.slug === destination.tourSlug)!,
              )}
              -day tour outline ·{' '}
              {tours
                .find((t) => t.slug === destination.tourSlug)!
                .stops.slice(0, 3)
                .join(' / ')}
            </p>
            <Link
              className="text-link"
              href={`/destinations/${destination.slug}`}
            >
              Explore the possibilities <ArrowRight size={17} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
