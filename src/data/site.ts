import client from '../../client_details/client_info.json';
import { googleBusiness } from './google-business';

export const business = {
  ...client,
  contact: {
    ...client.contact,
    email: 'shreevandanatravels@gmail.com',
    address:
      'Sr No. 2/7/2, Shop no. 1, Lodha Complex, Shanti Dham Road, Dhankawadi, Pune 411043, Maharashtra, India',
  },
  phones: [
    { display: '+91 96652 38966', number: '919665238966' },
    { display: '+91 94220 02115', number: '919422002115' },
  ],
  whatsapp: 'https://wa.me/919665238966',
  map: googleBusiness.url,
};

export const destinations = [
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    image: 'tours/dubai-abu-dhabi.webp',
    tourSlug: 'dubai-abu-dhabi',
    tag: 'City & adventure',
    description:
      'Bold skylines, desert experiences and time to explore Dubai and Abu Dhabi.',
  },
  {
    name: 'Nepal',
    slug: 'nepal',
    country: 'Nepal',
    image: 'tours/nepal.webp',
    tourSlug: 'nepal',
    tag: 'Mountains & discovery',
    description:
      'Himalayan scenery, lakeside Pokhara and the culture of Kathmandu.',
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    country: 'India',
    image: 'tours/kerala-kanyakumari.webp',
    tourSlug: 'kerala-kanyakumari',
    tag: 'Nature & relaxation',
    description:
      'Munnar tea gardens, peaceful backwaters and tropical coastal escapes.',
  },
  {
    name: 'Kashmir',
    slug: 'kashmir',
    country: 'India',
    image: 'tours/kashmir-amritsar-vaishno-devi.webp',
    tourSlug: 'kashmir-amritsar-vaishno-devi',
    tag: 'Mountains & discovery',
    description:
      'Lakeside Srinagar, mountain valleys and beautiful scenery in the Kashmir region.',
  },
  {
    name: 'Sikkim–Darjeeling',
    slug: 'sikkim-darjeeling',
    country: 'India',
    image: 'tours/darjeeling-gangtok-pelling.webp',
    tourSlug: 'darjeeling-gangtok-pelling',
    tag: 'Mountains & discovery',
    description:
      'Darjeeling tea gardens, Gangtok and Pelling on a scenic Himalayan holiday.',
  },
];

export const additionalDestinations = [
  'Thailand',
  'Bali',
  'Singapore',
  'Malaysia',
  'Egypt',
  'Azerbaijan',
  'Ayodhya',
  'Varanasi',
  'Nainital',
  'Jim Corbett',
];
export const faqs = [
  {
    question: 'Can you customise a holiday for my family?',
    answer:
      'Yes. Tell us your destination, travel dates, group size and preferences. Our team will help shape an itinerary around the way you want to travel.',
  },
  {
    question: 'How do I get a price for my trip?',
    answer:
      'Message our team directly on WhatsApp. We will discuss your requirements and share a personalised quote. Prices and availability are confirmed by our team before booking.',
  },
  {
    question: 'Do you arrange domestic and international travel?',
    answer:
      'We help plan holidays within India and abroad, including family vacations, group tours and customised journeys. Contact us to discuss your preferred destination.',
  },
  {
    question: 'Does starting a WhatsApp chat confirm a booking?',
    answer:
      'An enquiry starts a conversation. It does not reserve a trip or take payment. Your itinerary, inclusions, payment details and cancellation conditions will be shared before you confirm a booking.',
  },
  {
    question: 'Can you help with flights, trains, buses and hotels?',
    answer:
      'Yes. Our team assists with flight, train and bus ticket bookings and hotel reservations. Share your route, dates and preferences on WhatsApp so we can discuss options, fares and availability.',
  },
  {
    question: 'Do you provide visa assistance?',
    answer:
      'We can help you understand application documents and destination requirements. Visa decisions remain with the issuing authority; assistance does not guarantee approval.',
  },
  {
    question: 'Are all itinerary activities included in the quote?',
    answer:
      'Read the inclusions, exclusions and notes on your selected tour. Some experiences are optional or depend on weather, permits or operating conditions. Ask the team to confirm exactly what is included in your final quote.',
  },
  {
    question: 'Where are the travel dates and prices?',
    answer:
      'The site publishes tour outlines rather than live bookable departures. Dates, accommodation, fares, taxes and availability are confirmed with our team. A date mentioned in an outline needs reconfirmation.',
  },
  {
    question: 'Why is a daily itinerary missing for Kashmir?',
    answer:
      'The supplied Kashmir outline states ten days and lists the places visited, but does not contain a complete daily plan. Our team will share the detailed itinerary when you enquire.',
  },
  {
    question: 'How do payments, changes and cancellations work?',
    answer:
      'Ask for the payment schedule, cancellation conditions and change charges for your chosen arrangements before confirming. Terms depend on your final quote and suppliers; the website does not publish a universal refund policy or accept payment.',
  },
  {
    question: 'Can I plan a family, group or special-occasion holiday?',
    answer:
      'Yes. Tell us who is travelling, your preferred pace, dates and the occasion. We can discuss a customised holiday and the arrangements that suit your group.',
  },
  {
    question: 'When can I visit your Pune office?',
    answer:
      'Our recorded office hours are Monday–Saturday, 9 am–7 pm, with Sunday closed. Find us in Lodha Complex, Shanti Dham Road, Dhankawadi. Please call before visiting on a holiday.',
  },
];
