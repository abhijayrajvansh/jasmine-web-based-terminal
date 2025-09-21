'use client';

import { useEffect } from 'react';

const CSS_VARIABLE = '--app-viewport-height';

export default function ViewportHeight() {
  useEffect(() => {
    const root = document.documentElement;

    const updateHeight = () => {
      root.style.setProperty(CSS_VARIABLE, `${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return null;
}
