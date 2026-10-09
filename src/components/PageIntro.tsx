import WhatsAppLink from '@/components/WhatsAppLink';
import Link from 'next/link';
import Image from 'next/image';
import photos from '@/data/tour-photos.json';
import { ArrowUpRight, ChevronRight, MessageCircle } from 'lucide-react';
import { business } from '@/data/site';
import Breadcrumb from './Breadcrumb';
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  path,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  path?: string;
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
  const photo = photos.find((p) => p.slug === imageSlug[path || '']);
  return (
    <section className={`page-intro ${photo ? 'editorial-intro' : ''}`}>
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
              />
              <figcaption>
                <Link href={`/photo-credits#${photo.slug}`}>
                  Destination inspiration · Photo credits ↗
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
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2>
          Somewhere unforgettable.
          <br />
          <em>Starts with a hello.</em>
        </h2>
        <p>Your dream. Our experience. Let’s plan something personal.</p>
      </div>
      <div>
        <WhatsAppLink className="button">
          Let’s plan your journey <ArrowUpRight size={18} />
        </WhatsAppLink>
        <a
          className="text-link"
          href={business.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} /> Personal advice. No booking commitment.
        </a>
      </div>
    </section>
  );
}
