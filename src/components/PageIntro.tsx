import WhatsAppLink from '@/components/WhatsAppLink';
import Link from 'next/link';
import Image from '@/components/TravelImage';
import photos from '@/data/tour-photos.json';
import { ArrowUpRight, ChevronRight, Phone } from 'lucide-react';
import { business } from '@/data/site';
import Breadcrumb from './Breadcrumb';
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  path,
  photoSlug,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  path?: string;
  photoSlug?: string;
}) {
  const imageSlug: Record<string, string> = {
    '/tours': 'shimla-kullu-manali',
    '/destinations': 'kerala-kanyakumari',
    '/about': 'royal-bhutan',
    '/services': 'dubai-abu-dhabi',
    '/gallery': 'sri-lanka',
    '/contact': 'kashi-gaya-prayag-ayodhya',
    '/faq': 'nepal',
    '/tours/saved': 'darjeeling-gangtok-pelling',
    '/tours/compare': 'egypt-hurghada',
  };
  const utility = [
    '/contact',
    '/faq',
    '/travel-information',
    '/tours/saved',
    '/tours/compare',
  ].includes(path || '');
  const photo =
    !utility &&
    photos.find((p) => p.slug === (photoSlug || imageSlug[path || '']));
  return (
    <section
      data-page={path?.split('/')[1] || 'collection'}
      className={`page-intro ${photo ? 'editorial-intro' : ''} ${utility ? 'utility-intro' : ''}`}
    >
      <div className="wrap">
        {path ? (
          <Breadcrumb
            items={[
              { name: 'Home', path: '/' },
              { name: eyebrow, path },
            ]}
          />
        ) : (
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={13} />
            <span>{eyebrow}</span>
          </div>
        )}
        <div className="editorial-intro-layout">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>
              {title}
              <br />
              <em>{accent}</em>
            </h1>
            <p className="page-description">{description}</p>
          </div>
          {photo && (
            <figure className="intro-photo">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width:640px) 90vw, (max-width:900px) 40vw, 450px"
                quality={60}
                loading="eager"
                fetchPriority="high"
              />
              <figcaption>
                <Link href={`/photo-credits#${photo.slug}`}>
                  Destination inspiration · Photo credits
                </Link>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
      {!photo && <span className="intro-orbit" aria-hidden="true" />}
    </section>
  );
}
export function JourneyCTA() {
  return (
    <section className="compact-cta wrap curated-cta">
      <div>
        <p className="eyebrow">LET’S MAKE IT HAPPEN</p>
        <h2>
          Your next trip.
          <br />
          <em>Our personal attention.</em>
        </h2>
        <p>Tell us where you want to go. We’ll help with the details.</p>
      </div>
      <div>
        <WhatsAppLink className="button">
          Let’s plan your journey <ArrowUpRight size={18} />
        </WhatsAppLink>
        <a className="text-link" href={`tel:+${business.phones[0].number}`}>
          <Phone size={18} /> Prefer to call? Talk to our team.
        </a>
        <p className="cta-reassurance">
          Personal advice. No booking commitment.
        </p>
      </div>
    </section>
  );
}
