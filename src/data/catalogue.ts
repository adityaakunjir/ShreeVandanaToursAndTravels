import legacy from './tours.json' with { type: 'json' };
import imported from './imported-tours.json' with { type: 'json' };
import photos from './tour-photos.json' with { type: 'json' };
export type Tour = {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  country: string;
  scope: string;
  region: string;
  theme: string;
  category: string;
  duration: number;
  nights: number | null;
  summary: string;
  stops: string[];
  days: { title: string; description: string }[];
  includes: string[];
  excludes: string[];
  optional: string[];
  notes: string[];
  highlights: string[];
  relatedSlugs: string[];
  source: {
    file: string;
    paragraphRange?: number[];
    paragraphBasis?: string;
    sha256?: string;
    order?: number;
  };
  evidenceStatus: string;
  approval: string;
  publication: string;
  reconciliation: string | null;
};
const newer = imported as Tour[];
const preserved: Tour[] = legacy.map((t) => ({
  ...t,
  id: `legacy-${t.slug}`,
  aliases: [],
  country: t.region,
  scope: t.region === 'India' ? 'India' : 'International',
  category: 'Holiday',
  duration: t.duration || t.days.length,
  nights: null,
  optional: [],
  highlights: t.highlights || [],
  relatedSlugs: newer
    .filter((x) => x.relatedSlugs.includes(t.slug))
    .map((x) => x.slug),
  source: { file: 'client_details/TOURS.doc' },
  evidenceStatus: 'owner-supplied-document',
  approval: 'outline-only; commercial terms pending',
  publication: 'published-outline',
  reconciliation: null,
}));
const tours: Tour[] = [...(imported as Tour[]), ...preserved];
export const catalogueStats = {
  outlines: tours.length,
  newer: imported.length,
  legacy: preserved.length,
  relatedNewerVariants: imported.filter((t) => t.relatedSlugs.length).length,
  pendingCommercialApproval: tours.length,
};
export function tourPhoto(tour: Tour) {
  return (
    photos.find((p) => p.slug === tour.slug) ||
    photos.find((p) => tour.relatedSlugs.includes(p.slug))
  );
}
export function tourEnquiryContext(
  tour: Pick<Tour, 'name' | 'duration' | 'source'>,
) {
  return `${tour.name}, ${tour.duration} days (${tour.source.order ? 'newer itinerary' : 'earlier outline'})`;
}
export const countries = [
  ...new Set(tours.flatMap((t) => t.country.split(' / '))),
].sort();
export default tours;
