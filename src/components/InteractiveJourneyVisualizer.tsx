'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Compass, MapPin, Sparkles } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';

type JourneyDay = {
  day: number;
  location: string;
  title: string;
  narrative: string;
  image: string;
  chips: string[];
  altitudeOrVibe: string;
};

type SignatureJourney = {
  id: string;
  title: string;
  region: string;
  slug: string;
  duration: string;
  tagline: string;
  days: JourneyDay[];
};

export default function InteractiveJourneyVisualizer({ journeys }: { journeys: SignatureJourney[] }) {
  const [selectedJourney, setSelectedJourney] = useState<SignatureJourney>(
    journeys[0],
  );
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const currentDay = selectedJourney.days[activeDayIndex] || selectedJourney.days[0];

  const handleSelectJourney = (journey: SignatureJourney) => {
    setSelectedJourney(journey);
    setActiveDayIndex(0);
  };

  return (
    <section className="section wrap visualizer-section" aria-label="Interactive Day-by-Day Journey Experience">
      <div className="section-heading visualizer-heading">
        <div>
          <div className="luxury-eyebrow-badge">
            <Sparkles size={13} className="text-brand" />
            <span>STEP INSIDE THE JOURNEY</span>
          </div>
          <h2>
            See every day, <br />
            <em>before you pack.</em>
          </h2>
        </div>
        <p className="visualizer-intro">
          Choose a destination and a day to preview the published route.
        </p>
      </div>

      {/* Journey Selector Tabs */}
      <div className="visualizer-tabs-container" role="tablist" aria-label="Choose a signature journey">
        {journeys.map((journey) => {
          const isActive = journey.id === selectedJourney.id;
          return (
            <button
              key={journey.id}
              role="tab"
              aria-selected={isActive}
              className={`visualizer-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSelectJourney(journey)}
            >
              <span className="tab-pill-title">{journey.title.split(':')[0]}</span>
              <span className="tab-pill-sub">{journey.duration}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      <div className="visualizer-stage-card">
        {/* Day Navigation Timeline */}
        <div className="day-timeline-bar" role="tablist" aria-label="Select itinerary day">
          {selectedJourney.days.map((d, idx) => (
            <button
              key={d.day}
              role="tab"
              aria-selected={idx === activeDayIndex}
              className={`timeline-day-pill ${idx === activeDayIndex ? 'is-active' : ''}`}
              onClick={() => setActiveDayIndex(idx)}
            >
              <span className="timeline-day-num">Day 0{d.day}</span>
              <span className="timeline-day-loc">{d.location.split('·')[0].trim()}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Day Content Grid */}
        <div className="visualizer-day-content" key={`${selectedJourney.id}-${currentDay.day}`}>
          <div className="visualizer-photo-frame">
            <Image
              src={currentDay.image}
              alt={selectedJourney.title + ' destination inspiration'}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="visualizer-photo"
              loading="lazy"
            />
            <div className="photo-vignette" />
            <div className="photo-badge-overlay">
              <span className="badge-altitude">
                <Compass size={13} /> {currentDay.altitudeOrVibe}
              </span>
              <span className="badge-location">
                <MapPin size={13} /> {currentDay.location}
              </span>
            </div>
          </div>

          <div className="visualizer-narrative-panel">
            <div className="panel-meta">
              <span className="day-pill-chip">
                <Calendar size={13} /> Day {currentDay.day} of {selectedJourney.days.length}
              </span>
              <span className="destination-name-tag">{selectedJourney.region}</span>
            </div>

            <h3 className="day-headline">{currentDay.title}</h3>
            <p className="day-description">{currentDay.narrative}</p>

            <div className="visualizer-actions">
              <WhatsAppLink
                destination={`${selectedJourney.title} (Discussing Day ${currentDay.day}: ${currentDay.title})`}
                className="button visualizer-whatsapp-btn"
              >
                <span>Plan this itinerary on WhatsApp</span>
                <ArrowUpRight size={16} />
              </WhatsAppLink>
              <Link href={`/tours/${selectedJourney.slug}`} className="button outline visualizer-details-btn">
                <span>Full itinerary outline</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
