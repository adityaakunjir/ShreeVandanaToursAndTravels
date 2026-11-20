import type { Metadata } from 'next';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import tours from '@/data/catalogue';
import Image from 'next/image';
import WhatsAppLink from '@/components/WhatsAppLink';
import GalleryViewer from '@/components/GalleryViewer';
import InstagramShowcase from '@/components/InstagramShowcase';
import Breadcrumb from '@/components/Breadcrumb';
import { googleBusiness } from '@/data/google-business';

export const metadata: Metadata = {
  title: 'Traveller group photos, destinations and travel reels',
  description:
    'See a Shree Vandana traveller group photo, browse destination landscapes, explore related itineraries and watch travel reels from Shree Vandana Tours & Travels, Pune.',
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
          <a href="#traveller-photos">Traveller photos <ArrowDown size={15} /></a>
          <a href="#gallery-photos">
            Tour Photos <ArrowDown size={15} />
          </a>
          <a href="#instagram">
            Reels <ArrowDown size={15} />
          </a>
        </nav>
      </header>

      <section id="traveller-photos" className="wrap traveller-feature" aria-labelledby="traveller-heading">
        <figure>
          <a href="/assets/images/travellers/tower-group.webp" aria-label="Open the full group photograph">
            <Image unoptimized width={470} height={1020} src="/assets/images/travellers/tower-group.webp"
              alt="Travellers of several generations posing together in front of a carved stone tower under a blue sky" />
          </a>
        </figure>
        <div>
          <p className="eyebrow">From the travel album</p>
          <h2 id="traveller-heading">Travelling together.</h2>
          <p>A group moment from Shree Vandana Tours &amp; Travels. Planning a trip with your own group? Tell our Pune team how many people are coming and where you would like to go.</p>
          <WhatsAppLink destination="Group tour" className="button warm">Plan a group tour <ArrowUpRight size={16}/></WhatsAppLink>
          <a className="text-link" href="https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QXWow3AayBfVWq6rKvd2_jvvcpjj-zdgxWhiU28AxDT6dWm26BJgpFspj8iSLOfqe03M4AUWyWgPBLVRo6j-5YPJIT3Jl4UeNqFKy6xcD5lqBg5KLK0GjnfKDfpo0nzrbD77E=s1360-w1360-h1020-rw" target="_blank" rel="noopener noreferrer">Original photo on Google <ArrowUpRight size={14}/></a>
        </div>
      </section>
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
