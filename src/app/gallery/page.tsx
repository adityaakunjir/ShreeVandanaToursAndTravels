import type { Metadata } from 'next';
import GalleryViewer from '@/components/GalleryViewer';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import InstagramShowcase from '@/components/InstagramShowcase';
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
        <GalleryViewer />
      </section>
      <InstagramShowcase />
      <JourneyCTA />
    </main>
  );
}
