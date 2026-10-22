import tours, { countries } from './catalogue';
export const destinationSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const places = [
  'Bali',
  'Ladakh',
  'Spiti',
  'Rajasthan',
  'Andaman',
  'Lakshadweep',
  'Goa',
  'Gujarat',
  'Odisha',
  'Tamil Nadu',
  'Char Dham',
  'Coastal Karnataka',
];
export const destinationHubs = [
  ...countries.map((name) => ({
    name,
    slug: destinationSlug(name),
    kind: 'country',
    tours: tours.filter((t) => t.country.split(' / ').includes(name)),
  })),
  ...places.map((name) => ({
    name,
    slug: destinationSlug(name),
    kind: 'region',
    tours: tours.filter((t) =>
      (t.name + ' ' + t.aliases.join(' '))
        .toLowerCase()
        .includes(name.toLowerCase()),
    ),
  })),
].filter((h) => h.tours.length > 0);
