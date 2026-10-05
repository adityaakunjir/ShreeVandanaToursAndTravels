'use client';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { DemoPackage } from '@/data/demo-packages';
import { SHORTLIST_KEY, readShortlist, toggleShortlist } from '@/lib/shortlist';

const eventName = 'vandana-shortlist-change';
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(eventName, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(SHORTLIST_KEY) || '[]';
  } catch {
    return '[]';
  }
}
function serverSnapshot() {
  return '[]';
}
function useShortlist() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return readShortlist(raw);
}
function write(ids: string[]) {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(eventName));
}
export function SaveTour({ slug, name }: { slug: string; name: string }) {
  const ids = useShortlist();
  const saved = ids.includes(slug);
  const [status, setStatus] = useState('');
  return (
    <div className="save-tour">
      <button
        type="button"
        aria-pressed={saved}
        aria-label={`${saved ? 'Remove' : 'Save'} ${name} ${saved ? 'from' : 'to'} shortlist`}
        onClick={() => {
          try {
            write(toggleShortlist(ids, slug));
            setStatus(
              saved ? 'Removed from this device.' : 'Saved on this device.',
            );
          } catch {
            setStatus(
              'Device storage is unavailable. You can still compare tours.',
            );
          }
        }}
      >
        <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        <span>{saved ? 'Saved' : 'Save tour'}</span>
      </button>
      <span role="status" className="save-status">
        {status}
      </span>
    </div>
  );
}
export function SavedTours({ catalogue }: { catalogue: DemoPackage[] }) {
  const ids = useShortlist();
  const tours = ids
    .map((id) => catalogue.find((item) => item.slug === id))
    .filter((tour): tour is DemoPackage => !!tour);
  const [status, setStatus] = useState('');
  return (
    <div>
      <p className="shortlist-explainer">
        Saved only in this browser on this device. No account is needed.
        Clearing browser data removes your shortlist.
      </p>
      <noscript>
        <p>
          Enable JavaScript to view your device shortlist. Tour discovery and
          comparison are available without it.
        </p>
      </noscript>
      {!!tours.length && (
        <div className="collection-tools">
          <span>
            {tours.length} saved {tours.length === 1 ? 'tour' : 'tours'}
          </span>
          {tours.length >= 2 && (
            <Link
              className="button"
              href={`/packages/compare?${new URLSearchParams(tours.slice(0, 3).map((tour) => ['tour', tour.slug]))}`}
            >
              Compare {Math.min(tours.length, 3)} saved tours →
            </Link>
          )}
          <button
            className="text-link"
            onClick={() => {
              try {
                write([]);
                setStatus('Your device shortlist has been cleared.');
              } catch {
                setStatus('Device storage is unavailable.');
              }
            }}
          >
            Clear shortlist
          </button>
        </div>
      )}
      <p role="status">{status}</p>
      {!tours.length ? (
        <div className="discovery-empty">
          <h2>A little room for wanderlust.</h2>
          <p>
            Save a tour from the collection and come back to it here. Saved
            tours don’t reserve seats or lock prices.
          </p>
          <Link className="button" href="/packages">
            Explore the collection →
          </Link>
        </div>
      ) : (
        <div className="saved-grid">
          {tours.map((tour) => (
            <article className="saved-card" key={tour.slug}>
              <div className="saved-photo">
                <Image
                  src={`/assets/images/${tour.image}`}
                  fill
                  sizes="(max-width:640px) calc(100vw - 40px), 380px"
                  alt={`${tour.destination} inspiration`}
                />
              </div>
              <div>
                <p className="eyebrow">Sample tour · {tour.days} days</p>
                <h2>
                  <Link href={`/packages/${tour.slug}`}>{tour.name}</Link>
                </h2>
                <p>{tour.summary}</p>
                <Link className="text-link" href={`/packages/${tour.slug}`}>
                  View tour details →
                </Link>
                <SaveTour slug={tour.slug} name={tour.name} />
              </div>
            </article>
          ))}
        </div>
      )}
      {ids.length > tours.length && (
        <p className="shortlist-explainer">
          Some saved tours are no longer in this collection. Only currently
          available previews are shown.
        </p>
      )}
    </div>
  );
}
