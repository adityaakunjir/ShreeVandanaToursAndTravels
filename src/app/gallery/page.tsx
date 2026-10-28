import type { Metadata } from 'next';
import GalleryViewer from '@/components/GalleryViewer';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import InstagramShowcase from '@/components/InstagramShowcase';
import Link from 'next/link';
import { googleBusiness } from '@/data/google-business';
export const metadata: Metadata = {
  title: 'Travel inspiration gallery',
  description:
    'Explore travel inspiration and Instagram reels from Shree Vandana Tours & Travels. See moments from our journeys and plan your next holiday.',
  alternates: { canonical: '/gallery' },
};
export default function GalleryPage() {
  return (
    <main>
      <PageIntro
        path="/gallery"
        eyebrow="Travel gallery"
        title="Places that stay"
        accent="with you."
        description="A collection of travel inspiration. Tap a photograph, take a closer look, and imagine where your next journey could lead."
      />
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE DESTINATION EDIT</p>
            <h2>
              A window to
              <br />
              <em>somewhere wonderful.</em>
            </h2>
          </div>
          <p>
            Licensed destination photography for inspiration. Our company travel
            reels appear separately below.
          </p>
        </div>
        <GalleryViewer />
        <p className="reel-disclaimer">
          These photographs show destinations, rather than our customers or
          team.{' '}
          <Link href="/photo-credits">Photographers, sources & licences</Link>
        </p>
      </section>
      <InstagramShowcase />
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MORE FROM OUR JOURNEYS</p>
            <h2>
              Moments shared.
              <br />
              <em>See the original stories.</em>
            </h2>
          </div>
          <p>
            Explore photos and videos on our Google Maps listing, alongside
            reviews shared by travellers. Contributions retain their original
            author attribution on Google.
          </p>
        </div>
        <a
          className="text-link"
          href={googleBusiness.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View photos & videos on Google Maps
        </a>
      </section>
      <JourneyCTA />
    </main>
  );
}
