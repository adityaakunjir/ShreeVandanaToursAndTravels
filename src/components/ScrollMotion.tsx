'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './destination-atlas.css';

export default function ScrollMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.getElementById('main-content');
    if (!root) return;
    const html = document.documentElement;
    let generation = 0;
    let cleanup: (() => void) | undefined;

    const sync = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (html.dataset.experience !== 'rich' || html.dataset.motionPaused === 'true') return;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'),
      ]);
      if (generation !== current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const atlas = root.querySelector('.atlas-fold');
        if (atlas && matchMedia('(min-width:1050px)').matches) {
          gsap.to(atlas, { rotationY: 12, rotationZ: -3, yPercent: 16, ease: 'none',
            scrollTrigger: { trigger: '.home-hero-fullscreen', start: 'top top', end: 'bottom top', scrub: .45 },
          });
        }
        for (const section of root.querySelectorAll('.section-heading, .package-panel, .editorial-intro-layout, .service-detail, .route-preview, .home-discovery, .curated-cta')) {
          if (section.getBoundingClientRect().top < innerHeight) continue;
          gsap.from(section, { y: 16, duration: .48, ease: 'power2.out', immediateRender: false,
            scrollTrigger: { trigger: section, start: 'top 96%', once: true },
          });
        }
      }, root);
      cleanup = () => context.revert();
    };
    const refresh = () => { void sync().catch(() => {}); };
    const observer = new MutationObserver(refresh);
    observer.observe(html, { attributes: true, attributeFilter: ['data-experience','data-motion-paused'] });
    refresh();
    return () => { generation++; observer.disconnect(); cleanup?.(); };
  }, [pathname]);
  return null;
}
