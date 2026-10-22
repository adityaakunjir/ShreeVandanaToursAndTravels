'use client';
import { useState } from 'react';
import Link from 'next/link';
type Choice = {
  slug: string;
  name: string;
  country: string;
  duration: number;
  theme: string;
};
const moods = [
  ['', 'A little of everything'],
  ['romance', 'Romance'],
  ['mountain', 'Mountains'],
  ['pilgrimage', 'Sacred journeys'],
  ['coast', 'Beaches & islands'],
  ['culture', 'Culture'],
  ['adventure', 'Adventure'],
  ['wildlife', 'Wildlife'],
];
export default function DiscoveryPlayground({
  journeys,
}: {
  journeys: Choice[];
}) {
  const [mood, setMood] = useState('');
  const [length, setLength] = useState('');
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [turn, setTurn] = useState(0);
  const matches = journeys.filter(
    (t) =>
      (!mood || t.theme.toLowerCase().includes(mood)) &&
      (!length || t.duration <= Number(length)),
  );
  function surprise() {
    const pool = matches.filter((t) => t.slug !== chosen?.slug);
    const options = pool.length ? pool : matches;
    setChosen(options[Math.floor(Math.random() * options.length)] || null);
    setTurn((x) => x + 1);
  }
  return (
    <section className="section wrap discovery-playground">
      <div>
        <p className="eyebrow">A LITTLE SERENDIPITY</p>
        <h2>
          Find your travel mood.
          <br />
          <em>Leave room for surprise.</em>
        </h2>
        <p>
          Pick a feeling and a little time away. We’ll turn a page in the real
          journey collection.
        </p>
        <div className="mood-controls">
          <label htmlFor="journal-mood">
            What are you in the mood for?
            <select
              id="journal-mood"
              value={mood}
              onChange={(e) => {
                setMood(e.target.value);
                setChosen(null);
              }}
            >
              {moods.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="journal-time">
            How much time do you have?
            <select
              id="journal-time"
              value={length}
              onChange={(e) => {
                setLength(e.target.value);
                setChosen(null);
              }}
            >
              <option value="">I’m flexible</option>
              <option value="6">Up to 6 days</option>
              <option value="8">Up to 8 days</option>
              <option value="13">Up to 13 days</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          className="button"
          onClick={surprise}
          disabled={!matches.length}
        >
          Surprise me ↗
        </button>
        <p className="reel-disclaimer" role="status">
          {matches.length
            ? `${matches.length} matching outlines. ${chosen ? `Revealed: ${chosen.name}.` : ''}`
            : 'No outline matches these choices. Try more time or another mood.'}
        </p>
      </div>
      <div key={turn} className="surprise-postcard">
        <span className="journal-stamp">A POSTCARD FROM YOUR NEXT CHAPTER</span>
        <span className="postcard-mark" aria-hidden="true">
          ✳
        </span>
        {chosen ? (
          <>
            <p>
              {chosen.country} · {chosen.duration} days
            </p>
            <h3>{chosen.name}</h3>
            <p>{chosen.theme}</p>
            <Link className="text-link" href={`/tours/${chosen.slug}`}>
              Open this journey ↗
            </Link>
            <Link
              className="text-link"
              href={`/tours?style=${mood === 'mountain' ? 'mountains' : mood === 'coast' ? 'beaches' : mood}`}
            >
              Explore this mood ↗
            </Link>
          </>
        ) : (
          <>
            <h3>
              Somewhere you
              <br />
              <em>haven’t imagined yet.</em>
            </h3>
            <p>Tap Surprise me to reveal a real tour outline.</p>
            <Link className="text-link" href="/tours">
              Or browse every journey ↗
            </Link>
          </>
        )}
        <small>Quote on enquiry · no booking commitment</small>
      </div>
    </section>
  );
}
