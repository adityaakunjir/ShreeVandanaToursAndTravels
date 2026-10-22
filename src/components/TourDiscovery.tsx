import tours, { countries } from '@/data/catalogue';
import { realTourFilters, travelStyles } from '@/lib/real-tours';
import { ArrowUpRight } from 'lucide-react';
export default function TourDiscovery({
  filters = realTourFilters({}, tours),
  compact = false,
}: {
  filters?: ReturnType<typeof realTourFilters>;
  compact?: boolean;
}) {
  return (
    <form
      action="/tours"
      method="get"
      className={`tour-discovery ${compact ? 'is-compact' : ''}`}
      role="search"
      aria-label="Find a tour"
    >
      <div className="discovery-query">
        <label htmlFor="tour-q">Your next destination</label>
        <input
          id="tour-q"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Dubai, Kashmir, Kerala…"
          maxLength={120}
        />
      </div>
      <div>
        <label htmlFor="tour-region">India or the world?</label>
        <select id="tour-region" name="region" defaultValue={filters.region}>
          <option value="">Anywhere</option>
          <option>India</option>
          <option>International</option>
        </select>
      </div>
      <div>
        <label htmlFor="tour-style">Your kind of journey</label>
        <select id="tour-style" name="style" defaultValue={filters.style}>
          <option value="">All travel styles</option>
          {travelStyles.map((s) => (
            <option key={s.value} value={s.value}>
              {s.name}
            </option>
          ))}
          <option value="romance">Honeymoon & romance</option>
          <option value="beaches">Islands & beaches</option>
          <option value="adventure">Adventure</option>
          <option value="wildlife">Nature & wildlife</option>
          <option value="royal">Royal India</option>
        </select>
      </div>
      {!compact && (
        <div>
          <label htmlFor="tour-country">Country</label>
          <select
            id="tour-country"
            name="country"
            defaultValue={filters.country}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="tour-duration">Time away</label>
        <select
          id="tour-duration"
          name="duration"
          defaultValue={filters.duration}
        >
          <option value="">Any duration</option>
          {[...new Set(tours.map((t) => t.duration))]
            .sort((a, b) => a - b)
            .map((d) => (
              <option key={d} value={d}>
                {d} days
              </option>
            ))}
        </select>
      </div>
      {!compact && (
        <>
          <div>
            <label htmlFor="tour-party">Travelling together</label>
            <select id="tour-party" name="party" defaultValue={filters.party}>
              <option value="">Any group</option>
              <option value="group">Source group tours</option>
              <option value="honeymoon">Honeymoon outlines</option>
            </select>
          </div>
          <div>
            <label htmlFor="tour-sort">Arrange the journal</label>
            <select id="tour-sort" name="sort" defaultValue={filters.sort}>
              <option value="">Curated order</option>
              <option value="shortest">Shortest first</option>
              <option value="longest">Longest first</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </>
      )}
      <button className="button" type="submit">
        Find my journey <ArrowUpRight size={18} />
      </button>
    </form>
  );
}
