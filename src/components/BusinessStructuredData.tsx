import { siteUrl } from '@/lib/site-url';
import { business } from '@/data/site';
import { googleBusiness } from '@/data/google-business';

export default function BusinessStructuredData() {
  const base = siteUrl;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': new URL('/#travel-agency', base).href,
    name: business.businessName,
    url: new URL('/', base).href,
    telephone: `+${business.phones[0].number}`,
    email: business.contact.email,
    logo: new URL('/assets/images/brand-mark.webp', base).href,
    areaServed: { '@type': 'City', name: 'Pune' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${business.phones[0].number}`,
      contactType: 'travel enquiries',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.contact.address,
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      postalCode: '411043',
      addressCountry: 'IN',
    },
    sameAs: Object.values(business.socialMedia),
    hasMap: googleBusiness.url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: googleBusiness.latitude,
      longitude: googleBusiness.longitude,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '19:00',
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
