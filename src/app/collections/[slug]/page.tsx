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
          ' Browse company-supplied outlines and enquire for a personalised quote.',
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
          {c.tours.length} source outlines · distinct route variants included ·
          quotes on enquiry
        </p>
        <div className="brochure-tour-grid">
          {c.tours.map((t, i) => (
            <TourCard key={t.slug} tour={t} index={i} />
          ))}
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
