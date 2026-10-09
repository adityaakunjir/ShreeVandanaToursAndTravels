'use client';
import WhatsAppLink from '@/components/WhatsAppLink';

import Link from 'next/link';
import { Compass, MessageCircle, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { business } from '@/data/site';
export default function MobileDock() {
  const path = usePathname();
  if (
    (path.startsWith('/tours/') &&
      !['/tours/saved', '/tours/compare'].includes(path)) ||
    path === '/enquire' ||
    path.endsWith('/plan')
  )
    return null;
  if (
    /^\/packages\/[^/]+$/.test(path) &&
    !['/packages/saved', '/packages/compare'].includes(path)
  )
    return null;
  return (
    <nav className="mobile-dock" aria-label="Quick travel actions">
      <Link
        href="/tours"
        aria-current={path.startsWith('/tours') ? 'page' : undefined}
      >
        <Compass size={20} />
        <span>Explore</span>
      </Link>
      <WhatsAppLink className="dock-primary">
        <MessageCircle size={19} />
        <span>WhatsApp</span>
      </WhatsAppLink>
      <a
        href={`tel:+${business.phones[0].number}`}
        aria-label="Call our travel team"
      >
        <Phone size={20} />
        <span>Call</span>
      </a>
    </nav>
  );
}
