'use client';
import Image from '@/components/TravelImage';
import { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import sourcePhotos from '@/data/tour-photos.json';
import { googleBusiness } from '@/data/google-business';

const clientMoments = [
  {
    src: '/assets/images/travellers/beach-group.webp',
    label: 'A lively group day by the sea',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/cliff-group.webp',
    label: 'Friends making a playful group memory',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/tower-family.webp',
    label: 'Families travelling together at a heritage landmark',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/evening-group.webp',
    label: 'An evening together on holiday',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/forest-group.webp',
    label: 'A relaxed group moment among the trees',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/waterfall-family.webp',
    label: 'A family memory beside the waterfall',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/heritage-group.webp',
    label: 'Travellers together at a historic site',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/elephant-group.webp',
    label: 'A memorable group adventure together',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/group-day-out.webp',
    label: 'A group day out, captured together',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
  {
    src: '/assets/images/travellers/mountain-friends.webp',
    label: 'Friends together against a mountain backdrop',
    caption:
      'A traveller moment shared with Shree Vandana Tours & Travels on Google.',
    sourceHref: googleBusiness.url,
  },
];

const destinationPhotos = sourcePhotos.map((p) => ({
  ...p,
  label: p.alt,
  caption: `Photo: ${p.author} · ${p.license} · Destination inspiration`,
}));

const photos = [...clientMoments, ...destinationPhotos];

export default function GalleryViewer() {
  const [active, setActive] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
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
      index === null ? null : (index + amount + photos.length) % photos.length,
    );
  }
  return (
    <>
      <section className="client-moments" id="traveller-moments">
        <div className="client-moments-heading">
          <p className="eyebrow">REAL TRAVELLER MOMENTS</p>
          <h2>Good trips look like this.</h2>
          <p>Group memories shared with us by people who travelled.</p>
        </div>
        <div className="client-moments-grid">
          {clientMoments.map((photo, index) => (
            <button
              className="client-moment-card"
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
                quality={72}
                sizes="(max-width:700px) 82vw, 33vw"
              />
              <span>{photo.label}</span>
            </button>
          ))}
        </div>
        <p className="client-moments-source">
          Shared through the Shree Vandana Tours & Travels Google Business
          profile.
        </p>
      </section>

      <div className="destination-gallery-heading">
        <p className="eyebrow">DESTINATION INSPIRATION</p>
        <h2>Where next?</h2>
      </div>
      <div className="photo-grid">
        {destinationPhotos
          .slice(0, showAll ? destinationPhotos.length : 8)
          .map((photo, index) => (
            <button
              className="photo-tile"
              key={photo.src}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setActive(index + clientMoments.length);
              }}
              aria-label={`View ${photo.label}`}
            >
              <Image
                src={photo.src}
                alt={photo.label}
                fill
                quality={60}
                sizes="(max-width:640px) 45vw, (max-width:900px) 45vw, 380px"
              />
              <span>{photo.label}</span>
            </button>
          ))}
      </div>
      {!showAll && destinationPhotos.length > 8 && (
        <button className="gallery-show-all" onClick={() => setShowAll(true)}>
          Show all {destinationPhotos.length} destination photos
        </button>
      )}
      <dialog
        ref={dialog}
        className="photo-dialog"
        aria-label="Travel inspiration gallery"
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
        {active !== null && (
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
                src={photos[active].src}
                alt={photos[active].label}
                fill
                quality={60}
                sizes="(max-width:640px) 92vw, 80vw"
              />
            </div>
            <div className="lightbox-controls">
              <button onClick={() => move(-1)} aria-label="Previous photo">
                <ArrowLeft size={22} />
              </button>
              <div>
                <strong>{photos[active].label}</strong>
                <p>{photos[active].caption}</p>
                {'slug' in photos[active] ? (
                  <Link href={`/photo-credits#${photos[active].slug}`}>
                    Source & licence
                  </Link>
                ) : (
                  <a
                    href={photos[active].sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Google
                  </a>
                )}
                <small>
                  {active + 1} / {photos.length}
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
