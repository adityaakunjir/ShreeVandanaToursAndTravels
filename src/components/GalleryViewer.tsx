'use client';

import Image from '@/components/TravelImage';
import { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import sourcePhotos from '@/data/tour-photos.json';

const photos = sourcePhotos.map(photo => ({
  ...photo, label: photo.alt, caption: photo.author + ' / ' + photo.license,
}));
const filters = ['All destinations', 'India', 'International'] as const;
export default function GalleryViewer({ india }: { india: string[] }) {
  const [filter, setFilter] = useState<typeof filters[number]>('All destinations');
  const [active, setActive] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const displayList = photos.filter(photo => filter === 'All destinations' || india.includes(photo.slug) === (filter === 'India'));

  useEffect(() => {
    if (active === null) return;
    if (!dialog.current?.open) dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [active]);

  function close() {
    dialog.current?.close();
    setActive(null);
    opener.current?.focus();
  }

  function move(amount: number) {
    setActive((index) =>
      index === null ? null : (index + amount + displayList.length) % displayList.length,
    );
  }

  return (
    <>
      <div className="gallery-filter-tabs" role="group" aria-label="Filter destination photos">
        {filters.map(option => <button key={option} type="button" aria-pressed={filter === option}
          className={`gallery-tab-btn ${filter === option ? 'is-active' : ''}`}
          onClick={() => { setFilter(option); setShowAll(false); }}>{option}</button>)}
      </div>
      <div className="photo-grid">
        {displayList.slice(0, showAll ? displayList.length : 12).map((photo, index) => (
          <button
            className="photo-tile"
            key={photo.src}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setActive(index);
            }}
            aria-label={`View ${photo.label}`}
          >
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              quality={60}
              sizes="(max-width:640px) 90vw, (max-width:900px) 45vw, 380px"
            />
            <span>{photo.label}</span>
          </button>
        ))}
      </div>

      {!showAll && displayList.length > 12 && (
        <button className="gallery-show-all" onClick={() => setShowAll(true)}>
          Show all {displayList.length} photos
        </button>
      )}

      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label="Travel gallery lightbox"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {active !== null && displayList[active] && (
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={close}
              aria-label="Close photo"
            >
              <X size={22} />
            </button>
            <div
              className="lightbox-image"
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchStart.current =
                  event.touches.length === 1
                    ? { x: touch.clientX, y: touch.clientY }
                    : null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start || event.changedTouches.length !== 1) return;
                const touch = event.changedTouches[0];
                const dx = touch.clientX - start.x;
                const dy = touch.clientY - start.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
                  move(dx < 0 ? 1 : -1);
              }}
            >
              <Image
                src={displayList[active].src}
                alt={displayList[active].label}
                fill
                quality={75}
                sizes="(max-width:640px) 92vw, 80vw"
              />
            </div>
            <div className="lightbox-controls">
              <button onClick={() => move(-1)} aria-label="Previous photo">
                <ArrowLeft size={22} />
              </button>
              <div className="lightbox-meta">
                <strong>{displayList[active].label}</strong>
                <p>{displayList[active].caption}</p>
                <Link className="text-link" href={`/tours/${displayList[active].slug}`}>View this itinerary <ArrowUpRight size={15}/></Link>
                <Link href={`/photo-credits#${displayList[active].slug}`}>Photo credit and licence</Link>
                <small>
                  {active + 1} / {displayList.length}
                </small>
              </div>
              <button onClick={() => move(1)} aria-label="Next photo">
                <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
