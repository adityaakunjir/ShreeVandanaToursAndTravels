import { ArrowUpRight, Video } from 'lucide-react';

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
        <iframe
          src={`https://www.instagram.com/reel/${reel.id}/embed/`}
          title={`Instagram reel: ${reel.title}`}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
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
          <p className="eyebrow">OUR JOURNEYS, IN MOTION</p>
          <h2>
            Little moments.
            <br />
            <em>Big memories.</em>
          </h2>
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
        Selected reels from our Instagram page. If a reel doesn’t load, open it
        on Instagram. Instagram may require sign-in.
      </p>
    </section>
  );
}
