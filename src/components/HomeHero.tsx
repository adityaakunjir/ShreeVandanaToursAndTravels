'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Shuffle } from 'lucide-react';
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
  photoCreditLink: string;
};

const DRONE_DESTINATIONS: DestinationDroneOption[] = [
  {
    id: 'all',
    name: 'Highlights',
    label:
      'Coasts, mountain valleys and skylines across Kerala, Kashmir, Dubai, Nepal and Sikkim',
    tagline: 'Scenic drone flights across India & premier international tours',
    assetBase: 'home-cinema-v2',
    fallback: '/assets/videos/home-cinema-v2-poster.webp',
    photoCreditLink: '/photo-credits#video-home-destinations-drone',
  },
  {
    id: 'kerala',
    name: 'Kerala',
    label: 'Munnar green tea hills and serene backwaters',
    tagline: 'Lush tea plantations, misty Western Ghats & emerald backwaters',
    assetBase: 'kerala-cinema-v2',
    fallback: priorityPhotos['kerala-kanyakumari'],
    photoCreditLink: '/photo-credits#video-kerala',
  },
  {
    id: 'kashmir',
    name: 'Kashmir',
    label: 'Dal Lake shikaras and snow-capped Himalayan peaks',
    tagline: 'Pristine mountain lakes, alpine meadows & snow-capped peaks',
    assetBase: 'kashmir-cinema-v2',
    fallback: priorityPhotos['kashmir-amritsar-vaishno-devi'],
    photoCreditLink: '/photo-credits#video-kashmir',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    label: 'Dubai Marina skyline, beachfront and golden dunes',
    tagline: 'Futuristic architectural wonders & Arabian desert dunes',
    assetBase: 'dubai-cinema-v2',
    fallback: priorityPhotos['dubai-abu-dhabi'],
    photoCreditLink: '/photo-credits#video-dubai',
  },
  {
    id: 'nepal',
    name: 'Nepal',
    label: 'Phewa Lake and Annapurna Himalayan mountain range',
    tagline: 'Majestic Himalayan summits, stupas & peaceful mountain lakes',
    assetBase: 'nepal-cinema-v2',
    fallback: priorityPhotos['nepal'],
    photoCreditLink: '/photo-credits#video-nepal',
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    label: 'Himalayan ridges, Kanchenjunga views & tea valleys',
    tagline: 'Misty mountain ridges & tranquil Eastern Himalayan plateaus',
    assetBase: 'sikkim-cinema-v2',
    fallback: priorityPhotos['darjeeling-gangtok-pelling'],
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
        />
      </ParallaxHero>
      <div className="curated-hero-shade" />

      <div className="wrap home-hero-content">
        <div className="curated-hero-copy">
          <p className="eyebrow">HOLIDAYS, PERSONALLY PLANNED</p>
          <h1>
            Go further.
            <br />
            <em>Feel more.</em>
          </h1>
          <p>Remarkable places. Thoughtfully planned from Pune.</p>
          <div className="hero-actions">
            <Link
              href={
                selected.id === 'all'
                  ? '/tours'
                  : `/destinations/${selected.id === 'sikkim' ? 'sikkim-darjeeling' : selected.id}`
              }
              className="button warm"
            >
              {selected.id === 'all'
                ? 'Explore tours'
                : `Explore ${selected.name}`}{' '}
              <ArrowUpRight size={18} />
            </Link>
            <WhatsAppLink
              className="hero-chat"
              destination={selected.id === 'all' ? undefined : selected.name}
            >
              WhatsApp <ArrowUpRight size={18} />
            </WhatsAppLink>
          </div>
        </div>

        {/* Destination Switcher Pills */}
        <div
          className="home-drone-selector"
          aria-label="Explore places we provide trips of"
        >
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
              setSelected(choices[Math.floor(Math.random() * choices.length)]);
            }}
          >
            <Shuffle size={17} aria-hidden="true" />
          </button>
          <span className="visually-hidden" role="status">
            {selected.id === 'all'
              ? 'Journey highlights'
              : `Next stop: ${selected.name}`}
          </span>
        </div>
      </div>
    </section>
  );
}
