import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ArrowUpRight, Phone } from 'lucide-react';
import tours from '@/data/catalogue';
import Breadcrumb from '@/components/Breadcrumb';
import WhatsAppLink from '@/components/WhatsAppLink';
import { business } from '@/data/site';
import TourCard from '@/components/TourCard';
import ShareTour from '@/components/ShareTour';
import { SaveRealTour } from '@/components/RealShortlist';
import { tourPhoto, tourEnquiryContext } from '@/data/catalogue';
import JournalCover from '@/components/JournalCover';
export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = tours.find((t) => t.slug === slug);
  if (!t) return {};
  const photo = tourPhoto(t);
  return {
    title: t.name + ' tour from Pune',
    description:
      `${t.name}, ${t.duration} days. ` +
      t.summary +
      ' View the route and enquire on WhatsApp for dates and a quote.',
    alternates: { canonical: `/tours/${t.slug}` },
    openGraph: {
      title: t.name + ' tour from Pune',
      description: t.summary,
      images: photo
        ? [
            {
              url: photo.src,
              width: photo.width,
              height: photo.height,
              alt: photo.alt,
            },
          ]
        : [],
    },
  };
}
export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) notFound();
  const duration = tour.duration || tour.days.length;
  const photo = tourPhoto(tour);
  const related = tours
    .filter((t) => t.slug !== tour.slug)
    .sort((a, b) => {
      const score = (t: typeof tour) =>
        Number(tour.relatedSlugs.includes(t.slug)) * 10 +
        Number(t.theme === tour.theme) * 2 +
        Number((t.region === 'India') === (tour.region === 'India'));
      return score(b) - score(a);
    })
    .slice(0, 3);
  return (
    <main className="brochure-detail wrap">
      <Breadcrumb
        items={[
          { name: 'Home', path: '/' },
          { name: 'Our tours', path: '/tours' },
          { name: tour.name, path: `/tours/${tour.slug}` },
        ]}
      />
      {photo && (
        <figure className="tour-photo-figure">
          <div className="tour-photo-window">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1300px) 92vw, 1200px"
              quality={60}
              loading="eager"
              fetchPriority="high"
            />
            <div className="tour-photo-heading">
              <p>
                {tour.region} · {duration} days
              </p>
              <h1>{tour.name}</h1>
            </div>
          </div>
          <figcaption>
            <span>{photo.alt}</span>
            <Link href={`/photo-credits#${photo.slug}`}>
              Photo: {photo.author} · {photo.license}
            </Link>
          </figcaption>
        </figure>
      )}
      {!photo && (
        <section className="journal-detail-hero">
          <JournalCover tour={tour} hero />
          <h1>{tour.name}</h1>
          <p>
            {tour.country} ·{' '}
            {tour.nights !== null ? `${tour.nights} nights / ` : ''}
            {duration} days · Tour outline
          </p>
        </section>
      )}
      <nav className="tour-section-nav" aria-label="On this tour page">
        <a href="#itinerary">The itinerary</a>
        <a href="#inclusions">What’s included</a>
        <a href="#before-you-go">Before you go</a>
      </nav>
      <div className="tour-detail-tools">
        <SaveRealTour slug={tour.slug} name={tour.name} />
        <ShareTour />
        <Link href="/tours/compare" className="text-link">
          Compare journeys ↗
        </Link>
      </div>
      <div className="brochure-detail-hero">
        <div>
          <p className="eyebrow">
            {tour.region} · {tour.theme} · {duration} days
          </p>
          <p className="source-outline-label">
            {tour.relatedSlugs.length ? 'Distinct route option · ' : ''}
            Company-supplied outline · Final arrangements on enquiry
            {' · '}
            {tour.source.order ? 'Newer itinerary' : 'Earlier outline'}
          </p>
          <p className="brochure-lead">{tour.summary}</p>
          <div className="brochure-route" aria-label="Tour route">
            {tour.stops.map((stop) => (
              <span key={stop}>{stop}</span>
            ))}
          </div>
          <Link
            href={`/destinations/${tour.country === 'India' ? 'india' : tour.country.toLowerCase().split(' / ')[0].replaceAll(' ', '-')}`}
            className="text-link"
          >
            Explore this destination ↗
          </Link>
        </div>
        <aside className="brochure-enquire">
          <p className="eyebrow">Your next journey</p>
          <h2>Let’s make it yours.</h2>
          <p>
            Ask our team for travel dates, availability and a quote for your
            group.
          </p>
          <WhatsAppLink
            destination={tourEnquiryContext(tour)}
            className="button"
          >
            Enquire on WhatsApp <ArrowUpRight size={18} />
          </WhatsAppLink>
          <a className="text-link" href={`tel:+${business.phones[0].number}`}>
            <Phone size={16} />
            Prefer to call?
          </a>
          <small>
            No booking commitment. Our team confirms the final itinerary and
            price.
          </small>
        </aside>
      </div>
      <div className="package-content-grid">
        <section className="route-preview" aria-label="Journey highlights">
          <div>
            <p className="eyebrow">A TASTE OF THE JOURNEY</p>
            <h2>
              Moments to
              <br />
              <em>look forward to.</em>
            </h2>
          </div>
          <ol>
            {(tour.highlights?.length
              ? tour.highlights.slice(0, 3)
              : tour.days.slice(1, 4).map((d) => d.title)
            ).map((highlight, index) => (
              <li key={highlight}>
                <span>0{index + 1}</span>
                <h3>{highlight}</h3>
              </li>
            ))}
          </ol>
        </section>
        <section className="package-panel" id="itinerary">
          <p className="eyebrow">The journey unfolds</p>
          <h2>Your itinerary, day by day.</h2>
          {tour.days.length ? (
            <div className="itinerary-list curated-itinerary">
              {tour.days.map((day, i) => (
                <details key={day.title} open={i === 0}>
                  <summary>
                    <span className="itinerary-number">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>
                      Day {i + 1}
                      <strong>{day.title}</strong>
                    </span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{day.description}</p>
                </details>
              ))}
            </div>
          ) : (
            <>
              <p>
                This {duration}-day tour visits {tour.stops.join(', ')}. Our
                team will share the detailed daily plan with your quote.
              </p>
              {'highlights' in tour && tour.highlights && (
                <ul className="brochure-exclusions">
                  {tour.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              <WhatsAppLink
                destination={tour.name + ' daily itinerary'}
                className="text-link"
              >
                Request the itinerary ↗
              </WhatsAppLink>
            </>
          )}
        </section>
        <section className="package-panel" id="inclusions">
          <p className="eyebrow">The details that matter</p>
          <h2>What’s included.</h2>
          <p className="brochure-small">
            The tour outline includes the following. Confirm your selected
            departure’s arrangements with our team.
          </p>
          <ul className="brochure-inclusions">
            {tour.includes.map((item) => (
              <li key={item}>
                <Check size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <h3>What’s extra</h3>
          <ul className="brochure-exclusions">
            {tour.excludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {tour.optional.length > 0 && (
            <>
              <h3>Optional experiences</h3>
              <p className="brochure-small">
                These are choices to discuss, not guaranteed inclusions. The
                final quote confirms their availability and charges.
              </p>
              <ul className="brochure-exclusions">
                {tour.optional.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
      <section className="brochure-before" id="before-you-go">
        <p className="eyebrow">Before you go</p>
        <h2>A few helpful details.</h2>
        <ul>
          <li>
            Source:{' '}
            {tour.source.file.endsWith('.docx')
              ? 'the newer company itinerary document'
              : 'the earlier company tour document'}
            {tour.source.paragraphRange ? `, section ${tour.source.order}` : ''}
            . Published as an outline; commercial arrangements require
            confirmation.
          </li>
          {tour.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
          <li>
            Dates, prices, accommodation, transport, taxes and cancellation
            terms are confirmed in your final quotation. Sightseeing may change
            with permits, weather and local operating conditions.
          </li>
        </ul>
        <WhatsAppLink destination={tourEnquiryContext(tour)} className="button">
          Let’s talk about this tour <ArrowUpRight size={18} />
        </WhatsAppLink>
      </section>
      <nav className="brochure-mobile-action" aria-label="Tour enquiry">
        <span className="sr-only">Personalised quote</span>
        <div>
          <strong>{duration} days</strong>
          <span>Price on enquiry</span>
        </div>
        <WhatsAppLink destination={tourEnquiryContext(tour)} className="button">
          WhatsApp <ArrowUpRight size={16} />
        </WhatsAppLink>
      </nav>
      <section className="section related-tours">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KEEP YOUR CURIOSITY GOING</p>
            <h2>
              Another place.
              <br />
              <em>Another possibility.</em>
            </h2>
          </div>
          <Link href="/tours" className="text-link">
            All journeys ↗
          </Link>
        </div>
        <div className="brochure-tour-grid">
          {related.map((t, i) => (
            <TourCard key={t.slug} tour={t} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
