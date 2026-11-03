'use client';
import { Plane } from 'lucide-react';
import { useLinkStatus } from 'next/link';
import { createPortal } from 'react-dom';

/** Feedback follows actual link pending state and never gates server content. */
export default function NavigationHint() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return createPortal(
    <div className="journey-loading" role="status" aria-live="polite">
      <div className="journey-loading-mark" aria-hidden="true">
        <span className="journey-loading-route" />
        <Plane size={26} strokeWidth={1.5} />
      </div>
      <p>
        Good things ahead<span aria-hidden="true">.</span>
      </p>
      <span className="visually-hidden">Loading your next page</span>
    </div>, document.body
  );
}
