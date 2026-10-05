import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';
import { indiaToday } from '@/lib/enquiry';
import { business } from '@/data/site';
export const metadata: Metadata = {
  title: 'Plan your holiday',
  alternates: { canonical: '/enquire' },
  description:
    'Tell our Pune travel team about your next journey. Prepare a personalised holiday enquiry to send through WhatsApp or email.',
};
export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string | string[] }>;
}) {
  const params = await searchParams;
  const destination =
    typeof params.destination === 'string'
      ? params.destination.slice(0, 120)
      : '';
  return (
    <main className="enquiry-section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span>Plan your holiday</span>
        </div>
        <div className="enquiry-grid">
          <div className="enquiry-intro">
            <p className="eyebrow">YOUR JOURNEY, YOUR WAY</p>
            <h1>
              Let’s plan
              <br />
              <em>your next journey.</em>
            </h1>
            <p>
              Tell us where you’d like to go. We’ll help shape a holiday around
              you.
            </p>
            <a
              className="enquiry-call text-link"
              href={`tel:+${business.phones[0].number}`}
            >
              <Phone size={16} /> Prefer to talk? Call our team
            </a>
            <div className="enquiry-contact">
              {business.phones.map((phone) => (
                <a href={`tel:+${phone.number}`} key={phone.number}>
                  <Phone size={17} />
                  {phone.display}
                </a>
              ))}
              <a href={`mailto:${business.contact.email}`}>
                <Mail size={17} />
                {business.contact.email}
              </a>
              <a href={business.map} target="_blank" rel="noopener noreferrer">
                <MapPin size={18} /> Visit our Pune office
              </a>
            </div>
          </div>
          <EnquiryForm
            key={destination}
            destination={destination}
            today={indiaToday()}
          />
        </div>
      </div>
    </main>
  );
}
