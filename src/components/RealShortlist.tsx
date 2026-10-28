'use client';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { readShortlist, toggleShortlist } from '@/lib/shortlist';
const key = 'vandana-real-tours-v1';
const event = 'vandana-real-tours-change';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(event, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(event, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(key) || '[]';
  } catch {
    return '[]';
  }
}
const serverSnapshot = () => '[]';
function useSaved() {
  return readShortlist(
    useSyncExternalStore(subscribe, snapshot, serverSnapshot),
  );
}
function write(ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event(event));
}
export function SaveRealTour({ slug, name }: { slug: string; name: string }) {
  const ids = useSaved();
  const saved = ids.includes(slug);
  const [status, setStatus] = useState('');
  return (
    <div className="real-save">
      <button
        type="button"
        className="text-link"
        aria-pressed={saved}
        aria-label={
          saved ? `Saved ${name}; remove from saved journeys` : `Save ${name}`
        }
        onClick={() => {
          try {
            write(toggleShortlist(ids, slug));
            setStatus(
              saved ? 'Removed from your device.' : 'Saved on your device.',
            );
          } catch {
            setStatus('Storage unavailable. Copy the tour link to keep it.');
          }
        }}
      >
        <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>
      <span className="save-status" role="status">
        {status}
      </span>
    </div>
  );
}
type Summary = {
  slug: string;
  name: string;
  region: string;
  theme: string;
  duration: number;
  summary: string;
};
export function SavedRealTours({ catalogue }: { catalogue: Summary[] }) {
  const ids = useSaved();
  const saved = ids
    .map((id) => catalogue.find((t) => t.slug === id))
    .filter((t): t is Summary => !!t);
  return (
    <>
      <p className="shortlist-explainer">
        Saved in this browser only. Clearing browser data removes your saved
        tours.
      </p>
      <noscript>
        <p>
          Enable JavaScript to view saved tours, or explore and compare the
          collection without it.
        </p>
      </noscript>
      {saved.length >= 2 && (
        <Link
          className="button"
          href={`/tours/compare?${new URLSearchParams(saved.slice(0, 3).map((t) => ['tour', t.slug]))}`}
        >
          Compare {Math.min(saved.length, 3)} saved tours
        </Link>
      )}
      {saved.length ? (
        <div className="saved-real-grid">
          {saved.map((t) => (
            <article className="package-panel" key={t.slug}>
              <p className="eyebrow">
                {t.region} · {t.duration} days
              </p>
              <h2>
                <Link href={`/tours/${t.slug}`}>{t.name}</Link>
              </h2>
              <p>{t.summary}</p>
              <div className="collection-links">
                <Link href={`/tours/${t.slug}`}>Explore itinerary</Link>
                <SaveRealTour slug={t.slug} name={t.name} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="discovery-empty">
          <h2>Keep a little inspiration.</h2>
          <p>Tap Save on any tour to find it here when you’re ready.</p>
          <Link className="button" href="/tours">
            Explore our journeys
          </Link>
        </div>
      )}
    </>
  );
}
