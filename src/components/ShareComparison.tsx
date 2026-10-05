'use client';
import { useState } from 'react';
export default function ShareComparison() {
  const [status, setStatus] = useState('');
  return (
    <div>
      <button
        type="button"
        className="text-link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setStatus('Comparison link copied.');
          } catch {
            setStatus(
              'Copy the page address from your browser to share this comparison.',
            );
          }
        }}
      >
        Copy comparison link ↗
      </button>
      <p className="share-status" role="status">
        {status}
      </p>
    </div>
  );
}
