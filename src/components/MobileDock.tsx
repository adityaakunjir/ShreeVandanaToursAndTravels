'use client';
import Link from 'next/link';
import { Compass, MessageCircle, ArrowUpRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { business } from '@/data/site';
export default function MobileDock() {
  const path = usePathname();
  if (path === '/enquire' || path.endsWith('/plan')) return null;
  if (
    /^\/packages\/[^/]+$/.test(path) &&
    !['/packages/saved', '/packages/compare'].includes(path)
  )
    return null;
  return (
    <nav className="mobile-dock" aria-label="Quick travel actions">
      <Link
        href="/destinations"
        aria-current={path.startsWith('/destinations') ? 'page' : undefined}
      >
        <Compass size={20} />
        <span>Explore</span>
      </Link>
      <Link className="dock-primary" href="/enquire">
        <span>Plan my trip</span>
        <ArrowUpRight size={19} />
      </Link>
      <a href={business.whatsapp} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
}
