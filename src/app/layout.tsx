import { siteUrl } from '@/lib/site-url';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileDock from '@/components/MobileDock';
import './globals.css';
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shree Vandana Tours & Travels | Your Friend in Tourism',
    template: '%s | Shree Vandana Travels',
  },
  description:
    '30+ years of trust and three generations of travel expertise. Plan personalised domestic and international holidays with Shree Vandana Tours & Travels, Pune.',
  openGraph: {
    title: 'Shree Vandana Tours & Travels',
    description:
      'Our legacy. Your journey. Thoughtfully planned holidays from Pune.',
    images: [
      {
        url: '/assets/images/tours/dubai-abu-dhabi.webp',
        width: 1400,
        height: 624,
        alt: 'Dubai skyline at sunset',
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable} data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <div id="main-content">{children}</div>
        <Footer />
        <MobileDock />
      </body>
    </html>
  );
}
