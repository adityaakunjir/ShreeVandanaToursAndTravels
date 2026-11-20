import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import WhatsAppLink from './WhatsAppLink';
import { business } from '@/data/site';

export default function HeritageTrustStats() {
  return <section className="section wrap heritage-section">
    <div className="heritage-grid">
      <div><p className="eyebrow">Dhankawadi, Pune</p><h2>Plan your holiday<br/><em>with a local team.</em></h2></div>
      <div><p className="heritage-lead">Bring us your travel dates, the places on your list and who is coming along. Our Pune team can walk you through the route and prepare a personal quote.</p>
        <p className="heritage-office-chip"><MapPin size={18}/>{business.contact.address}</p>
        <div className="heritage-cta-row"><WhatsAppLink className="button warm">Discuss my trip <ArrowUpRight size={16}/></WhatsAppLink><Link href="/contact" className="text-link">Visit the office</Link></div>
      </div>
    </div>
  </section>;
}
