export const SHORTLIST_KEY = 'vandana-shortlist-v1';

export function readShortlist(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(value)) return [];
    return [
      ...new Set(
        value.filter(
          (item): item is string =>
            typeof item === 'string' &&
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item) &&
            item.length <= 100,
        ),
      ),
    ].slice(0, 30);
  } catch {
    return [];
  }
}
export function toggleShortlist(ids: string[], slug: string): string[] {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100)
    throw new Error('Invalid tour identifier.');
  return ids.includes(slug)
    ? ids.filter((id) => id !== slug)
    : [...ids, slug].slice(-30);
}
export function comparisonSelection<T extends { slug: string }>(
  catalogue: T[],
  requested: string | string[] | undefined,
) {
  const slugs = [
    ...new Set(typeof requested === 'string' ? [requested] : requested || []),
  ];
  if (slugs.length > 3)
    return {
      selected: [] as T[],
      error: 'Choose at most three tours to compare.',
    };
  const selected = slugs
    .map((slug) => catalogue.find((item) => item.slug === slug))
    .filter((item): item is T => !!item);
  if (selected.length !== slugs.length)
    return {
      selected: [] as T[],
      error:
        'A selected tour is unavailable. Choose from the current collection.',
    };
  if (slugs.length === 1)
    return {
      selected: [] as T[],
      error: 'Choose at least two tours to compare.',
    };
  return { selected, error: '' };
}
