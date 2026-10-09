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
        <nav className="tour-section-nav" aria-label="FAQ topics">
          <a href="#planning">Planning</a>
          <a href="#arrangements">Arrangements</a>
          <a href="#confirming">Before confirming</a>
        </nav>
        {[
          {
            id: 'planning',
            name: 'Start with your idea',
            indices: [0, 1, 2, 7, 10],
          },
          {
            id: 'arrangements',
            name: 'The travel arrangements',
            indices: [4, 5, 6, 8],
          },
          { id: 'confirming', name: 'Before you confirm', indices: [3, 9, 11] },
        ].map((group) => (
          <section key={group.id} id={group.id} className="faq-topic">
            <h2>{group.name}</h2>
            <div className="faq-list">
              {group.indices
                .map((index) => faqs[index])
                .map((faq) => (
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
        ))}
      </section>
      <JourneyCTA />
    </main>
  );
}
