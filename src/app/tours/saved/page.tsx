import tours from '@/data/catalogue';
import { SavedRealTours } from '@/components/RealShortlist';
import { PageIntro } from '@/components/PageIntro';
import { tourDuration } from '@/lib/real-tours';
export const metadata = {
  title: 'Your saved journeys',
  description:
    'Keep your favourite Shree Vandana tour outlines together on this device.',
  alternates: { canonical: '/tours/saved' },
  robots: { index: false, follow: true },
};
export default function SavedPage() {
  return (
    <main>
      <PageIntro
        path="/tours/saved"
        eyebrow="Your saved journeys"
        title="A little wishlist."
        accent="A world of possibilities."
        description="Keep the places that catch your eye. Come back, compare the details, and choose your next conversation."
      />
      <section className="section wrap">
        <SavedRealTours
          catalogue={tours.map((t) => ({
            slug: t.slug,
            name: t.name,
            region: t.region,
            theme: t.theme,
            summary: t.summary,
            duration: tourDuration(t),
          }))}
        />
      </section>
    </main>
  );
}
