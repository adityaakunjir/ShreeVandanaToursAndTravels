import tours from './catalogue';
const definitions = [
  [
    'himalayan-escapes',
    'Himalayan Escapes',
    'Mountains, monasteries and a different pace.',
    'mountain',
  ],
  [
    'sacred-journeys',
    'Sacred Journeys',
    'Pilgrimage routes from the company itinerary collection.',
    'pilgrimage',
  ],
  [
    'royal-india',
    'Royal India',
    'Rajasthan’s heritage, in two distinct route options.',
    'royal',
  ],
  [
    'nature-wildlife',
    'Nature & Wildlife',
    'Forests, valleys and source-listed wildlife experiences.',
    'wildlife',
  ],
  [
    'islands-beaches',
    'Islands & Beaches',
    'Coastal days, island escapes and time beside the water.',
    'coast',
  ],
  [
    'honeymoon-romance',
    'Honeymoon & Romance',
    'Romance-led outlines to discuss and personalise.',
    'romance',
  ],
  [
    'family-group',
    'Family & Group Holidays',
    'Explore source group outlines; discuss family preferences with our team.',
    'group',
  ],
  [
    'international-discoveries',
    'International Discoveries',
    'A new perspective, beyond familiar borders.',
    'international',
  ],
  [
    'short-breaks',
    'Short Breaks',
    'Five- and six-day outlines for a shorter escape.',
    'short',
  ],
  [
    'grand-journeys',
    'Grand Journeys',
    'Ten days or more, with time to travel further.',
    'long',
  ],
];
export const collections = definitions
  .map(([slug, name, description, kind]) => ({
    slug,
    name,
    description,
    tours: tours.filter((t) =>
      kind === 'international'
        ? t.scope === 'International'
        : kind === 'short'
          ? t.duration <= 6
          : kind === 'long'
            ? t.duration >= 10
            : kind === 'group'
              ? t.category === 'Group'
              : t.theme.toLowerCase().includes(kind),
    ),
  }))
  .filter((c) => c.tours.length);
