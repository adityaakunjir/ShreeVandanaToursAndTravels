import type { Metadata } from 'next';
import photos from '@/data/tour-photos.json';
export const metadata: Metadata = {
  title: 'Destination photo credits',
  alternates: { canonical: '/photo-credits' },
};
export default function PhotoCredits() {
  return (
    <main className="wrap">
      <div className="page-intro">
        <p className="eyebrow">The places that inspire us</p>
        <h1>Photography credits.</h1>
        <p>
          Destination photographs illustrate the places visited. They do not
          represent specific hotels or guaranteed tour arrangements.
        </p>
      </div>
      <div className="photo-credit-list">
        {photos.map((photo) => (
          <article id={photo.slug} key={photo.slug}>
            <h2>{photo.alt}</h2>
            <p>
              Photograph by {photo.author}.{' '}
              <a href={photo.source} target="_blank" rel="noopener noreferrer">
                Original photograph on Wikimedia Commons
              </a>
              .
            </p>
            <p>
              Licensed under{' '}
              <a
                href={photo.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photo.license}
              </a>
              . {photo.changes} The adapted photograph retains its original
              licence.
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
