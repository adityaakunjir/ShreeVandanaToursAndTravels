export type DemoPackage = {
  demo: true;
  slug: string;
  name: string;
  destination: string;
  country: string;
  image: string;
  model: 'fixed-departure' | 'custom-holiday';
  days: number;
  nights: number;
  summary: string;
  theme: string;
  adultPaise: number | null;
  depositPaise: number | null;
  departures: string[];
  itinerary: { title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
};

// Synthetic product-design fixtures. Never treat these as approved commercial inventory.
const samples: DemoPackage[] = [
  {
    demo: true,
    slug: 'dubai-city-and-desert',
    name: 'Dubai, beyond the skyline',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    image: 'popular-2.jpg',
    model: 'fixed-departure',
    days: 4,
    nights: 3,
    theme: 'City & adventure',
    adultPaise: 3990000,
    depositPaise: 1000000,
    departures: ['2027-01-15', '2027-02-12'],
    summary:
      'An unhurried city escape, with a little desert adventure and time to make it your own.',
    itinerary: [
      {
        title: 'Arrive and settle in',
        description:
          'Sample airport transfer and hotel check-in. An easy evening to explore at your own pace.',
      },
      {
        title: 'A city of contrasts',
        description:
          'Sample guided city discovery, from the old neighbourhoods to the modern skyline.',
      },
      {
        title: 'Into the desert',
        description:
          'A sample desert excursion and dinner, with free time earlier in the day.',
      },
      {
        title: 'One last look',
        description:
          'Sample hotel checkout and airport transfer for the journey home.',
      },
    ],
    inclusions: [
      'Sample 3-night hotel stay, twin sharing',
      'Sample breakfast and airport transfers',
      'Sample city tour and desert excursion',
      'Sample adult total includes taxes',
    ],
    exclusions: [
      'Flights and visas',
      'Travel insurance',
      'Meals and activities not listed',
      'Personal expenses and single-room supplement',
    ],
  },
  {
    demo: true,
    slug: 'venice-at-your-pace',
    name: 'Venice, at your own pace',
    destination: 'Venice',
    country: 'Italy',
    image: 'popular-1.jpg',
    model: 'custom-holiday',
    days: 5,
    nights: 4,
    theme: 'Slow & scenic',
    adultPaise: null,
    depositPaise: null,
    departures: [],
    summary:
      'Canals, neighbourhood cafés and a slower rhythm. A journey shaped around your interests.',
    itinerary: [
      {
        title: 'Welcome to Venice',
        description:
          'Sample arrival and relaxed orientation after checking in.',
      },
      {
        title: 'The heart of the city',
        description:
          'Sample walking route through historic streets and waterside squares.',
      },
      {
        title: 'An island interlude',
        description:
          'Sample island day, adjusted to your interests and preferred pace.',
      },
      {
        title: 'A day that is yours',
        description:
          'Sample free day for galleries, cafés or optional guided experiences.',
      },
      {
        title: 'Until next time',
        description: 'Sample checkout and onward travel arrangements.',
      },
    ],
    inclusions: [
      'Hotel and transfer options discussed in your quote',
      'A personalised day-by-day plan',
      'Activities agreed before confirmation',
    ],
    exclusions: [
      'No price or availability is confirmed by this sample',
      'Flights, insurance and visa arrangements are subject to your final quote',
    ],
  },
  {
    demo: true,
    slug: 'kyoto-culture-and-gardens',
    name: 'Kyoto, a quieter discovery',
    destination: 'Kyoto',
    country: 'Japan',
    image: 'popular-3.jpg',
    model: 'fixed-departure',
    days: 5,
    nights: 4,
    theme: 'Culture & discovery',
    adultPaise: 6990000,
    depositPaise: 1500000,
    departures: ['2027-03-12', '2027-04-09'],
    summary:
      'A thoughtful introduction to temples, gardens and the small details that make a place memorable.',
    itinerary: [
      {
        title: 'Arrive in Kyoto',
        description:
          'Sample arrival transfer, hotel check-in and relaxed evening.',
      },
      {
        title: 'Temples and traditions',
        description: 'Sample cultural discovery with a local guide.',
      },
      {
        title: 'Gardens and quiet corners',
        description: 'Sample garden visits and a slower afternoon.',
      },
      {
        title: 'Choose your own chapter',
        description:
          'Sample free time and optional activities arranged around your interests.',
      },
      {
        title: 'The journey home',
        description: 'Sample checkout and departure transfer.',
      },
    ],
    inclusions: [
      'Sample 4-night hotel stay, twin sharing',
      'Sample breakfast and transfers',
      'Sample guided cultural visits',
      'Sample adult total includes taxes',
    ],
    exclusions: [
      'International flights and visas',
      'Travel insurance',
      'Unlisted meals and optional activities',
      'Personal expenses and single-room supplement',
    ],
  },
];

export function demoEnabled() {
  return (
    process.env.TRAVEL_DEMO_MODE === 'true' ||
    (process.env.NODE_ENV === 'development' &&
      process.env.TRAVEL_DEMO_MODE !== 'false')
  );
}
export function getDemoPackages(): DemoPackage[] {
  return demoEnabled() ? samples : [];
}
export function rupees(paise: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
