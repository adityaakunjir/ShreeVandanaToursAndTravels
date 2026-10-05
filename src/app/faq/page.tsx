import type { Metadata } from 'next';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import { faqs } from '@/data/site';
export const metadata: Metadata = {
  title: 'Travel questions',
  description:
    'Answers about customised holidays, domestic and international travel, quotes and booking enquiries with Shree Vandana Tours & Travels, Pune.',
  alternates: { canonical: '/faq' },
};
export default function FAQPage() {
  return (
    <main>
      <PageIntro
        path="/faq"
        eyebrow="Your questions"
        title="A little clarity."
        accent="Before you go."
        description="From your first idea to confirming a trip, here are a few useful things to know."
      />
      <section className="section wrap faq-page">
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span>+</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <JourneyCTA />
    </main>
  );
}
