'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Users, Sparkles, X, ArrowUpRight, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';
import { googleBusiness } from '@/data/google-business';
import groupPhotosData from '@/data/group-photos.json';

type GroupPhoto = {
  src: string;
  title: string;
  caption: string;
  location: string;
  width: number;
  height: number;
};

const CATEGORIES = [
  'All Memories',
  'Alpine & Snow',
  'Pilgrimage & Sacred',
  'Palaces & Deserts',
  'Backwaters & Hills',
];

export default function GroupToursGallery() {
  const [selectedCategory, setSelectedCategory] = useState('All Memories');
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const photos: GroupPhoto[] = groupPhotosData;

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === 'All Memories') return true;
    if (selectedCategory === 'Alpine & Snow') {
      return /kashmir|snow|manali|himalayan/i.test(p.title + p.location + p.caption);
    }
    if (selectedCategory === 'Pilgrimage & Sacred') {
      return /pilgrimage|temple|sacred|varanasi|kashi/i.test(p.title + p.location + p.caption);
    }
    if (selectedCategory === 'Palaces & Deserts') {
      return /rajasthan|jaipur|jaisalmer|palace|desert/i.test(p.title + p.location + p.caption);
    }
    if (selectedCategory === 'Backwaters & Hills') {
      return /kerala|alleppey|darjeeling|tea|backwaters/i.test(p.title + p.location + p.caption);
    }
    return true;
  });

  useEffect(() => {
    if (activePhoto === null) {
      dialogRef.current?.close();
      document.body.style.overflow = '';
    } else {
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    }
  }, [activePhoto]);

  const handleNext = () => {
    if (activePhoto === null) return;
    setActivePhoto((activePhoto + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (activePhoto === null) return;
    setActivePhoto((activePhoto - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const currentModalPhoto = activePhoto !== null ? filteredPhotos[activePhoto] : null;

  return (
    <section className="section wrap group-gallery-section" id="traveller-groups" aria-label="Customer group tour memories">
      <div className="section-heading group-gallery-heading">
        <div>
          <div className="luxury-eyebrow-badge">
            <Users size={13} className="text-brand" />
            <span>REAL MOMENTS · OUR TRAVELLERS</span>
          </div>
          <h2>
            Smiles across the world. <br />
            <em>Memories made together.</em>
          </h2>
        </div>
        <div className="group-heading-right">
          <p className="group-gallery-intro">
            Moments captured on tour with our Pune travellers, families, and pilgrim groups across India and premier international destinations.
          </p>
          <a
            href={googleBusiness.url}
            target="_blank"
            rel="noopener noreferrer"
            className="button outline mini-google-btn"
          >
            <span>See more on Google Maps</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="group-filter-pills" role="tablist" aria-label="Filter group photos">
        {CATEGORIES.map((cat) => {
          const isActive = cat === selectedCategory;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              className={`group-filter-pill ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setActivePhoto(null);
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Photo Grid */}
      <div className="group-photo-masonry">
        {filteredPhotos.map((photo, idx) => (
          <article
            key={photo.src}
            className="group-photo-card"
            onClick={() => setActivePhoto(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActivePhoto(idx);
              }
            }}
            aria-label={`View ${photo.title}`}
          >
            <div className="group-photo-wrap">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="group-card-img"
              />
              <div className="group-photo-gradient" />
              <div className="group-location-pill">
                <MapPin size={12} />
                <span>{photo.location}</span>
              </div>
            </div>
            <div className="group-photo-info">
              <h3 className="group-photo-title">{photo.title}</h3>
              <p className="group-photo-caption">{photo.caption}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <dialog
        ref={dialogRef}
        className="group-lightbox-dialog"
        onCancel={(e) => {
          e.preventDefault();
          setActivePhoto(null);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActivePhoto(null);
        }}
      >
        {currentModalPhoto && (
          <div className="group-lightbox-inner">
            <button
              type="button"
              className="group-lightbox-close"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo"
            >
              <X size={20} />
            </button>

            <div className="group-modal-media-frame">
              <Image
                src={currentModalPhoto.src}
                alt={currentModalPhoto.title}
                fill
                unoptimized
                className="group-modal-img"
                priority
              />
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    className="group-nav-arrow group-nav-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label="Previous photo"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="group-nav-arrow group-nav-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Next photo"
                  >
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>

            <div className="group-modal-details">
              <div className="group-modal-meta">
                <span className="group-modal-loc">
                  <MapPin size={13} className="text-brand" /> {currentModalPhoto.location}
                </span>
                <span className="group-modal-count">
                  {activePhoto! + 1} of {filteredPhotos.length}
                </span>
              </div>
              <h2 className="group-modal-title">{currentModalPhoto.title}</h2>
              <p className="group-modal-caption">{currentModalPhoto.caption}</p>

              <div className="group-modal-actions">
                <WhatsAppLink
                  destination={`Group Tour Inquiry: ${currentModalPhoto.title} (${currentModalPhoto.location})`}
                  className="button warm"
                >
                  <span>Inquire about upcoming group departure</span>
                  <ArrowUpRight size={16} />
                </WhatsAppLink>
                <a
                  href={googleBusiness.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button outline"
                >
                  <span>Google Maps listing</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
