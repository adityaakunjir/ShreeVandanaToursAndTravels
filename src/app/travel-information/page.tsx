import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import Link from 'next/link';
export const metadata = {
  title: 'Planning, booking and your website visit',
  description:
    'Understand tour outlines, personalised quotes, booking conversations, device-local saved tours and external services used by this website.',
  alternates: { canonical: '/travel-information' },
};
export default function InformationPage() {
  return (
    <main>
      <PageIntro
        path="/travel-information"
        eyebrow="Helpful travel information"
        title="The details matter."
        accent="Know before you plan."
        description="How this website helps you explore, what to confirm with our team, and what happens when you open external services."
      />
      <section className="section wrap information-grid">
        <article className="package-panel">
          <p className="eyebrow">PLANNING & BOOKING</p>
          <h2>A conversation comes first.</h2>
          <p>
            The tour collection contains company-supplied outlines. There is no
            live seat inventory, online reservation or payment checkout on this
            website.
          </p>
          <p>
            Before confirming a booking, ask our team for your final dates,
            availability, route, accommodation, transport, inclusions,
            exclusions, taxes and total quote.
          </p>
          <p>
            Payment schedules, change charges and cancellation conditions depend
            on the final arrangements and suppliers. Confirm them directly
            before you commit. Opening a WhatsApp draft does not confirm a
            booking.
          </p>
          <Link href="/faq" className="text-link">
            Travel questions
          </Link>
        </article>
        <article className="package-panel">
          <p className="eyebrow">ABOUT YOUR WEBSITE VISIT</p>
          <h2>A little useful context.</h2>
          <p>
            Saved tours use this browser’s local storage. They do not create an
            account or a lead in a website database. Clearing browser data
            removes them.
          </p>
          <p>
            Contact preferences create a WhatsApp link without storing your
            selections. WhatsApp receives the draft when you open that link; you
            choose whether to edit and send it.
          </p>
          <p>
            Instagram reels load from Instagram as you approach them. Maps,
            social links and WhatsApp open external services with their own data
            practices. Your browser contacts the site’s hosting and image
            services to load the pages and photographs.
          </p>
          <p>
            This page describes current website features. Ask our team about how
            information shared during a booking conversation is handled.
          </p>
          <Link href="/contact" className="text-link">
            Contact our team
          </Link>
        </article>
      </section>
      <JourneyCTA />
    </main>
  );
}
