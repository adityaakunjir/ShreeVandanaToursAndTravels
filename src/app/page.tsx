import ScenicVideo from '@/components/ScenicVideo';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Users, HeartHandshake } from 'lucide-react';
import { destinations } from '@/data/site';
import tours from '@/data/catalogue';
import TourCard from '@/components/TourCard';
import TourDiscovery from '@/components/TourDiscovery';
import WhatsAppLink from '@/components/WhatsAppLink';
import BusinessStructuredData from '@/components/BusinessStructuredData';
import InstagramShowcase from '@/components/InstagramShowcase';
import GoogleReviews from '@/components/GoogleReviews';

export const metadata = { alternates: { canonical: '/' } };

export default function Home() {
  return (
    <main id="top" className="focused-home">
      <BusinessStructuredData />
      <section className="curated-hero wrap">
        <div className="curated-hero-image">
          <ScenicVideo
            id="nepal"
            label="Phewa Lake, Pokhara, Nepal"
            fallback="/assets/images/tours/nepal.webp"
            alt="The mountains and lakeside scenery of Pokhara, Nepal"
            sizes="(max-width: 640px) 100vw, 1240px"
            priority
          />
        </div>
        <div className="curated-hero-shade" />
        <div className="curated-hero-copy">
          <p className="eyebrow">SHREE VANDANA / PUNE TO THE WORLD</p>
          <h1>
            Go further.
            <br />
            <em>Travel better.</em>
          </h1>
          <p>
            Personal holidays. Thoughtfully planned by our family-run team in
            Pune.
          </p>
          <div className="hero-actions">
            <Link href="/tours" className="button warm">
              Explore tours <ArrowUpRight size={18} />
            </Link>
            <WhatsAppLink className="hero-chat">
              Plan on WhatsApp <ArrowUpRight size={18} />
            </WhatsAppLink>
          </div>
        </div>
        <div className="curated-hero-bottom">
          <Link href="/photo-credits#video-nepal">
            <MapPin size={14} /> Pokhara, Nepal · Media credits
          </Link>
        </div>
      </section>
      <section
        id="discover"
        className="wrap home-discovery"
        aria-label="Discover your next tour"
      >
        <TourDiscovery compact />
      </section>
      <nav
        className="wrap destination-shortcuts"
        aria-label="Popular destinations"
      >
        <span>POPULAR WITH OUR TRAVELLERS</span>
        {destinations.map((d) => (
          <Link key={d.slug} href={`/destinations/${d.slug}`}>
            {d.name}
            <ArrowUpRight size={14} />
          </Link>
        ))}
      </nav>
      <section className="section wrap featured-journeys">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START SOMEWHERE GOOD</p>
            <h2>Your next holiday.</h2>
          </div>
          <Link href="/tours" className="text-link">
            All tours <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="brochure-tour-grid">
          {destinations.map((d, index) => (
            <TourCard
              key={d.slug}
              tour={tours.find((t) => t.slug === d.tourSlug)!}
              index={index}
            />
          ))}
        </div>
      </section>
      <section className="wrap home-personal">
        <div>
          <p className="eyebrow">YOUR FRIEND IN TOURISM</p>
          <h2>
            A real team.
            <br />
            <em>A personal plan.</em>
          </h2>
          <p>
            Three generations of experience, with holidays shaped around your
            people, pace and interests.
          </p>
          <Link href="/about" className="text-link">
            Meet our travel family <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="home-service-links">
          <Link href="/services">
            <HeartHandshake size={20} />
            <span>Holidays, tickets, hotels & visa assistance</span>
            <ArrowUpRight size={18} />
          </Link>
          <WhatsAppLink>
            <Users size={20} />
            <span>Plan with our Pune team on WhatsApp</span>
            <ArrowUpRight size={18} />
          </WhatsAppLink>
          <Link href="/faq">
            <span>Questions before you travel?</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <GoogleReviews />
      <InstagramShowcase />
    </main>
  );
}
