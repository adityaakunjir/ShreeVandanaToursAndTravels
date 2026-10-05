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
    name: 'Venice',
    slug: 'venice',
    country: 'Italy',
    image: 'popular-1.jpg',
    tag: 'Slow & scenic',
    description:
      'Winding canals, timeless architecture and a little dolce vita.',
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    image: 'popular-2.jpg',
    tag: 'City & adventure',
    description:
      'A city of bold skylines, desert adventures and extraordinary experiences.',
  },
  {
    name: 'Kyoto',
    slug: 'kyoto',
    country: 'Japan',
    image: 'popular-3.jpg',
    tag: 'Culture & discovery',
    description:
      'Timeless temples, quiet gardens and traditions worth travelling for.',
  },
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
];
