import WhatsAppLink from '@/components/WhatsAppLink';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import photos from '@/data/tour-photos.json';
import { ArrowUpRight, Check } from 'lucide-react';
import { destinations } from '@/data/site';
import { JourneyCTA } from '@/components/PageIntro';
import Breadcrumb from '@/components/Breadcrumb';
export function generateStaticParams() {
  return destinations.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  return {
    title: destination
      ? `Explore ${destination.name}`
      : 'Destination not found',
    description: destination
      ? `${destination.description} Discuss a personalised ${destination.name} holiday with Shree Vandana Tours & Travels, Pune.`
      : undefined,
    alternates: { canonical: `/destinations/${slug}` },
  };
}
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) notFound();
  return (
    <main>
      <section className="destination-detail wrap">
        <Breadcrumb
          items={[
            { name: 'Home', path: '/' },
            { name: 'Destinations', path: '/destinations' },
            {
              name: destination.name,
              path: `/destinations/${destination.slug}`,
            },
          ]}
        />
        <div className="destination-detail-grid">
          <div className="destination-detail-image">
            <Image
              src={`/assets/images/${destination.image}`}
              fill
              sizes="(max-width:900px) calc(100vw - 40px), 550px"
              alt={
                photos.find((photo) => photo.slug === destination.tourSlug)
                  ?.alt || destination.name
              }
              loading="eager"
            />
          </div>
          <div className="destination-detail-copy">
            <Link
              className="tour-card-credit"
              href={`/photo-credits#${destination.tourSlug}`}
            >
              Destination photo credits
            </Link>
            <p className="eyebrow">
              {destination.country} · {destination.tag}
            </p>
            <h1>
              A little
              <br />
              <em>{destination.name} magic.</em>
            </h1>
            <p>{destination.description}</p>
            <p>
              Make it a holiday that feels like you. Share your travel dates,
              preferred pace and interests, and our team will help you explore a
              personalised itinerary.
            </p>
            <ul>
              {[
                'Your dates and your travel style',
                'A personalised plan and quote',
                'Personal attention from our Pune team',
              ].map((text) => (
                <li key={text}>
                  <Check size={17} />
                  {text}
                </li>
              ))}
            </ul>
            <WhatsAppLink destination={destination.name} className="button">
              Plan my {destination.name} trip <ArrowUpRight size={18} />
            </WhatsAppLink>
            <Link className="text-link" href={`/tours/${destination.tourSlug}`}>
              View our {destination.name} tour itinerary{' '}
              <ArrowUpRight size={17} />
            </Link>
            <p className="detail-note">
              Inspiration, not a fixed departure. Availability, inclusions and
              pricing are confirmed with our team.
            </p>
          </div>
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
