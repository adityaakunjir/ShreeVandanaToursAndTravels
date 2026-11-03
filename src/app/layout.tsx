import { siteUrl } from '@/lib/site-url';
import photos from '@/data/tour-photos.json';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileDock from '@/components/MobileDock';
import ScrollMotion from '@/components/ScrollMotion';
import BusinessStructuredData from '@/components/BusinessStructuredData';
import ExperienceCapabilities from '@/components/ExperienceCapabilities';
import './globals.css';
import './expedition.css';
import './motion.css';
import './mobile-experience.css';
import './focused-mobile.css';
import './scenic-video.css';
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tours & Travels in Pune | Shree Vandana Tours & Travels',
    template: '%s | Shree Vandana Travels',
  },
  description:
    'Plan domestic and international holidays with Shree Vandana Tours & Travels, Dhankawadi, Pune. Explore itineraries and get a personalised quote on WhatsApp.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  twitter: { card: 'summary_large_image' },
  openGraph: {
    title: 'Shree Vandana Tours & Travels',
    locale: 'en_IN',
    siteName: 'Shree Vandana Tours & Travels',
    type: 'website',
    description:
      'The world, personally curated. Three generations of experience, thoughtfully planning your next holiday from Pune.',
    images: [
      {
        url: photos.find((p) => p.slug === 'nepal')!.src,
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
        <BusinessStructuredData />
        <ExperienceCapabilities />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <div id="main-content">{children}</div>
        <Footer />
        <MobileDock />
        <ScrollMotion />
      </body>
    </html>
  );
}
