type QueryValue = string | string[] | undefined;
export type TourSearchParams = Partial<
  Record<
    'q' | 'model' | 'sort' | 'month' | 'duration' | 'budget' | 'theme',
    QueryValue
  >
>;
type SearchableTour = {
  name: string;
  destination: string;
  country: string;
  theme: string;
  summary: string;
  model: string;
  days: number;
  adultPaise: number | null;
  departures: string[];
};
const value = (raw: QueryValue) =>
  (Array.isArray(raw) ? raw[0] : raw || '').trim().slice(0, 100);
const choice = (raw: QueryValue, allowed: string[]) =>
  allowed.includes(value(raw)) ? value(raw) : '';
export function tourFilters(params: TourSearchParams, themes: string[]) {
  const month = value(params.month);
  return {
    q: value(params.q),
    model: choice(params.model, ['fixed-departure', 'custom-holiday']),
    sort: choice(params.sort, ['price', 'departure']) || 'collection',
    month: /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : '',
    duration: choice(params.duration, ['short', 'long']),
    budget: choice(params.budget, ['50000', '75000', '100000']),
    theme: choice(params.theme, themes),
  };
}
export function searchTours<T extends SearchableTour>(
  items: T[],
  filters: ReturnType<typeof tourFilters>,
) {
  const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  const matchingDates = (tour: T) =>
    tour.departures
      .filter((date) => !filters.month || date.startsWith(`${filters.month}-`))
      .sort();
  const result = items.filter((tour) => {
    const text =
      `${tour.name} ${tour.destination} ${tour.country} ${tour.theme} ${tour.summary}`.toLowerCase();
    return (
      words.every((word) => text.includes(word)) &&
      (!filters.model || tour.model === filters.model) &&
      (!filters.theme || tour.theme === filters.theme) &&
      (!filters.month ||
        (tour.model === 'fixed-departure' && matchingDates(tour).length > 0)) &&
      (!filters.duration ||
        (filters.duration === 'short' ? tour.days <= 4 : tour.days >= 5)) &&
      (!filters.budget ||
        (tour.adultPaise !== null &&
          tour.adultPaise <= Number(filters.budget) * 100))
    );
  });
  if (filters.sort === 'price')
    result.sort(
      (a, b) => (a.adultPaise ?? Infinity) - (b.adultPaise ?? Infinity),
    );
  if (filters.sort === 'departure')
    result.sort((a, b) =>
      (matchingDates(a)[0] || '9999').localeCompare(
        matchingDates(b)[0] || '9999',
      ),
    );
  return result;
}
