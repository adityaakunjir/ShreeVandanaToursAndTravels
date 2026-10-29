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
import tours from '@/data/catalogue';
import TourCard from '@/components/TourCard';
import { destinationHubs } from '@/data/destination-hubs';
import DestinationHub from '@/components/DestinationHub';
import ScenicVideo from '@/components/ScenicVideo';
import VideoCredit from '@/components/VideoCredit';
import { videoForDestination } from '@/lib/destination-videos';
export function generateStaticParams() {
  return [
    ...new Set([...destinations, ...destinationHubs].map((x) => x.slug)),
  ].map((slug) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) {
    const hub = destinationHubs.find((h) => h.slug === slug);
    return hub
      ? {
          title: hub.name + ' holidays from Pune',
          description: `Explore company-supplied ${hub.name} tour outlines, route options and daily itineraries. Plan your personalised holiday with our Pune team.`,
          alternates: { canonical: `/destinations/${slug}` },
          openGraph: {
            images: hub.tours.find((t) => t.image)?.image?.src
              ? [hub.tours.find((t) => t.image)!.image!.src]
              : [],
          },
        }
      : { title: 'Destination not found' };
  }
  const photo = photos.find((photo) => photo.slug === destination.tourSlug);
  const title = `${destination.name} holidays from Pune`;
  const description = `${destination.description} Discuss a personalised ${destination.name} holiday with Shree Vandana Tours & Travels, Pune.`;
  const images = photo
    ? [
        {
          url: photo.src,
          width: photo.width,
          height: photo.height,
          alt: photo.alt,
        },
      ]
    : [];
  return {
    title,
    description,
    alternates: { canonical: `/destinations/${slug}` },
    openGraph: {
      title,
      description,
      url: `/destinations/${slug}`,
      type: 'website',
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}
export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);
  if (!destination) {
    const hub = destinationHubs.find((h) => h.slug === slug);
    if (hub) return <DestinationHub hub={hub} />;
    notFound();
  }
  const tour = tours.find((t) => t.slug === destination.tourSlug)!;
  const clip = videoForDestination(destination.slug);
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
            {clip ? (
              <ScenicVideo
                key={clip.id}
                id={clip.id}
                assetBase={clip.assetBase}
                label={clip.label}
                fallback={`/assets/images/${destination.image}`}
                alt={
                  photos.find((p) => p.slug === destination.tourSlug)?.alt ||
                  destination.name
                }
                sizes="(max-width:900px) calc(100vw - 40px), 550px"
                priority
              />
            ) : (
              <Image
                src={`/assets/images/${destination.image}`}
                fill
                quality={60}
                sizes="(max-width:900px) calc(100vw - 40px), 550px"
                alt={
                  photos.find((photo) => photo.slug === destination.tourSlug)
                    ?.alt || destination.name
                }
                loading="eager"
              />
            )}
          </div>
          <div className="destination-detail-copy">
            {clip && <VideoCredit clip={clip} />}
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
      <section className="section wrap destination-experiences">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              A CLOSER LOOK AT {destination.name.toUpperCase()}
            </p>
            <h2>
              More than a place.
              <br />
              <em>A journey to experience.</em>
            </h2>
          </div>
          <p>
            From our supplied tour outline. Final plans are confirmed around
            your travel dates.
          </p>
        </div>
        <div className="experience-grid">
          {(tour.highlights?.length
            ? tour.highlights
                .slice(0, 3)
                .map((h) => ({ title: h, description: '' }))
            : tour.days.slice(1, 4)
          ).map((day, i) => (
            <article key={day.title}>
              <span>0{i + 1}</span>
              <h3>{day.title}</h3>
              {day.description && <p>{day.description}</p>}
            </article>
          ))}
        </div>
        <div className="destination-planning-grid">
          <div>
            <p className="eyebrow">YOUR ROUTE, THOUGHTFULLY CONNECTED</p>
            <h2>
              See how it
              <br />
              <em>comes together.</em>
            </h2>
            <div className="brochure-route">
              {tour.stops.map((stop) => (
                <span key={stop}>{stop}</span>
              ))}
            </div>
            <h3 className="planning-note-title">Before you plan</h3>
            <ul className="brochure-exclusions">
              {tour.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <WhatsAppLink
              destination={`${destination.name} holiday planning`}
              className="text-link"
            >
              Talk dates and preferences
            </WhatsAppLink>
          </div>
          <TourCard tour={tour} index={0} />
        </div>
      </section>
      <section className="section wrap">
        <p className="eyebrow">MORE ROUTE OPTIONS</p>
        <div className="brochure-tour-grid">
          {tours
            .filter((t) => t.relatedSlugs.includes(destination.tourSlug))
            .map((t, i) => (
              <TourCard tour={t} index={i} key={t.slug} />
            ))}
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
