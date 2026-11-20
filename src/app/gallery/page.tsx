import type { Metadata } from 'next';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import tours from '@/data/catalogue';
import GalleryViewer from '@/components/GalleryViewer';
import InstagramShowcase from '@/components/InstagramShowcase';
import Breadcrumb from '@/components/Breadcrumb';
import { googleBusiness } from '@/data/google-business';

export const metadata: Metadata = {
  title: 'Destination photography and travel reels',
  description:
    'Browse destination landscapes, explore related itineraries and watch travel reels from Shree Vandana Tours & Travels, Pune.',
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
        <h1>Moments &amp; inspiration.</h1>
        <p>Find a view you love. Open the photo to explore its itinerary.</p>
        <nav className="gallery-shortcuts" aria-label="Gallery sections">
          <a href="#gallery-photos">
            Tour Photos <ArrowDown size={15} />
          </a>
          <a href="#instagram">
            Reels <ArrowDown size={15} />
          </a>
        </nav>
      </header>

      <section
        className="section wrap gallery-photos"
        id="gallery-photos"
        aria-label="Travel photos"
      >
        <GalleryViewer india={tours.filter(t => t.region === 'India').map(t => t.slug)} />
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
