import { ArrowUpRight, Star } from 'lucide-react';
import { googleBusiness } from '@/data/google-business';

const reviews = [
  { name: 'Pooja Khamkar', quote: 'The itinerary was well planned' },
  {
    name: 'Atharva Kothare',
    quote: 'the tour guides were knowledgeable and friendly',
  },
  { name: 'Vikas Renuse', quote: 'well-planned itinerary' },
];

export default function GoogleReviews() {
  return (
    <section className="section wrap" id="reviews">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FROM OUR TRAVELLERS</p>
          <h2>
            Stories shared.
            <br />
            <em>Trust earned.</em>
          </h2>
        </div>
        <a
          className="text-link"
          href={googleBusiness.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Star size={18} /> {googleBusiness.rating} / 5 ·{' '}
          {googleBusiness.reviewCount} Google reviews <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <p className="review-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <blockquote>“{review.quote}”</blockquote>
            <strong>{review.name}</strong>
            <a
              href={googleBusiness.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on Google Maps <ArrowUpRight size={14} />
            </a>
          </article>
        ))}
      </div>
      <p className="reel-disclaimer">
        Three selected Google review excerpts. Rating and review count checked{' '}
        {googleBusiness.checked}; this is a snapshot, not a live feed.
      </p>
    </section>
  );
}
