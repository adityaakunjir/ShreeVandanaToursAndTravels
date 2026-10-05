import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { destinations } from '@/data/site';
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
              alt={`${destination.name}, ${destination.country}`}
              fill
              sizes="(max-width:640px) calc(100vw - 40px), (max-width:900px) 45vw, 380px"
            />
            <span className="travel-tag">{destination.tag}</span>
            <span className="image-arrow">
              <ArrowUpRight size={21} />
            </span>
          </Link>
          <div className="destination-body">
            <p className="destination-country">
              0{index + 1} / {destination.country}
            </p>
            <h3>
              <Link href={`/destinations/${destination.slug}`}>
                {destination.name}
              </Link>
            </h3>
            <p>{destination.description}</p>
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
