import type { Metadata } from 'next';
import Image from 'next/image';
import { PageIntro, JourneyCTA } from '@/components/PageIntro';
import { HeartHandshake, Users, Compass } from 'lucide-react';
import Link from 'next/link';
import { business } from '@/data/site';
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
        description="A family-run business shaped by three generations. Based in Pune, connected to a world of possibilities."
      />
      <section className="section wrap story-grid">
        <div className="story-photo">
          <Image
            src="/assets/images/tours/royal-bhutan.webp"
            fill
            sizes="(max-width:900px) calc(100vw - 40px), 550px"
            alt="Destination inspiration: the mountain landscape around Paro, Bhutan"
            quality={60}
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
          <Link href="/photo-credits#royal-bhutan" className="tour-card-credit">
            Bhutan inspiration · photo credits ↗
          </Link>
          <p className="eyebrow">EXPERIENCE MEETS PASSION</p>
          <h2>
            Travel is personal.
            <br />
            <em>So are we.</em>
          </h2>
          <p>
            Shree Vandana Tours & Travels is a family-run business, helping
            travellers turn their journeys into memorable experiences.
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
      <section className="section wrap legacy-manifesto">
        <p className="eyebrow">OUR LEGACY, YOUR JOURNEY</p>
        <h2>
          Passed through generations.
          <br />
          <em>Planned for yours.</em>
        </h2>
        <div className="legacy-principles">
          <article>
            <strong>Care</strong>
            <h3>A personal approach</h3>
            <p>The legacy of a family travel business rooted in Pune.</p>
          </article>
          <article>
            <strong>3</strong>
            <h3>Generations, one passion</h3>
            <p>
              Personal attention and thoughtful planning carried forward through
              the family.
            </p>
          </article>
          <article>
            <strong>You</strong>
            <h3>At the heart of the plan</h3>
            <p>
              A conversation about your interests, comfort and the people
              travelling with you.
            </p>
          </article>
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
      <section className="section wrap office-story">
        <div>
          <p className="eyebrow">ROOTED IN PUNE</p>
          <h2>
            A real conversation.
            <br />
            <em>A familiar place.</em>
          </h2>
          <p>{business.contact.address}</p>
        </div>
        <div>
          <p>
            Talk through your ideas with our team in Dhankawadi. Call before
            visiting on a holiday.
          </p>
          <a
            className="button outline"
            href={business.map}
            target="_blank"
            rel="noopener noreferrer"
          >
            Find our office ↗
          </a>
          <Link className="text-link" href="/contact">
            Contact our team ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
