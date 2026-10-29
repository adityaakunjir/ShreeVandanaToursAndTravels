'use client';
import WhatsAppLink from '@/components/WhatsAppLink';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { business } from '@/data/site';
const links = [
  ['Home', '/'],
  ['Our tours', '/tours'],
  ['Destinations', '/destinations'],
  ['Our story', '/about'],
  ['Services', '/services'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact'],
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const isHero = pathname === '/' || pathname.startsWith('/tours/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [
      ...document.querySelectorAll<HTMLElement>(
        '#main-content, .site-footer, .mobile-dock',
      ),
    ].map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => {
      element.inert = true;
    });
    const opener = toggle.current;
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      const items = [
        ...(panel.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
        ...(opener ? [opener] : []),
      ];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      background.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open]);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)');
    const change = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  return (
    <>
      <div className="utility">
        <div className="wrap">
          <span>A family legacy. A world of possibilities.</span>
          <a href={`tel:+${business.phones[0].number}`}>
            <Phone size={13} /> {business.phones[0].display}
          </a>
        </div>
      </div>
      <header
        className={`site-header liquid-glass-nav ${scrolled ? 'is-scrolled' : ''} ${isHero ? 'is-hero' : ''}`}
      >
        <div className="wrap nav-wrap">
          <Link
            href="/"
            className="brand"
          >
            <div className="brand-badge">
              <Image
                src="/assets/images/brand-mark.webp"
                width={42}
                height={42}
                alt="Shree Vandana Tours & Travels"
                priority
              />
            </div>
            <span>
              <strong>SHREE VANDANA</strong>
              <small>TOURS & TRAVELS</small>
            </span>
          </Link>
          <nav
            ref={panel}
            id="main-navigation"
            aria-label="Main navigation"
            className={`main-nav ${open ? 'is-open' : ''}`}
          >
            {links.map(([name, href]) => (
              <Link
                key={name}
                href={href}
                aria-current={
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpen(false)}
              >
                {name}
              </Link>
            ))}
            <WhatsAppLink
              className="button nav-cta"

              onClick={() => setOpen(false)}
            >
              Plan your trip <ArrowUpRight size={17} />
            </WhatsAppLink>
          </nav>
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <div
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
