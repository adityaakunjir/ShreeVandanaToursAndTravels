'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const targets =
  '.section-heading, .brochure-tour-card, .travel-style-card, .world-card, .story-content, .atlas-grid > a, .why-list > *, .home-photo-triptych > *, .curated-cta, .route-preview li, .service-detail, .legacy-principles > *, .photo-tile';

/** Content stays visible before hydration, with JavaScript off, and on failure. */
export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (
      connection?.saveData ||
      /(^|-)2g$/.test(connection?.effectiveType || '')
    )
      return;
    const seen = new WeakSet<Element>();
    const running = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          const direction = entry.target.matches(
            '.route-preview li, .legacy-principles > *',
          )
            ? '-14px 0'
            : entry.target.matches('.story-content, .service-detail')
              ? '12px 16px'
              : '0 18px';
          const animation = entry.target.animate(
            [
              { opacity: 0.35, translate: direction },
              { opacity: 1, translate: '0 0' },
            ],
            {
              duration: 460,
              delay: Math.min(order++, 3) * 45,
              easing: 'cubic-bezier(.22,1,.36,1)',
            },
          );
          running.add(animation);
          animation.onfinish = () => running.delete(animation);
        }
      },
      { threshold: 0.08 },
    );
    const register = () => {
      root.querySelectorAll(targets).forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        // Leave above-the-fold content and restored scroll positions untouched.
        if (element.getBoundingClientRect().top >= window.innerHeight) {
          observer.observe(element);
        }
      });
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    const stop = () => {
      if (preference.matches) {
        running.forEach((animation) => animation.cancel());
        running.clear();
      }
    };
    preference.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      preference.removeEventListener('change', stop);
      running.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return null;
}
