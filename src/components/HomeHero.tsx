'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Shuffle, Compass } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';
import ScenicVideo from './ScenicVideo';
import ParallaxHero from './ParallaxHero';
import priorityPhotos from '@/data/priority-photos.json';

export type DestinationDroneOption = {
  id: string;
  name: string;
  label: string;
  tagline: string;
  assetBase: string;
  fallback: string;
  photoSlug: string;
  photoCreditLink: string;
};

const DRONE_DESTINATIONS: DestinationDroneOption[] = [
  {
    id: 'all',
    name: 'All Destinations',
    label:
      'Coasts, mountain valleys and skylines across Kerala, Kashmir, Dubai, Nepal and Sikkim',
    tagline: 'Scenic drone flights across India & premier international tours',
    assetBase: 'home-cinema-v3',
    fallback: '/assets/videos/home-cinema-v2-poster.webp',
    photoSlug: 'nepal',
    photoCreditLink: '/photo-credits#video-home-destinations-drone',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    label: 'Munnar green tea hills and serene backwaters',
    tagline: 'Lush tea plantations, misty Western Ghats & emerald backwaters',
    assetBase: 'kerala-cinema-v3',
    fallback: priorityPhotos['kerala-kanyakumari'],
    photoSlug: 'kerala-6-days',
    photoCreditLink: '/photo-credits#video-kerala',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    label: 'Dal Lake shikaras and snow-capped Himalayan peaks',
    tagline: 'Pristine mountain lakes, alpine meadows & snow-capped peaks',
    assetBase: 'kashmir-cinema-v3',
    fallback: priorityPhotos['kashmir-amritsar-vaishno-devi'],
    photoSlug: 'kashmir-7-days',
    photoCreditLink: '/photo-credits#video-kashmir',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    label: 'Dubai Marina skyline, beachfront and golden dunes',
    tagline: 'Futuristic architectural wonders & Arabian desert dunes',
    assetBase: 'dubai-cinema-v3',
    fallback: priorityPhotos['dubai-abu-dhabi'],
    photoSlug: 'dubai-abu-dhabi',
    photoCreditLink: '/photo-credits#video-dubai',
  },
  {
    id: 'nepal',
    name: 'Nepal',
    label: 'Phewa Lake and Annapurna Himalayan mountain range',
    tagline: 'Majestic Himalayan summits, stupas & peaceful mountain lakes',
    assetBase: 'nepal-cinema-v3',
    fallback: priorityPhotos['nepal'],
    photoSlug: 'nepal',
    photoCreditLink: '/photo-credits#video-nepal',
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    label: 'Himalayan ridges, Kanchenjunga views & tea valleys',
    tagline: 'Misty mountain ridges & tranquil Eastern Himalayan plateaus',
    assetBase: 'sikkim-cinema-v3',
    fallback: priorityPhotos['darjeeling-gangtok-pelling'],
    photoSlug: 'darjeeling-gangtok-pelling',
    photoCreditLink: '/photo-credits#video-sikkim',
  },
];

export default function HomeHero() {
  const [selected, setSelected] = useState<DestinationDroneOption>(
    DRONE_DESTINATIONS[0],
  );

  return (
    <section
      className="curated-hero home-hero-fullscreen"
      aria-label="Scenic travel video showcase"
    >
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
          native4k={selected.id === 'all'}
        />
      </ParallaxHero>
      <div className="curated-hero-shade" />


      <div className="wrap home-hero-content">
        <div className="atlas-object" aria-hidden="true">
          <div className="atlas-fold" style={{ '--atlas-photo': `url("${selected.id === 'all' ? priorityPhotos.nepal : selected.fallback}")` } as React.CSSProperties}>
            <i /><i /><i />
          </div>
          <div className="atlas-caption"><Compass size={19} />{selected.id === 'all' ? 'India & beyond' : selected.name}</div>
        </div>
        <div className="curated-hero-copy">
          <h1 className="hero-title-editorial">
            Holidays from Pune.
            <br />
            <em className="hero-serif-accent">Where to next?</em>
          </h1>

          <p className="hero-description">
            Explore India and beyond with our family travel team. Pick a route, browse the day-by-day itinerary and ask us for a personal quote.
          </p>

          <div className="hero-actions">
            <Link
              href={
                selected.id === 'all'
                  ? '/tours'
                  : `/destinations/${selected.id === 'sikkim' ? 'sikkim-darjeeling' : selected.id}`
              }
              className="button warm hero-primary-btn"
            >
              <span>
                {selected.id === 'all'
                  ? 'Explore all tours'
                  : `Explore ${selected.name}`}
              </span>
              <ArrowUpRight size={17} />
            </Link>
            <WhatsAppLink
              className="button hero-whatsapp-pill"
              destination={selected.id === 'all' ? undefined : selected.name}
            >
              <span>Plan on WhatsApp</span>
              <ArrowUpRight size={16} />
            </WhatsAppLink>
            <a href="#interactive-journey" className="hero-scroll-cue-link">
              <Compass size={15} />
              <span>Preview day-by-day</span>
            </a>
          </div>

          {/* Cleanly aligned destination switcher dock */}
          <div
            className="home-drone-selector"
            aria-label="Explore places we provide trips of"
          >
            <div className="drone-selector-heading">
              <span>CHOOSE A DESTINATION</span>
            </div>
            <div className="drone-pill-row">
              <div
                className="drone-pill-list"
                role="group"
                aria-label="Choose destination scenery"
              >
                {DRONE_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    aria-pressed={selected.id === dest.id}
                    className={`drone-pill ${selected.id === dest.id ? 'is-active' : ''}`}
                    onClick={() => setSelected(dest)}
                  >
                    {dest.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="destination-shuffle"
                aria-label="Surprise me with a destination"
                title="Surprise me"
                onClick={() => {
                  const choices = DRONE_DESTINATIONS.filter(
                    (d) => d.id !== 'all' && d.id !== selected.id,
                  );
                  setSelected(
                    choices[Math.floor(Math.random() * choices.length)],
                  );
                }}
              >
                <Shuffle size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
