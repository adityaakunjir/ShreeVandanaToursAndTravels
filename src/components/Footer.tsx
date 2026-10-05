import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Mail, Phone } from 'lucide-react';
import { business } from '@/data/site';
export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-intro">
          <Link href="/" className="brand">
            <Image
              src="/assets/images/brand-mark.webp"
              alt="Shree Vandana logo"
              width={52}
              height={52}
            />
            <span>
              <strong>SHREE VANDANA</strong>
              <small>TOURS & TRAVELS</small>
            </span>
          </Link>
          <p>
            Your friend in tourism.
            <br />
            From our family to your next adventure.
          </p>
          <div className="socials">
            {Object.entries(business.socialMedia).map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3>Find your way</h3>
          <Link href="/packages">Tour collection</Link>
          <Link href="/destinations">Destinations</Link>
          <Link href="/about">Our story</Link>
          <Link href="/services">Travel services</Link>
          <Link href="/faq">Your questions</Link>
          <Link href="/enquire">Plan your holiday</Link>
        </div>
        <div className="footer-contact">
          <h3>Let’s talk travel</h3>
          {business.phones.map((phone) => (
            <a key={phone.number} href={`tel:+${phone.number}`}>
              <Phone size={16} />
              {phone.display}
            </a>
          ))}
          <a href={`mailto:${business.contact.email}`}>
            <Mail size={16} />
            {business.contact.email}
          </a>
          <a href={business.map} target="_blank" rel="noopener noreferrer">
            <MapPin size={18} />
            <span>{business.contact.address}</span>
          </a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} {business.businessName}
        </span>
        <span>Thoughtfully planned. Beautifully remembered.</span>
      </div>
    </footer>
  );
}
