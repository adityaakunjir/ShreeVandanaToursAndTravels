import { siteUrl } from '@/lib/site-url';
import photos from '@/data/tour-photos.json';
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
    'A family-run travel business shaped by three generations. Explore company-supplied itineraries and plan personalised holidays with Shree Vandana Tours & Travels, Pune.',
  openGraph: {
    title: 'Shree Vandana Tours & Travels',
    description:
      'The world, personally curated. Three generations of experience, thoughtfully planning your next holiday from Pune.',
    images: [
      {
        url: '/assets/images/tours/nepal.webp',
        width: photos.find((p) => p.slug === 'nepal')!.width,
        height: photos.find((p) => p.slug === 'nepal')!.height,
        alt: 'Phewa Lake surrounded by hills in Pokhara, Nepal',
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
