export type PackageRecord = {
  id: string;
  slug: string;
  name: string;
  model: 'fixed-departure' | 'custom-holiday';
  destination: string;
  departureCity: string;
  days: number;
  nights: number;
  itinerary: { day: number; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  accommodation: string;
  transport: string;
  suitability: string;
  policy: { version: string; cancellation: string; payment: string };
  approval: { by: string; at: string };
  departures: {
    id: string;
    date: string;
    bookingCloses: string;
    capacity: number;
    price: {
      currency: 'INR';
      adultPaise: number;
      occupancy: string;
      taxesIncluded: true;
      depositPaise: number;
      validUntil: string;
    };
  }[];
};

type ObjectValue = Record<string, unknown>;
function object(value: unknown): value is ObjectValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function text(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= 10000
  );
}
function integer(value: unknown, min: number, max: number): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= min &&
    value <= max
  );
}
function date(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/** Validates commercial facts, not supplier availability or authority to approve. */
export function packageIssues(input: unknown, today: string): string[] {
  if (!date(today))
    throw new Error(
      'Validation needs an explicit valid business calendar date.',
    );
  if (!object(input)) return ['Package must be an object.'];
  const issues: string[] = [];
  const requireText = (value: unknown, path: string) => {
    if (!text(value))
      issues.push(
        `${path}: approved text is required (maximum 10000 characters).`,
      );
  };
  for (const key of [
    'id',
    'name',
    'destination',
    'departureCity',
    'accommodation',
    'transport',
    'suitability',
  ])
    requireText(input[key], key);
  if (
    !text(input.slug) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) ||
    input.slug.length > 100
  )
    issues.push(
      'slug: use a unique lowercase URL slug (maximum 100 characters).',
    );
  if (!['fixed-departure', 'custom-holiday'].includes(String(input.model)))
    issues.push('model: choose fixed-departure or custom-holiday.');
  const validDays = integer(input.days, 1, 365);
  if (!validDays) issues.push('days: enter an integer from 1 to 365.');
  if (
    !integer(input.nights, 0, 364) ||
    (validDays && input.nights >= (input.days as number))
  )
    issues.push('nights: must be nonnegative and less than days.');
  for (const key of ['inclusions', 'exclusions']) {
    if (
      !Array.isArray(input[key]) ||
      !input[key].length ||
      !input[key].every(text)
    )
      issues.push(
        `${key}: provide an explicit nonempty list; use an approved statement if none apply.`,
      );
  }
  if (
    !Array.isArray(input.itinerary) ||
    !validDays ||
    input.itinerary.length !== input.days
  )
    issues.push('itinerary: provide exactly one record for each trip day.');
  if (Array.isArray(input.itinerary))
    input.itinerary.forEach((day, index) => {
      if (
        !object(day) ||
        day.day !== index + 1 ||
        !text(day.title) ||
        !text(day.description)
      )
        issues.push(
          `itinerary[${index}]: day numbers must be sequential, with title and description.`,
        );
    });
  if (!object(input.policy))
    issues.push(
      'policy: payment and cancellation terms with a version are required.',
    );
  else
    for (const key of ['version', 'cancellation', 'payment'])
      requireText(input.policy[key], `policy.${key}`);
  if (
    !object(input.approval) ||
    !text(input.approval.by) ||
    !date(input.approval.at) ||
    input.approval.at > today
  )
    issues.push(
      'approval: record the responsible approver and a non-future approval date.',
    );
  if (!Array.isArray(input.departures))
    issues.push('departures: provide an array.');
  else {
    if (input.model === 'custom-holiday' && input.departures.length)
      issues.push(
        'departures: custom holidays must remain quote-only; do not publish fixed prices/dates here.',
      );
    if (input.model === 'fixed-departure' && !input.departures.length)
      issues.push(
        'departures: fixed tours require at least one dated departure.',
      );
    const ids = new Set<string>();
    input.departures.forEach((departure, index) => {
      const path = `departures[${index}]`;
      if (!object(departure)) {
        issues.push(`${path}: must be an object.`);
        return;
      }
      if (!text(departure.id) || ids.has(departure.id))
        issues.push(`${path}.id: must be present and unique.`);
      else ids.add(departure.id);
      if (!date(departure.date) || departure.date < today)
        issues.push(`${path}.date: enter a real current or future date.`);
      if (
        !date(departure.bookingCloses) ||
        (date(departure.date) && departure.bookingCloses > departure.date)
      )
        issues.push(
          `${path}.bookingCloses: must be a real date on or before departure.`,
        );
      if (!integer(departure.capacity, 1, 10000))
        issues.push(
          `${path}.capacity: specify a positive seat allocation (maximum 10000).`,
        );
      if (!object(departure.price)) {
        issues.push(`${path}.price: approved departure pricing is required.`);
        return;
      }
      const price = departure.price;
      if (price.currency !== 'INR')
        issues.push(`${path}.price.currency: only INR is currently supported.`);
      if (!integer(price.adultPaise, 1, 1000000000))
        issues.push(
          `${path}.price.adultPaise: use integer paise for the adult price (maximum ₹10000000).`,
        );
      if (
        !integer(price.depositPaise, 1, 1000000000) ||
        (typeof price.adultPaise === 'number' &&
          typeof price.depositPaise === 'number' &&
          price.depositPaise > price.adultPaise)
      )
        issues.push(
          `${path}.price.depositPaise: positive deposit must not exceed the adult total.`,
        );
      requireText(price.occupancy, `${path}.price.occupancy`);
      if (price.taxesIncluded !== true)
        issues.push(
          `${path}.price.taxesIncluded: publish a tax-inclusive adult total; unsupported tax calculations cannot be hidden.`,
        );
      if (
        !date(price.validUntil) ||
        price.validUntil < today ||
        (date(departure.date) && price.validUntil > departure.date)
      )
        issues.push(
          `${path}.price.validUntil: must be current and no later than departure.`,
        );
    });
  }
  return issues;
}

export function validateCatalogue(
  input: unknown,
  today: string,
): { packages: PackageRecord[]; issues: string[] } {
  if (!Array.isArray(input))
    return { packages: [], issues: ['Catalogue must be an array.'] };
  const issues: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  input.forEach((item, index) => {
    issues.push(
      ...packageIssues(item, today).map(
        (issue) => `packages[${index}].${issue}`,
      ),
    );
    if (!object(item)) return;
    for (const [key, values] of [
      ['id', ids],
      ['slug', slugs],
    ] as const) {
      const value = item[key];
      if (typeof value !== 'string') continue;
      if (values.has(value))
        issues.push(`packages[${index}].${key}: duplicate value.`);
      values.add(value);
    }
  });
  // A single invalid record rejects the import; never silently publish a partial catalogue.
  return { packages: issues.length ? [] : (input as PackageRecord[]), issues };
}
