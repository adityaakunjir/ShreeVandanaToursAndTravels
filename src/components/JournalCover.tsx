import type { Tour } from '@/data/catalogue';
export default function JournalCover({
  tour,
  hero = false,
}: {
  tour: Tour;
  hero?: boolean;
}) {
  return (
    <div className={`journal-cover ${hero ? 'journal-cover-hero' : ''}`}>
      <span className="journal-stamp">SHREE VANDANA / EXPLORE</span>
      <svg viewBox="0 0 320 170" fill="none" aria-hidden="true">
        <path
          d="M-10 130C60 20 135 195 190 80S300 55 340 10"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle cx="190" cy="80" r="9" stroke="currentColor" />
        <circle cx="190" cy="80" r="3" fill="currentColor" />
        <path
          d="m110 51 28 12-13 4-3 13-12-29Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <div>
        <span>
          {tour.scope} / {tour.duration} DAYS
        </span>
        <strong>{tour.name}</strong>
        <small>
          {tour.country} · {tour.theme}
        </small>
      </div>
    </div>
  );
}
