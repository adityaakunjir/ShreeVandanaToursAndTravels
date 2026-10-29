import Link from 'next/link';
import type { DestinationClip } from '@/lib/destination-videos';
export default function VideoCredit({ clip }: { clip: DestinationClip }) {
  return (
    <Link className="video-credit" href={`/photo-credits#video-${clip.id}`}>
      Scenic footage: {clip.label} · Credits & licence
    </Link>
  );
}
