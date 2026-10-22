export type SourceTour = {
  slug: string;
  name: string;
  region: string;
  theme: string;
  summary: string;
  stops: string[];
  duration?: number;
  days: { title: string; description: string }[];
  category?: string;
};
export type RealTourParams = Partial<
  Record<
    'q' | 'region' | 'country' | 'style' | 'duration' | 'sort' | 'party',
    string | string[]
  >
>;
export const travelStyles = [
  {
    value: 'mountains',
    name: 'Himalayan escapes',
    note: 'Hill towns, tea country & mountain views',
    photo: 'shimla-kullu-manali',
  },
  {
    value: 'pilgrimage',
    name: 'Spiritual journeys',
    note: 'Sacred places, thoughtfully connected',
    photo: 'kashi-gaya-prayag-ayodhya',
  },
  {
    value: 'culture',
    name: 'Cultural discoveries',
    note: 'Temples, traditions & stories of place',
    photo: 'royal-bhutan',
  },
  {
    value: 'coast',
    name: 'Nature & coastal holidays',
    note: 'Tea gardens, lakes & time by the sea',
    photo: 'kerala-kanyakumari',
  },
] as const;
const text = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value || '').trim().slice(0, 120);
export function realTourFilters(params: RealTourParams, tours: SourceTour[]) {
  const choice = (value: string | string[] | undefined, options: string[]) =>
    options.includes(text(value)) ? text(value) : '';
  return {
    q: text(params.q),
    region: choice(params.region, ['India', 'International']),
    country: choice(params.country, [
      ...new Set(tours.flatMap((t) => t.region.split(' / '))),
    ]),
    style: choice(params.style, [
      ...travelStyles.map((s) => s.value),
      'romance',
      'beaches',
      'adventure',
      'wildlife',
      'royal',
    ]),
    duration: choice(params.duration, [
      ...new Set(tours.map((t) => String(tourDuration(t)))),
    ]),
    sort: choice(params.sort, ['shortest', 'longest', 'name']),
    party: choice(params.party, ['group', 'family', 'honeymoon']),
  };
}
export function tourDuration(tour: SourceTour) {
  return tour.duration || tour.days.length;
}
export function matchesStyle(tour: SourceTour, style: string) {
  const theme = tour.theme.toLowerCase();
  if (style === 'mountains') return theme.includes('mountain');
  if (style === 'pilgrimage') return theme.includes('pilgrimage');
  if (style === 'culture') return /culture|heritage/.test(theme);
  if (style === 'coast') return /coast|nature/.test(theme);
  if (style === 'romance') return /romance/.test(theme);
  if (style === 'beaches') return /coast|islands/.test(theme);
  if (style === 'adventure') return /adventure/.test(theme);
  if (style === 'wildlife') return /wildlife/.test(theme);
  if (style === 'royal') return /royal/.test(theme);
  return !style;
}
export function findRealTours<T extends SourceTour>(
  tours: T[],
  filters: ReturnType<typeof realTourFilters>,
) {
  const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  const results = tours.filter((t) => {
    const content = [t.name, t.region, t.theme, t.summary, ...t.stops]
      .join(' ')
      .toLowerCase();
    return (
      words.every((word) => content.includes(word)) &&
      (!filters.region ||
        (filters.region === 'India'
          ? t.region === 'India'
          : t.region !== 'India')) &&
      (!filters.country || t.region.split(' / ').includes(filters.country)) &&
      (!filters.party ||
        (filters.party === 'family'
          ? /family/i.test(t.category || '')
          : filters.party === 'group'
            ? t.category === 'Group'
            : t.category === 'Honeymoon')) &&
      matchesStyle(t, filters.style) &&
      (!filters.duration || tourDuration(t) === Number(filters.duration))
    );
  });
  if (filters.sort === 'shortest')
    results.sort((a, b) => tourDuration(a) - tourDuration(b));
  if (filters.sort === 'longest')
    results.sort((a, b) => tourDuration(b) - tourDuration(a));
  if (filters.sort === 'name')
    results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}
