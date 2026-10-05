'use client';
import { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';

export default function ShareTour() {
  const [status, setStatus] = useState('');
  return (
    <div className="share-tour">
      <button
        type="button"
        className="text-link"
        onClick={async () => {
          try {
            const url = new URL(window.location.href);
            url.search = '';
            url.hash = '';
            await navigator.clipboard.writeText(url.href);
            setStatus('Tour link copied.');
          } catch {
            setStatus(
              'Copy the page address from your browser to share this tour.',
            );
          }
        }}
      >
        <LinkIcon size={17} /> Copy tour link
      </button>
      <span className="share-status" role="status">
        {status}
      </span>
    </div>
  );
}
