import type { Metadata } from 'next';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import GalleryViewer from '@/components/GalleryViewer';
import InstagramShowcase from '@/components/InstagramShowcase';
import Breadcrumb from '@/components/Breadcrumb';
import { googleBusiness } from '@/data/google-business';

export const metadata: Metadata = {
  title: 'Travel gallery',
  description:
    'See genuine traveller group moments, destination inspiration and travel reels from Shree Vandana Tours & Travels.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return (
    <main className="gallery-page">
      <header className="gallery-intro wrap">
        <Breadcrumb
          items={[
            { name: 'Home', path: '/' },
            { name: 'Gallery', path: '/gallery' },
          ]}
        />
        <p className="eyebrow">TRAVEL GALLERY</p>
        <h1>
          Journeys,
          <br />
          remembered.
        </h1>
        <p>Real groups, shared moments and places worth discovering.</p>
        <nav className="gallery-shortcuts" aria-label="Gallery sections">
          <a href="#traveller-moments">
            Traveller moments <ArrowDown size={15} />
          </a>
          <a href="#gallery-photos">
            Destinations <ArrowDown size={15} />
          </a>
          <a href="#instagram">
            Reels <ArrowDown size={15} />
          </a>
        </nav>
      </header>

      <section
        className="section wrap gallery-photos"
        id="gallery-photos"
        aria-label="Traveller and destination photos"
      >
        <GalleryViewer />
        <div className="gallery-quiet-links">
          <a href="/photo-credits">Photo credits</a>
          <a
            href={googleBusiness.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            More on Google Maps <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      <InstagramShowcase />
    </main>
  );
}
