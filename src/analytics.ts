type GTagFn = (...args: unknown[]) => void;

function _gtag(...args: unknown[]) {
  const g = (window as unknown as { gtag?: GTagFn }).gtag;
  if (typeof g === 'function') g(...args);
}

export function trackEvent(name: string, params?: Record<string, string | number>) {
  _gtag('event', name, params);
}
