import WhatsAppLink from '@/components/WhatsAppLink';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, MessageCircle } from 'lucide-react';
import { business } from '@/data/site';
import Breadcrumb from './Breadcrumb';
export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  path,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  path?: string;
}) {
  return (
    <section className="page-intro">
      <div className="wrap">
        {path ? (
          <Breadcrumb
            items={[
              { name: 'Home', path: '/' },
              { name: eyebrow, path },
            ]}
          />
        ) : (
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={13} />
            <span>{eyebrow}</span>
          </div>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1>
          {title}
          <br />
          <em>{accent}</em>
        </h1>
        <p className="page-description">{description}</p>
      </div>
      <span className="intro-orbit" aria-hidden="true" />
    </section>
  );
}
export function JourneyCTA() {
  return (
    <section className="compact-cta wrap">
      <div>
        <p className="eyebrow">A CONVERSATION AWAY</p>
        <h2>
          Let’s make it <em>your journey.</em>
        </h2>
        <p>Personal advice from a family that loves travel.</p>
      </div>
      <div>
        <WhatsAppLink className="button">
          Plan my holiday <ArrowUpRight size={18} />
        </WhatsAppLink>
        <a
          className="text-link"
          href={business.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} /> Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
