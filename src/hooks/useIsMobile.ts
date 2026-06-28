import { useState, useEffect } from 'react';

/**
 * Returns true when the visitor is on a touch-primary or narrow-viewport device.
 * We show the mobile portfolio view instead of the game in this case.
 */
export function useIsMobile(): boolean {
  const check = () =>
    window.matchMedia('(max-width: 768px)').matches ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const [isMobile, setIsMobile] = useState(check);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = () => setIsMobile(check());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
