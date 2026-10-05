type Destination = {
  name: string;
  country: string;
  tag: string;
  description: string;
};

export function searchValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value || '').trim().slice(0, 100);
}

export function filterDestinations<T extends Destination>(
  items: T[],
  query: string,
  style: string,
): T[] {
  const words = query.toLocaleLowerCase('en').split(/\s+/).filter(Boolean);
  return items.filter((item) => {
    const text =
      `${item.name} ${item.country} ${item.tag} ${item.description}`.toLocaleLowerCase(
        'en',
      );
    return (
      (!style || item.tag === style) &&
      words.every((word) => text.includes(word))
    );
  });
}
