'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';
import ScenicVideo from './ScenicVideo';
import ParallaxHero from './ParallaxHero';

export type DestinationDroneOption = {
  id: string;
  name: string;
  label: string;
  tagline: string;
  assetBase: string;
  fallback: string;
  photoCreditLink: string;
};

const DRONE_DESTINATIONS: DestinationDroneOption[] = [
  {
    id: 'all',
    name: 'All Destinations',
    label: 'Kerala, Kashmir, Dubai, Nepal & Sikkim aerial drone showreel',
    tagline: 'Scenic drone flights across India & premier international tours',
    assetBase: 'home-destinations-drone',
    fallback: '/assets/images/tours/kerala-6-days.webp',
    photoCreditLink: '/photo-credits#video-kerala',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    label: 'Munnar green tea hills and serene backwaters',
    tagline: 'Lush tea plantations, misty Western Ghats & emerald backwaters',
    assetBase: 'kerala-montage-v1',
    fallback: '/assets/images/tours/kerala-6-days.webp',
    photoCreditLink: '/photo-credits#video-kerala',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    label: 'Dal Lake shikaras and snow-capped Himalayan peaks',
    tagline: 'Pristine mountain lakes, alpine meadows & snow-capped peaks',
    assetBase: 'kashmir-montage-v1',
    fallback: '/assets/images/tours/kashmir-7-days.webp',
    photoCreditLink: '/photo-credits#video-kashmir',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    label: 'Dubai Marina skyline, beachfront and golden dunes',
    tagline: 'Futuristic architectural wonders & Arabian desert dunes',
    assetBase: 'dubai-montage-v1',
    fallback: '/assets/images/tours/dubai-abu-dhabi.webp',
    photoCreditLink: '/photo-credits#video-dubai',
  },
  {
    id: 'nepal',
    name: 'Nepal',
    label: 'Phewa Lake and Annapurna Himalayan mountain range',
    tagline: 'Majestic Himalayan summits, stupas & peaceful mountain lakes',
    assetBase: 'nepal-montage-v1',
    fallback: '/assets/images/tours/nepal.webp',
    photoCreditLink: '/photo-credits#video-nepal',
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    label: 'Himalayan ridges, Kanchenjunga views & tea valleys',
    tagline: 'Misty mountain ridges & tranquil Eastern Himalayan plateaus',
    assetBase: 'sikkim-montage-v1',
    fallback: '/assets/images/tours/darjeeling-gangtok-pelling.webp',
    photoCreditLink: '/photo-credits#video-sikkim',
  },
];

export default function HomeHero() {
  const [selected, setSelected] = useState<DestinationDroneOption>(DRONE_DESTINATIONS[0]);

  return (
    <section className="curated-hero home-hero-fullscreen" aria-label="Scenic travel video showcase">
      <ParallaxHero speed={0.28} className="home-hero-parallax">
        <ScenicVideo
          key={selected.id}
          id={selected.id}
          assetBase={selected.assetBase}
          label={selected.label}
          fallback={selected.fallback}
          alt={`Scenic drone footage: ${selected.label}`}
          sizes="100vw"
          priority
        />
      </ParallaxHero>
      <div className="curated-hero-shade" />

      <div className="wrap home-hero-content">
        <div className="curated-hero-copy">
          <p className="eyebrow">SHREE VANDANA / PUNE TO THE WORLD</p>
          <h1>
            Go further.
            <br />
            <em>Travel better.</em>
          </h1>
          <p>
            Personal holidays. Thoughtfully planned by our family-run team in Pune.
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

        {/* Destination Switcher Pills */}
        <div className="home-drone-selector" aria-label="Explore places we provide trips of">
          <p className="drone-selector-heading">
            <span>DRONE FOOTAGE · OUR DESTINATIONS</span>
          </p>
          <div className="drone-pill-list" role="tablist">
            {DRONE_DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                type="button"
                role="tab"
                aria-selected={selected.id === dest.id}
                className={`drone-pill ${selected.id === dest.id ? 'is-active' : ''}`}
                onClick={() => setSelected(dest)}
              >
                {dest.name}
              </button>
            ))}
          </div>
          <div className="drone-active-tagline">
            <MapPin size={13} aria-hidden="true" />
            <span>{selected.tagline}</span>
          </div>
        </div>
      </div>

      <div className="wrap curated-hero-bottom home-hero-bottom-bar">
        <Link href={selected.photoCreditLink} className="hero-credit-link">
          <MapPin size={14} /> {selected.name} · Scenic drone credits
        </Link>
      </div>
    </section>
  );
}

