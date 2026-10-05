import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight } from 'lucide-react';
import { PageIntro } from '@/components/PageIntro';
import { business } from '@/data/site';
import { googleBusiness } from '@/data/google-business';
export const metadata: Metadata = {
  title: 'Contact our Pune team',
  description:
    'Contact Shree Vandana Tours & Travels in Dhankawadi, Pune. Call or WhatsApp +91 96652 38966, view office hours and get directions.',
  alternates: { canonical: '/contact' },
};
export default function ContactPage() {
  return (
    <main>
      <PageIntro
        path="/contact"
        eyebrow="Contact us"
        title="A good journey starts"
        accent="with a conversation."
        description="Have a question or a holiday in mind? Speak with our Pune team, write to us or stop by our office."
      />
      <section className="section wrap contact-grid">
        <div className="contact-options">
          <article>
            <Phone size={23} />
            <h2>Give us a call</h2>
            {business.phones.map((phone) => (
              <a href={`tel:+${phone.number}`} key={phone.number}>
                {phone.display}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </article>
          <article>
            <MessageCircle size={23} />
            <h2>A quick hello</h2>
            <p>Prefer to chat? Share your travel ideas on WhatsApp.</p>
            <a
              href={business.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open WhatsApp <ArrowUpRight size={16} />
            </a>
          </article>
          <article>
            <Mail size={23} />
            <h2>Write to us</h2>
            <a href={`mailto:${business.contact.email}`}>
              {business.contact.email}
              <ArrowUpRight size={16} />
            </a>
          </article>
        </div>
        <div className="office-card">
          <MapPin size={30} />
          <p className="eyebrow">COME SAY HELLO</p>
          <h2>
            Your travel friend,
            <br />
            <em>here in Pune.</em>
          </h2>
          <address>{business.contact.address}</address>
          <p>{googleBusiness.hours}</p>
          <p className="reel-disclaimer">
            Please call before visiting on a holiday.
          </p>
          <a
            className="button outline"
            href={business.map}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions <ArrowUpRight size={17} />
          </a>
          <div className="office-enquiry">
            <h3>Ready to plan?</h3>
            <p>A few details help us understand your ideal trip.</p>
            <Link href="/enquire" className="text-link">
              Prepare a holiday enquiry <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
