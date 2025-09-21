'use client';

import { useEffect } from 'react';

const CSS_VARIABLE = '--app-viewport-height';

export default function ViewportHeight() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const writeHeight = () => {
      raf = 0;
      try {
        const vv = window.visualViewport;
        const height = vv ? vv.height : window.innerHeight;
        root.style.setProperty(CSS_VARIABLE, `${height}px`);
      } catch {
        root.style.setProperty(CSS_VARIABLE, `${window.innerHeight}px`);
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(writeHeight);
    };

    schedule();

    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);

    const vv = window.visualViewport;
    vv?.addEventListener('resize', schedule);
    vv?.addEventListener('scroll', schedule);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      vv?.removeEventListener('resize', schedule);
      vv?.removeEventListener('scroll', schedule);
    };
  }, []);

  return null;
}
