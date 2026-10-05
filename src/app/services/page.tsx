import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  Users,
  Heart,
  Globe2,
  ArrowUpRight,
  Tickets,
  Hotel,
  FileCheck,
} from 'lucide-react';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
export const metadata: Metadata = {
  title: 'Our travel services',
  description:
    'Domestic and international holidays, flight, train and bus bookings, hotel reservations, custom itineraries and visa assistance from our Pune team.',
  alternates: { canonical: '/services' },
};
const services = [
  {
    icon: Tickets,
    title: 'Flight, train & bus bookings',
    description: 'The right connection for your next journey.',
    details:
      'Contact our team for ticket options, fares and availability. Bookings are confirmed with our team.',
  },
  {
    icon: Hotel,
    title: 'Hotel reservations',
    description: 'A comfortable place to arrive, unwind and feel at home.',
    details:
      'Share your destination, dates and room preferences. We’ll help you find suitable accommodation.',
  },
  {
    icon: FileCheck,
    title: 'Visa assistance',
    description: 'Support with the paperwork before you travel.',
    details:
      'Speak with our team about destination requirements and application documents. Visa decisions remain with the issuing authority.',
  },
  {
    icon: Compass,
    title: 'Custom holidays',
    description:
      'Start with an idea. We’ll help shape the destination, pace and experiences around you.',
    details:
      'For travellers who want a journey that reflects their interests, travel style and budget.',
  },
  {
    icon: Users,
    title: 'Family & group travel',
    description:
      'More people, more memories. Thoughtful planning for time together.',
    details:
      'Share your group size, ages and preferences so we can discuss a comfortable plan for everyone.',
  },
  {
    icon: Globe2,
    title: 'India & international holidays',
    description:
      'Discover a different side of home, or venture somewhere entirely new.',
    details:
      'Tell us where you’d like to go. Our team will discuss the possibilities, availability and travel requirements.',
  },
  {
    icon: Heart,
    title: 'Special occasions',
    description: 'A celebration, a reunion or simply a well-deserved break.',
    details:
      'Let us know what makes this journey special, and we’ll help you plan around the occasion.',
  },
];
export default function ServicesPage() {
  return (
    <main>
      <PageIntro
        path="/services"
        eyebrow="Travel services"
        title="You bring the dream."
        accent="We bring the planning."
        description="Travel advice and personalised itineraries with the care, comfort and attention your holiday deserves."
      />
      <section className="section wrap service-detail-grid">
        {services.map(({ icon: Icon, title, description, details }) => (
          <article className="service-detail" key={title}>
            <Icon size={30} />
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{details}</p>
            <Link
              className="text-link"
              href={`/enquire?destination=${encodeURIComponent(title)}`}
            >
              Discuss my plans <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </section>
      <section className="wrap process-section">
        <p className="eyebrow">SIMPLE FROM THE START</p>
        <h2>
          Three steps to
          <br />
          <em>a thoughtful holiday.</em>
        </h2>
        <ol>
          <li>
            <span>01</span>
            <h3>Tell us your idea</h3>
            <p>Your dates, people, destination and preferences.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Shape the journey</h3>
            <p>Discuss a personalised plan and quote with our team.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Confirm the details</h3>
            <p>Review inclusions and booking conditions before you commit.</p>
          </li>
        </ol>
      </section>
      <JourneyCTA />
    </main>
  );
}
