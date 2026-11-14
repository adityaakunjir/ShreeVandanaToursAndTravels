import { ArrowUpRight, Video } from 'lucide-react';
import ReelEmbed from './ReelEmbed';

const reels = [
  {
    id: 'DWB54lYCPu0',
    title: 'Manali. Kasol. Amritsar.',
    author: '@shreevandanatours',
    note: 'From our travel diary · 18 March 2026',
    url: 'https://www.instagram.com/shreevandanatours/reel/DWB54lYCPu0/',
  },
  {
    id: 'DWWaiN2DJuY',
    title: 'The joy of going together.',
    author: '@prajwal_shelar03',
    note: 'Collaboration with @shreevandanatours · 26 March 2026',
    url: 'https://www.instagram.com/prajwal_shelar03/reel/DWWaiN2DJuY/',
  },
];

function ReelCard({ reel }: { reel: (typeof reels)[number] }) {
  return (
    <article className="reel-card">
      <div className="reel-screen">
        <ReelEmbed id={reel.id} title={reel.title} />
      </div>
      <div className="reel-caption">
        <p>{reel.note}</p>
        <span>{reel.author}</span>
        <a href={reel.url} target="_blank" rel="noopener noreferrer">
          Open on Instagram <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}

export default function InstagramShowcase() {
  return (
    <section id="instagram" className="section wrap">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ON INSTAGRAM</p>
          <h2>Travel reels</h2>
        </div>
        <a
          className="text-link"
          href="https://www.instagram.com/shreevandanatours/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Video size={18} /> @shreevandanatours <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="reel-grid">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
      <p className="reel-disclaimer">
        Instagram may ask you to sign in to watch.
      </p>
    </section>
  );
}
