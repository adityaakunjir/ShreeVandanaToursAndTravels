import { siteUrl } from '@/lib/site-url';
import type { Tour } from '@/data/catalogue';
import { tourPhoto } from '@/data/catalogue';

export function TourStructuredData({ tour }: { tour: Tour }) {
  const photo = tourPhoto(tour);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': new URL(`/tours/${tour.slug}#trip`, siteUrl).href,
    name: `${tour.name} — ${tour.duration} days`,
    description: tour.summary,
    url: new URL(`/tours/${tour.slug}`, siteUrl).href,
    image: photo ? new URL(photo.src, siteUrl).href : undefined,
    touristType: tour.theme,
    provider: { '@id': new URL('/#travel-agency', siteUrl).href },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: tour.stops.map((name, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: { '@type': 'Place', name },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function DestinationStructuredData({
  name,
  path,
  description,
  tours,
}: {
  name: string;
  path: string;
  description: string;
  tours: Tour[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristDestination',
        '@id': new URL(path + '#destination', siteUrl).href,
        name,
        description,
        url: new URL(path, siteUrl).href,
      },
      {
        '@type': 'CollectionPage',
        url: new URL(path, siteUrl).href,
        name: `${name} holidays from Pune`,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: tours.map((tour, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tour.name,
            url: new URL('/tours/' + tour.slug, siteUrl).href,
          })),
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
