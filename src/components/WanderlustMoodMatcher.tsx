'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass, HeartHandshake, Mountain, Palmtree, Castle, Building2, Waves } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';

type MoodCategory = {
  id: string;
  name: string;
  subtitle: string;
  icon: typeof Mountain;
  accent: string;
  tours: {
    slug: string;
    title: string;
    duration: string;
    stops: string;
    tag: string;
  }[];
};

const MOODS: MoodCategory[] = [
  {
    id: 'alpine',
    name: 'High Alpine Drama',
    subtitle: 'Snowfields, pine valleys & glacial winds',
    icon: Mountain,
    accent: '#355c7d',
    tours: [
      {
        slug: 'kashmir-7-days',
        title: 'Kashmir: Valleys, Gondola & Shikaras',
        duration: '7 Days',
        stops: 'Srinagar · Gulmarg · Pahalgam · Sonmarg',
        tag: 'Iconic Snow Valley',
      },
      {
        slug: 'chandigarh-shimla-manali-8-days',
        title: 'Himachal: Shimla, Manali & Solang Valley',
        duration: '8 Days',
        stops: 'Shimla · Kufri · Kullu · Manali · Rohtang',
        tag: 'Mountain Pine Escapes',
      },
      {
        slug: 'nepal',
        title: 'Nepal: Kathmandu & Pokhara Himalayan Lakes',
        duration: '6 Days',
        stops: 'Kathmandu · Pokhara · Sarangkot · Phewa Lake',
        tag: 'Annapurna Panoramas',
      },
    ],
  },
  {
    id: 'coastal',
    name: 'Verdant Serenity',
    subtitle: 'Misty tea carpets, waterfalls & silent backwaters',
    icon: Palmtree,
    accent: '#2a6f50',
    tours: [
      {
        slug: 'kerala-6-days',
        title: 'Kerala: Munnar Tea Hills & Alleppey Houseboat',
        duration: '6 Days',
        stops: 'Cochin · Munnar · Thekkady · Alleppey',
        tag: 'God’s Own Country',
      },
      {
        slug: 'bangalore-mysore-coorg-7-days',
        title: 'South India: Mysore Palaces & Coorg Coffee Estates',
        duration: '7 Days',
        stops: 'Bangalore · Mysore · Coorg · Abbey Falls',
        tag: 'Aromas & Woodlands',
      },
      {
        slug: 'andaman-with-baratang-island-7-days',
        title: 'Andaman: Havelock Radhanagar & Coral Reefs',
        duration: '7 Days',
        stops: 'Port Blair · Havelock · Neil Island · Baratang',
        tag: 'Turquoise Archipelago',
      },
    ],
  },
  {
    id: 'royal',
    name: 'Royal Heritage',
    subtitle: 'Fortress ramparts, lake palaces & desert starlight',
    icon: Castle,
    accent: '#9a3825',
    tours: [
      {
        slug: 'rajasthan-with-udaipur-9-days',
        title: 'Royal Rajasthan: Jaipur, Jodhpur & Udaipur Palaces',
        duration: '9 Days',
        stops: 'Jaipur · Jodhpur · Udaipur · Mount Abu',
        tag: 'Grandeur & Rajputana',
      },
      {
        slug: 'golden-triangle-with-amritsar-7-days',
        title: 'Golden Triangle & Golden Temple of Amritsar',
        duration: '7 Days',
        stops: 'Delhi · Agra · Jaipur · Amritsar',
        tag: 'Taj Mahal & Heritage',
      },
      {
        slug: 'char-dham-yatra-13-days',
        title: 'Sacred Char Dham: Yamunotri, Gangotri, Kedarnath, Badrinath',
        duration: '13 Days',
        stops: 'Haridwar · Barkot · Uttarkashi · Guptkashi · Badrinath',
        tag: 'Spiritual Odyssey',
      },
    ],
  },
  {
    id: 'glamour',
    name: 'Futuristic Horizons',
    subtitle: 'Iconic architecture, dune safaris & maritime luxury',
    icon: Building2,
    accent: '#b5832c',
    tours: [
      {
        slug: 'dubai-abu-dhabi',
        title: 'Dubai & Abu Dhabi: Marina, Desert Dunes & Louvre',
        duration: '6 Days',
        stops: 'Dubai Marina · Burj Khalifa · Desert Safari · Grand Mosque',
        tag: 'Modern Wonder',
      },
      {
        slug: 'bali-indonesia-7-days',
        title: 'Bali: Ubud Rice Terraces & Uluwatu Cliff Temples',
        duration: '7 Days',
        stops: 'Kuta · Seminyak · Ubud · Kintamani · Nusa Penida',
        tag: 'Island of the Gods',
      },
      {
        slug: 'baku-azerbaijan-5-days',
        title: 'Baku: Flame Towers & Caspian Sea Promenade',
        duration: '5 Days',
        stops: 'Baku Old City · Gobustan Mud Volcanoes · Ateshgah',
        tag: 'Silk Route Elegance',
      },
    ],
  },
];

export default function WanderlustMoodMatcher() {
  const [activeMoodId, setActiveMoodId] = useState<string>(MOODS[0].id);

  const activeMood = MOODS.find((m) => m.id === activeMoodId) || MOODS[0];
  const IconComponent = activeMood.icon;

  return (
    <section className="section wrap mood-matcher-section" aria-label="Find journey by travel mood">
      <div className="section-heading mood-heading">
        <div>
          <p className="eyebrow">WHAT MOVES YOU</p>
          <h2>
            Find your holiday <br />
            <em>by mood &amp; feeling.</em>
          </h2>
        </div>
        <p className="mood-intro">
          Whether you crave crisp Himalayan wind, silent palm-fringed lagoons, or royal palace courtyards, start with the emotion you want to experience.
        </p>
      </div>

      {/* Mood Selector Cards */}
      <div className="mood-cards-row" role="tablist" aria-label="Select mood">
        {MOODS.map((mood) => {
          const isSelected = mood.id === activeMoodId;
          const MoodIcon = mood.icon;
          return (
            <button
              key={mood.id}
              role="tab"
              aria-selected={isSelected}
              className={`mood-select-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setActiveMoodId(mood.id)}
            >
              <div className="mood-icon-circle">
                <MoodIcon size={20} />
              </div>
              <strong className="mood-name">{mood.name}</strong>
              <small className="mood-sub">{mood.subtitle}</small>
            </button>
          );
        })}
      </div>

      {/* Mood Results Showcase */}
      <div className="mood-results-tray" key={activeMood.id}>
        <div className="mood-results-header">
          <div className="mood-badge-active">
            <IconComponent size={16} />
            <span>Curated departures for: <strong>{activeMood.name}</strong></span>
          </div>
          <Link href="/tours" className="text-link">
            Explore all 56 tours <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mood-tours-grid">
          {activeMood.tours.map((t) => (
            <div key={t.slug} className="mood-tour-item-card">
              <div className="mood-item-top">
                <span className="mood-tour-tag">{t.tag}</span>
                <span className="mood-tour-dur">{t.duration}</span>
              </div>
              <h4 className="mood-tour-title">
                <Link href={`/tours/${t.slug}`}>{t.title}</Link>
              </h4>
              <p className="mood-tour-stops">{t.stops}</p>
              <div className="mood-tour-footer">
                <Link href={`/tours/${t.slug}`} className="text-link">
                  View itinerary <ArrowUpRight size={15} />
                </Link>
                <WhatsAppLink
                  destination={`${t.title} (${activeMood.name} collection)`}
                  className="button outline mini-whatsapp-btn"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight size={14} />
                </WhatsAppLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
