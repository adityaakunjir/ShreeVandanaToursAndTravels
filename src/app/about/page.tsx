import type { Metadata } from 'next';
import Image from 'next/image';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import { HeartHandshake, Users, Compass } from 'lucide-react';
export const metadata: Metadata = {
  title: 'Our family story',
  description:
    'Meet the family behind Shree Vandana Tours & Travels in Pune. Discover our approach to personal holiday planning and dependable travel service.',
  alternates: { canonical: '/about' },
};
export default function AboutPage() {
  return (
    <main>
      <PageIntro
        path="/about"
        eyebrow="Our story"
        title="A family legacy."
        accent="A friend in tourism."
        description="30+ years of trust. Three generations of travel excellence. Based in Pune, connected to a world of possibilities."
      />
      <section className="section wrap story-grid">
        <div className="story-photo">
          <Image
            src="/assets/images/gallery-3.jpg"
            fill
            sizes="(max-width:900px) calc(100vw - 40px), 550px"
            alt="A quiet moment of holiday inspiration"
          />
          <div className="legacy-card">
            <strong>
              Our legacy.
              <br />
              <em>Your journey.</em>
            </strong>
            <span>PUNE · INDIA</span>
          </div>
        </div>
        <div className="story-content">
          <p className="eyebrow">EXPERIENCE MEETS PASSION</p>
          <h2>
            Travel is personal.
            <br />
            <em>So are we.</em>
          </h2>
          <p>
            For over three decades, Shree Vandana Tours & Travels has been
            helping travellers turn their journeys into memorable experiences.
          </p>
          <p>
            What began with a passion for travel has grown into a trusted
            family-run business, proudly carried forward through three
            generations. Personal attention and understanding travellers’ needs
            remain at the heart of everything we do.
          </p>
          <p>
            From holiday packages and family vacations to group tours and
            customised travel, we believe every journey deserves thoughtful
            planning and dependable service.
          </p>
        </div>
      </section>
      <section className="wrap values-grid">
        {[
          {
            icon: HeartHandshake,
            title: 'Trust, built over time',
            text: 'Relationships matter to us. We bring the care of a family business to your travel plans.',
          },
          {
            icon: Users,
            title: 'Your people, your pace',
            text: 'Holidays that make room for the interests and comfort of everyone travelling.',
          },
          {
            icon: Compass,
            title: 'Experience with a fresh outlook',
            text: 'The values of our legacy, combined with a modern approach to planning your journey.',
          },
        ].map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={25} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <JourneyCTA />
    </main>
  );
}
