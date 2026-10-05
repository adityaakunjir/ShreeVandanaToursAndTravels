import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDemoPackages } from '@/data/demo-packages';
import DemoNotice from '@/components/DemoNotice';
import DemoPlanner from '@/components/DemoPlanner';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Trip planner preview',
  robots: { index: false, follow: false },
};
export default async function PlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getDemoPackages().find((item) => item.slug === slug);
  if (!tour) notFound();
  return (
    <main className="wrap package-detail">
      <div className="breadcrumb">
        <Link href={`/packages/${tour.slug}`}>
          ← Back to {tour.destination} tour
        </Link>
      </div>
      <DemoNotice />
      <h1 className="planner-heading">
        A journey worth <em>looking forward to.</em>
      </h1>
      <DemoPlanner tour={tour} />
    </main>
  );
}
