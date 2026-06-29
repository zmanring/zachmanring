import { useState, useEffect, useCallback } from 'react';
import { allPortfolioData, type PortfolioItem } from '../data/portfolio';
import { getItemZone, getAdjacentZone, type ZoneDef } from '../data/zones';

function itemsForZone(zone: ZoneDef): PortfolioItem[] {
  const byId = Object.fromEntries(allPortfolioData.map(i => [i.id, i]));
  return (zone.ids as readonly string[]).map(id => byId[id]).filter(Boolean) as PortfolioItem[];
}

export function useInfoCard() {
  const [zone, setZone]   = useState<ZoneDef | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [index, setIndex] = useState(0);

  const card = items.length > 0 ? items[index] : null;

  const loadZone = useCallback((z: ZoneDef, startIndex = 0) => {
    const zItems = itemsForZone(z);
    setZone(z);
    setItems(zItems);
    setIndex(Math.max(0, Math.min(startIndex, zItems.length - 1)));
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const item = (e as CustomEvent<PortfolioItem>).detail;
      const z = getItemZone(item.id);
      if (!(z.ids as readonly string[]).includes(item.id)) {
        // Item not in any zone (easter egg etc.) — standalone card, no zone nav
        setZone(null);
        setItems([item]);
        setIndex(0);
        return;
      }
      const zItems = itemsForZone(z);
      const idx = zItems.findIndex(i => i.id === item.id);
      loadZone(z, idx >= 0 ? idx : 0);
    };
    const onClose = () => {
      setZone(null);
      setItems([]);
      setIndex(0);
    };
    window.addEventListener('portfolio:openCard', onOpen);
    window.addEventListener('portfolio:closeCard', onClose);
    return () => {
      window.removeEventListener('portfolio:openCard', onOpen);
      window.removeEventListener('portfolio:closeCard', onClose);
    };
  }, [loadZone]);

  const close = useCallback(() => {
    setZone(null);
    setItems([]);
    setIndex(0);
    window.dispatchEvent(new CustomEvent('portfolio:requestCloseCard'));
  }, []);

  const next = useCallback(() => {
    if (index < items.length - 1) {
      setIndex(i => i + 1);
    } else if (zone) {
      // Cross into next zone
      loadZone(getAdjacentZone(zone.id, 'next'), 0);
    }
  }, [index, items.length, zone, loadZone]);

  const prev = useCallback(() => {
    if (index > 0) {
      setIndex(i => i - 1);
    } else if (zone) {
      // Cross into prev zone, land on last item
      const prevZone = getAdjacentZone(zone.id, 'prev');
      const prevItems = itemsForZone(prevZone);
      loadZone(prevZone, prevItems.length - 1);
    }
  }, [index, zone, loadZone]);

  return {
    card,
    zone,
    close,
    next,
    prev,
    currentIndex: index,
    total: items.length,
  };
}
