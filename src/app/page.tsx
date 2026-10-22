import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowDown, HeartHandshake, MapPin } from 'lucide-react';
import { faqs } from '@/data/site';
import tours from '@/data/catalogue';
import photos from '@/data/tour-photos.json';
import { travelStyles } from '@/lib/real-tours';
import TourCard from '@/components/TourCard';
import TourDiscovery from '@/components/TourDiscovery';
import WhatsAppLink from '@/components/WhatsAppLink';
import BusinessStructuredData from '@/components/BusinessStructuredData';
import InstagramShowcase from '@/components/InstagramShowcase';
import GoogleReviews from '@/components/GoogleReviews';
import { JourneyCTA } from '@/components/PageIntro';
import DiscoveryPlayground from '@/components/DiscoveryPlayground';
import DestinationAtlas from '@/components/DestinationAtlas';
import { collections } from '@/data/collections';
export const metadata = { alternates: { canonical: '/' } };
const featured = tours
  .filter((t) => [45, 1, 22, 42, 24, 31].includes(t.source.order || 0))
  .map((t) => t.slug);
export default function Home() {
  return (
    <main id="top">
      <BusinessStructuredData />
      <section className="curated-hero wrap">
        <div className="curated-hero-image">
          <Image
            src="/assets/images/tours/nepal.webp"
            alt="The mountains and lakeside scenery of Pokhara, Nepal"
            fill
            sizes="(max-width: 640px) 100vw, 1240px"
            quality={60}
            preload
          />
        </div>
        <div className="curated-hero-shade" />
        <div className="curated-hero-copy">
          <p className="eyebrow">PUNE TO THE WORLD · FRIEND IN TOURISM</p>
          <h1>
            A world of stories.
            <br />
            <em>Find the one that’s yours.</em>
          </h1>
          <p>
            Three generations of experience.
            <br />A holiday planned around you.
          </p>
          <div className="hero-actions">
            <Link href="/tours" className="button warm">
              Explore journeys <ArrowUpRight size={18} />
            </Link>
            <WhatsAppLink className="hero-chat">
              Plan on WhatsApp <ArrowUpRight size={18} />
            </WhatsAppLink>
          </div>
        </div>
        <div className="curated-hero-bottom">
          <a href="#discover">
            <ArrowDown size={16} /> Find your next chapter
          </a>
          <Link href="/photo-credits#nepal">
            <MapPin size={14} /> Pokhara, Nepal · Photo credits ↗
          </Link>
        </div>
        <span className="curated-hero-seal">
          <strong>✳</strong>
          <span>
            YOUR LIVING
            <br />
            TRAVEL JOURNAL
          </span>
        </span>
      </section>
      <section
        id="discover"
        className="wrap home-discovery"
        aria-label="Discover your next tour"
      >
        <TourDiscovery compact />
      </section>
      <div className="wrap curated-trust">
        <div>
          <strong>✳</strong>
          <span>A family-run travel business</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Generations of care</span>
        </div>
        <div>
          <HeartHandshake size={26} />
          <span>Personally planned</span>
        </div>
        <div>
          <MapPin size={24} />
          <span>Your team in Pune</span>
        </div>
      </div>
      <section className="section wrap featured-journeys">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE JOURNEY COLLECTION / 01</p>
            <h2>
              Somewhere wonderful.
              <br />
              <em>Something personal.</em>
            </h2>
          </div>
          <Link href="/tours" className="text-link">
            All {tours.length} source outlines <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="brochure-tour-grid">
          {featured.map((slug, index) => (
            <TourCard
              tour={tours.find((t) => t.slug === slug)!}
              index={index}
              key={slug}
            />
          ))}
        </div>
      </section>
      <DiscoveryPlayground
        journeys={tours.map((t) => ({
          slug: t.slug,
          name: t.name,
          country: t.country,
          duration: t.duration,
          theme: t.theme,
        }))}
      />
      <section className="section style-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FOLLOW THE FEELING / 02</p>
              <h2>
                What does your
                <br />
                <em>kind of escape look like?</em>
              </h2>
            </div>
            <p>Start with a feeling. Find a route that speaks to you.</p>
          </div>
          <div className="travel-style-grid">
            {travelStyles.map((style, i) => {
              const photo = photos.find((p) => p.slug === style.photo)!;
              return (
                <Link
                  href={`/tours?style=${style.value}`}
                  className="travel-style-card"
                  key={style.value}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width:640px) 90vw, (max-width:1100px) 45vw, 300px"
                    quality={60}
                  />
                  <div>
                    <span>0{i + 1}</span>
                    <h3>{style.name}</h3>
                    <p>{style.note}</p>
                    <ArrowUpRight size={22} />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="style-footnotes">
            <Link href="/tours?region=International">
              International adventures ↗
            </Link>
            <WhatsAppLink destination="a family or group holiday">
              Family & group travel ↗
            </WhatsAppLink>
            <Link href="/photo-credits">Photography credits ↗</Link>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">NEAR OR FAR / 03</p>
            <h2>
              A different world.
              <br />
              <em>In every direction.</em>
            </h2>
          </div>
          <Link href="/destinations" className="text-link">
            Our most-loved destinations <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="world-split">
          {[
            {
              title: 'Incredible India',
              subtitle: 'Closer to home. Far from ordinary.',
              photo: 'darjeeling-gangtok-pelling',
              region: 'India',
              examples: 'Kerala · Kashmir · Darjeeling · Sacred journeys',
            },
            {
              title: 'Beyond borders',
              subtitle: 'New places. A fresh perspective.',
              photo: 'egypt-hurghada',
              region: 'International',
              examples: 'Dubai · Nepal · Sri Lanka · Bhutan · Egypt',
            },
          ].map((item) => (
            <Link
              href={`/tours?region=${item.region}`}
              className="world-card"
              key={item.region}
            >
              <Image
                src={photos.find((p) => p.slug === item.photo)!.src}
                alt={photos.find((p) => p.slug === item.photo)!.alt}
                fill
                sizes="(max-width:700px) 90vw, 600px"
                quality={60}
              />
              <div>
                <p>{item.subtitle}</p>
                <h3>{item.title}</h3>
                <span>{item.examples}</span>
                <strong>
                  Explore the collection <ArrowUpRight size={18} />
                </strong>
              </div>
            </Link>
          ))}
        </div>
        <p className="reel-disclaimer">
          Licensed destination inspiration ·{' '}
          <Link href="/photo-credits">View photography credits</Link>
        </p>
      </section>
      <section className="story-section">
        <div className="wrap story-grid">
          <div className="story-photo">
            <Image
              src="/assets/images/tours/royal-bhutan.webp"
              alt="Destination inspiration: the valley around Paro, Bhutan"
              fill
              sizes="(max-width:900px) 90vw, 550px"
              quality={60}
            />
            <div className="legacy-card">
              <strong>
                Three generations.
                <br />
                <em>One shared passion.</em>
              </strong>
              <span>OUR LEGACY, YOUR JOURNEY</span>
            </div>
          </div>
          <div className="story-content">
            <p className="eyebrow">MEET YOUR FRIEND IN TOURISM / 04</p>
            <h2>
              Travel feels better
              <br />
              <em>when it feels personal.</em>
            </h2>
            <p>
              Our family-run business in Pune brings experience, care and
              thoughtful planning to every journey.
            </p>
            <p>
              Across three generations, one belief carries forward: get to know
              the traveller, then plan the holiday. Your people, your pace, your
              idea of a wonderful time.
            </p>
            <Link href="/about" className="text-link">
              Discover our story <ArrowUpRight size={18} />
            </Link>
            <Link
              href="/photo-credits#royal-bhutan"
              className="tour-card-credit"
            >
              Bhutan inspiration · photo credits
            </Link>
          </div>
        </div>
      </section>
      <section className="section wrap process-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM A DREAM TO A PLAN / 05</p>
            <h2>
              Made simple.
              <br />
              <em>Made for you.</em>
            </h2>
          </div>
          <WhatsAppLink className="text-link">
            Start a conversation <ArrowUpRight size={18} />
          </WhatsAppLink>
        </div>
        <ol>
          {[
            [
              'Tell us your dream',
              'A place you’ve imagined. The people coming along. Share your dates and what matters to you.',
            ],
            [
              'We craft your journey',
              'Our team helps connect the places, stays and travel arrangements in a personalised plan and quote.',
            ],
            [
              'Review every detail',
              'Understand the itinerary, inclusions and booking conditions before you decide to confirm.',
            ],
          ].map(([title, copy], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <p className="reel-disclaimer">
          A WhatsApp enquiry starts a conversation. It does not reserve a trip
          or take payment.
        </p>
      </section>
      <section className="why-section">
        <div className="wrap why-layout">
          <div>
            <p className="eyebrow">THE PERSONAL TOUCH / 06</p>
            <h2>
              A world of possibilities.
              <br />
              <em>A person to guide you.</em>
            </h2>
            <Link href="/services" className="text-link">
              How we can help <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="why-list">
            {[
              [
                'Experience with care',
                'A family-run travel business, with personal attention at the heart of every plan.',
              ],
              [
                'Room for your preferences',
                'Discuss the pace, interests and arrangements that suit your family or group.',
              ],
              [
                'The details, together',
                'Holidays, tickets, hotels and visa assistance — speak with one Pune team about what you need.',
              ],
            ].map(([title, copy], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE VISUAL WANDERLUST / 07</p>
            <h2>
              Collect moments.
              <br />
              <em>Keep the feeling.</em>
            </h2>
          </div>
          <Link href="/gallery" className="text-link">
            The travel gallery <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="home-photo-triptych">
          {[
            'shimla-kullu-manali',
            'sri-lanka',
            'kashi-gaya-prayag-ayodhya',
          ].map((slug) => {
            const photo = photos.find((p) => p.slug === slug)!;
            return (
              <Link
                key={slug}
                href="/gallery"
                aria-label={`View destination inspiration: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  quality={60}
                  sizes="(max-width:640px) 45vw, 400px"
                />
              </Link>
            );
          })}
        </div>
        <p className="reel-disclaimer">
          Destination inspiration, photographed around the world.{' '}
          <Link href="/photo-credits">Credits & licences ↗</Link>
        </p>
      </section>
      <DestinationAtlas />
      <section className="section wrap journal-collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A SHELF OF POSSIBILITIES</p>
            <h2>
              Choose your
              <br />
              <em>next chapter.</em>
            </h2>
          </div>
          <p>Collections connected to the actual routes in our journal.</p>
        </div>
        <div className="collection-shelf">
          {collections.map((c, i) => (
            <Link key={c.slug} href={`/collections/${c.slug}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
              <small>{c.tours.length} outlines ↗</small>
            </Link>
          ))}
        </div>
      </section>
      <InstagramShowcase />
      <GoogleReviews />
      <section className="section wrap faq-grid">
        <div>
          <p className="eyebrow">BEFORE THE FIRST HELLO / 08</p>
          <h2>
            A little clarity.
            <br />
            <em>A confident start.</em>
          </h2>
          <Link href="/faq" className="text-link">
            More questions, answered <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="faq-list">
          {faqs.slice(0, 4).map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span>+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
