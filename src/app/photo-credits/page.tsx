import type { Metadata } from 'next';
import photos from '@/data/tour-photos.json';
import { destinationVideos } from '@/lib/destination-videos';
export const metadata: Metadata = {
  title: 'Destination photography and video credits',
  alternates: { canonical: '/photo-credits' },
};
export default function PhotoCredits() {
  return (
    <main className="wrap">
      <div className="page-intro">
        <p className="eyebrow">The places that inspire us</p>
        <h1>Photography & video credits.</h1>
        <p>
          Destination photographs illustrate the places visited. They do not
          represent specific hotels or guaranteed tour arrangements.
        </p>
      </div>
      <div className="photo-credit-list">
        {destinationVideos.map((clip) => (
          <article id={`video-${clip.id}`} key={clip.id}>
            <h2>{clip.label} — scenic video</h2>
            <p>
              Eight separately credited source clips, each edited to five
              seconds. Montage licensed under{' '}
              <a
                href={clip.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {clip.license}
              </a>
              . Source and licence checked {clip.checked}.
            </p>
            <p>
              Adapted into a {clip.duration}-second silent montage; eight
              five-second clips are trimmed, proportionally cropped, resized,
              converted to 30fps and joined with cuts. Delivered as MP4 and
              WebM. Display may crop to fit the page. This footage illustrates
              the location; it does not represent our customers or guarantee a
              particular excursion.
            </p>
            {clip.license === 'CC BY-SA 4.0' && (
              <p>
                The adapted Sikkim footage and extracted poster are also
                licensed CC BY-SA 4.0.{' '}
                <a href={`/assets/videos/${clip.assetBase}-desktop.mp4`}>
                  Adapted MP4
                </a>{' '}
                ·{' '}
                <a href={`/assets/videos/${clip.assetBase}-desktop.webm`}>
                  Adapted WebM
                </a>
                .
              </p>
            )}
            <details className="montage-shot-credits">
              <summary>View all eight source clips and creator credits</summary>
              <ol>
                {clip.shots.map((shot, index) => (
                  <li key={shot.id}>
                    <strong>
                      {String(index * 5).padStart(2, '0')}–
                      {String((index + 1) * 5).padStart(2, '0')} seconds:{' '}
                      {shot.label}
                    </strong>
                    <p>
                      By {shot.author}.{' '}
                      <a
                        href={shot.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Original source clip
                      </a>{' '}
                      ·{' '}
                      <a
                        href={shot.licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {shot.license}
                      </a>
                      . Licence checked {shot.checked}. A five-second excerpt is
                      cropped, resized, silenced and joined into this montage.
                    </p>
                  </li>
                ))}
              </ol>
            </details>
          </article>
        ))}
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
