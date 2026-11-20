import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { destinations } from '@/data/site';
import tours, { tourPhoto } from '@/data/catalogue';
import TourCard from '@/components/TourCard';
import TourDiscovery from '@/components/TourDiscovery';
import InstagramShowcase from '@/components/InstagramShowcase';
import GoogleReviews from '@/components/GoogleReviews';
import HomeHero from '@/components/HomeHero';
import InteractiveJourneyVisualizer from '@/components/InteractiveJourneyVisualizer';
import WanderlustMoodMatcher from '@/components/WanderlustMoodMatcher';
import HeritageTrustStats from '@/components/HeritageTrustStats';

export const metadata = {
  title: {
    absolute: 'Shree Vandana Tours & Travels | Curated Holidays from Pune',
  },
  description:
    'Discover Kashmir, Kerala, Dubai, Nepal, Sikkim and Rajasthan holidays with Shree Vandana Tours & Travels, Pune. Explore day-by-day itineraries and plan directly with our family team on WhatsApp.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const journeys = ['kashmir-7-days', 'kerala-6-days', 'dubai-delight-6-days'].map(slug => {
    const tour = tours.find(item => item.slug === slug)!;
    const photo = tourPhoto(tour)!;
    return {
      id: slug, slug, title: tour.name, region: tour.country, duration: tour.duration + ' days', tagline: tour.summary,
      days: tour.days.map((day, index) => ({
        day: index + 1, location: day.title, title: day.title, narrative: day.description,
        image: photo.src, chips: [], altitudeOrVibe: tour.theme,
      })),
    };
  });
  return (
    <main id="top" className="focused-home luxury-home-revamp">
      <HomeHero />

      {/* Refined Tour Discovery & Search Bar */}
      <section
        id="discover"
        className="wrap home-discovery"
        aria-label="Discover your next tour"
      >
        <TourDiscovery compact />
      </section>

      {/* Popular Destination Shortcuts */}
      <nav
        className="wrap destination-shortcuts"
        aria-label="Popular destinations"
      >
        <span className="shortcuts-label">TRENDING DESTINATIONS:</span>
        {destinations.map((d) => (
          <Link key={d.slug} href={`/destinations/${d.slug}`} className="shortcut-pill">
            <span>{d.name}</span>
            <ArrowUpRight size={13} />
          </Link>
        ))}
      </nav>

      {/* Signature Interactive Day-by-Day Journey Experience */}
      <div id="interactive-journey">
        <InteractiveJourneyVisualizer journeys={journeys} />
      </div>

      {/* Interactive Mood Matcher */}
      <WanderlustMoodMatcher />

      {/* Featured Curated Journeys */}
      <section className="section wrap featured-journeys">
        <div className="section-heading">
          <div>
            <div className="luxury-eyebrow-badge">
              <span>HANDCRAFTED DEPARTURES</span>
            </div>
            <h2>
              Iconic itineraries. <br />
              <em>Tailored to your pace.</em>
            </h2>
          </div>
          <Link href="/tours" className="text-link">
            Explore all {tours.length} tours <ArrowUpRight size={18} />
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

      {/* 35-Year Heritage & Pune Founder Trust Showcase */}
      <HeritageTrustStats />

      {/* Verified Google Reviews */}
      <GoogleReviews />

      {/* Instagram Video Showcase */}
      <InstagramShowcase />
    </main>
  );
}
