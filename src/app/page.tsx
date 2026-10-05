import MoreDestinations from '@/components/MoreDestinations';
import WhatsAppLink from '@/components/WhatsAppLink';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  HeartHandshake,
  Users,
  MapPin,
  Check,
  MessageCircle,
} from 'lucide-react';
import { business, faqs } from '@/data/site';
import DestinationGrid from '@/components/DestinationGrid';
import BusinessStructuredData from '@/components/BusinessStructuredData';
import InstagramShowcase from '@/components/InstagramShowcase';
import GoogleReviews from '@/components/GoogleReviews';
export const metadata = { alternates: { canonical: '/' } };
export default function Home() {
  return (
    <main id="top">
      <BusinessStructuredData />
      <section className="hero">
        <div className="wrap hero-layout">
          <div className="hero-content">
            <p className="hero-kicker">
              <span>✳</span> A WORLD OF POSSIBILITIES. A FRIEND TO TAKE YOU
              THERE.
            </p>
            <h1>
              Go somewhere
              <br />
              that stays
              <br />
              <em>with you.</em>
            </h1>
            <p className="hero-copy">
              Personal holidays. Family care. A world worth discovering —
              thoughtfully planned from Pune.
            </p>
            <div className="hero-actions">
              <WhatsAppLink className="button">
                Plan on WhatsApp <ArrowUpRight size={19} />
              </WhatsAppLink>
              <Link href="/destinations" className="text-link">
                Explore destinations <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <Image
                className="hero-photo"
                src="/assets/images/tours/dubai-abu-dhabi.webp"
                alt="Dubai skyline at sunset"
                fill
                sizes="(max-width:900px) calc(100vw - 40px), 580px"
                quality={60}
                loading="eager"
                fetchPriority="high"
              />
              <div className="hero-image-caption">
                <MapPin size={14} />
                <span>Dubai · one of our most-loved holidays</span>
                <Link
                  href="/photo-credits#dubai-abu-dhabi"
                  aria-label="Dubai photo credits"
                >
                  ↗
                </Link>
              </div>
            </div>
            <div
              className="hero-seal"
              aria-label="30 plus years, three generations"
            >
              <span>ESTABLISHED IN TRUST</span>
              <strong>
                30<span>+</span>
              </strong>
              <small>YEARS OF STORIES</small>
            </div>
            <div className="hero-note">
              <span>01 — THE FEELING OF GETTING AWAY</span>
              <em>
                Your next chapter,
                <br />
                beautifully planned.
              </em>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap trust-strip">
        <div>
          <strong>30+</strong>
          <span>Years of travel experience</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Generations. One shared passion.</span>
        </div>
        <div>
          <HeartHandshake size={29} />
          <span>Personal service, every step</span>
        </div>
        <WhatsAppLink>
          Your journey starts here <ArrowUpRight size={21} />
        </WhatsAppLink>
      </div>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR MOST-BOOKED DESTINATIONS</p>
            <h2>
              Your next holiday.
              <br />
              <em>A little closer.</em>
            </h2>
          </div>
          <Link href="/tours" className="text-link">
            Explore our tour collection <ArrowUpRight size={18} />
          </Link>
        </div>
        <DestinationGrid />
      </section>
      <div className="section wrap">
        <MoreDestinations />
      </div>
      <section id="about" className="story-section">
        <div className="wrap story-grid">
          <div className="story-photo">
            <Image
              src="/assets/images/gallery-3.jpg"
              alt="Travel inspiration: a peaceful holiday landscape"
              fill
              sizes="(max-width: 900px) calc(100vw - 40px), 550px"
            />
            <div className="legacy-card">
              <strong>
                Our legacy.
                <br />
                <em>Your journey.</em>
              </strong>
              <span>PUNE · INDIA</span>
            </div>
          </div>
          <div className="story-content">
            <p className="eyebrow">MORE THAN A TRAVEL COMPANY</p>
            <h2>
              Three generations.
              <br />
              <em>A world of trust.</em>
            </h2>
            <p>
              For over three decades, Shree Vandana Tours & Travels has helped
              travellers turn their journeys into memories worth keeping.
            </p>
            <p>
              What began with a passion for travel has grown into a family-run
              business in Pune. Across three generations, our promise has stayed
              the same: thoughtful planning, personal attention and dependable
              service.
            </p>
            <p>
              Whether it’s a family holiday, a group adventure or a journey
              entirely your own, we bring our experience — and a little heart —
              to every detail.
            </p>
            <Link href="/about" className="text-link">
              Get to know your travel friend <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section id="services" className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOU DREAM IT. WE PLAN IT.</p>
            <h2>
              A holiday that feels
              <br />
              <em>like you.</em>
            </h2>
          </div>
          <Link className="button outline" href="/services">
            Explore our services <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="service-grid">
          {[
            {
              icon: Compass,
              title: 'Tailored to your curiosity',
              text: 'Domestic and international itineraries shaped around your interests, pace and preferences.',
            },
            {
              icon: Users,
              title: 'Better, together',
              text: 'Family vacations and group journeys, thoughtfully planned so you can enjoy time with your people.',
            },
            {
              icon: HeartHandshake,
              title: 'A friend along the way',
              text: 'Personal attention from a team that gets to know you, from your first conversation to your travel plans.',
            },
          ].map(({ icon: Icon, title, text }, index) => (
            <article className="service-card" key={title}>
              <div className="service-top">
                <Icon size={30} />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="gallery" className="gallery-section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE WORLD IS CALLING</p>
              <h2>
                Collect moments.
                <br />
                <em>Keep the feeling.</em>
              </h2>
            </div>
            <Link href="/gallery" className="text-link">
              A closer look <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="gallery-grid">
            {[
              ['gallery-1.jpg', 'Coastal holiday scenery'],
              ['gallery-2.jpg', 'A moment of travel inspiration'],
              ['gallery-4.jpg', 'Exploring the great outdoors'],
              ['gallery-5.jpg', 'A beautiful place to unwind'],
            ].map(([image, alt]) => (
              <Link
                href="/gallery"
                key={image}
                aria-label={`View gallery: ${alt}`}
              >
                <Image
                  src={`/assets/images/${image}`}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 45vw, 280px"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <InstagramShowcase />
      <GoogleReviews />
      <section id="faq" className="section wrap faq-grid">
        <div>
          <p className="eyebrow">BEFORE YOU GO</p>
          <h2>
            A few things
            <br />
            <em>you might wonder.</em>
          </h2>
          <p>
            Need a little more guidance?
            <br />
            We’re just a conversation away.
          </p>
          <Link className="text-link" href="/faq">
            Your questions, answered <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
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
      <section className="cta-section">
        <div className="wrap cta-inner">
          <div>
            <p className="eyebrow light">LET’S MAKE A MEMORY</p>
            <h2>
              Your next adventure
              <br />
              starts with <em>a hello.</em>
            </h2>
            <p>Tell us what you have in mind. We’ll help you find your way.</p>
          </div>
          <div className="cta-actions">
            <WhatsAppLink className="button warm">
              Plan my journey <ArrowUpRight size={20} />
            </WhatsAppLink>
            <a
              href={business.whatsapp}
              className="text-link light"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={19} /> Or, chat on WhatsApp
            </a>
            <span>
              <Check size={14} /> Personal advice. No booking commitment.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
