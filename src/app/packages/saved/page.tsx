import type { Metadata } from 'next';
import { getDemoPackages } from '@/data/demo-packages';
import { PageIntro } from '@/components/PageIntro';
import { SavedTours } from '@/components/Shortlist';
import DemoNotice from '@/components/DemoNotice';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Your tour shortlist',
  robots: { index: false, follow: false },
};
export default function SavedPage() {
  const catalogue = getDemoPackages();
  return (
    <main>
      <PageIntro
        eyebrow="Your shortlist"
        title="Keep a little"
        accent="possibility close."
        description="A place for the journeys you’d like to come back to."
      />
      <section className="wrap section">
        {catalogue.length ? (
          <>
            <DemoNotice />
            <SavedTours catalogue={catalogue} />
          </>
        ) : (
          <div className="discovery-empty">
            <h2>Plan your next journey.</h2>
            <p>The online collection is being prepared.</p>
            <Link className="button" href="/enquire">
              Talk to our team →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
