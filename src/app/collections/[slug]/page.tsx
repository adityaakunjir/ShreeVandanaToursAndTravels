import { notFound } from 'next/navigation';
import { collections } from '@/data/collections';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import TourCard from '@/components/TourCard';
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((c) => c.slug === slug);
  return c
    ? {
        title: c.name + ' from Pune',
        description:
          c.description +
          ' Explore itineraries and ask our Pune team for a personalised quote.',
        alternates: { canonical: `/collections/${c.slug}` },
      }
    : {};
}
export default async function Collection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((c) => c.slug === slug);
  if (!c) notFound();
  return (
    <main className="collection-page">
      <PageIntro
        photoSlug={c.tours.find((t) => t.image)?.image?.slug}
        path={`/collections/${c.slug}`}
        eyebrow="Curated collection"
        title={c.name}
        accent="Your next chapter."
        description={c.description}
      />
      <section className="section wrap">
        <p className="brochure-confirmation">
          {c.tours.length} itineraries · Personalised around your dates
        </p>
        <div className="brochure-tour-grid">
          {c.tours.slice(0, 6).map((t, i) => (
            <TourCard key={t.slug} tour={t} index={i} />
          ))}
        </div>
        {c.tours.length > 6 && (
          <details className="optional-discovery">
            <summary>
              Explore {c.tours.length - 6} more itineraries in this collection
            </summary>
            <div className="brochure-tour-grid">
              {c.tours.slice(6).map((t, i) => (
                <TourCard key={t.slug} tour={t} index={i + 6} />
              ))}
            </div>
          </details>
        )}
      </section>
      <JourneyCTA />
    </main>
  );
}
