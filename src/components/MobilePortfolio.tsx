import { allPortfolioData, type PortfolioItem } from '../data/portfolio';
import { ZONE_DEFS } from '../data/zones';
import { InfoCard } from './InfoCard';
import { useInfoCard } from '../hooks/useInfoCard';
import { useState, useEffect } from 'react';

const FONT   = '"Press Start 2P", monospace';
const ORANGE = '#DD4400';

const LINKS = [
  { label: 'PODCAST',   href: 'https://pixelbroccoli.com' },
  { label: 'WORKSHOP',  href: 'https://southerngingerworkshop.com' },
  { label: 'YOUTUBE',   href: 'https://youtube.com/@southernginger' },
  { label: 'GITHUB',    href: 'https://github.com/zmanring' },
];

function ZoneSection({ zone, itemById, onOpen }: {
  zone: typeof ZONE_DEFS[number];
  itemById: Record<string, PortfolioItem>;
  onOpen: (item: PortfolioItem) => void;
}) {
  const [open, setOpen] = useState(true);
  const items = (zone.ids as readonly string[]).map(id => itemById[id]).filter(Boolean) as PortfolioItem[];
  if (!items.length) return null;

  return (
    <section style={{ marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: zone.color + '22',
          border: `2px solid ${zone.color}`,
          borderBottom: open ? 'none' : `2px solid ${zone.color}`,
          padding: '12px 16px',
          cursor: 'pointer',
          fontFamily: FONT, fontSize: 9, color: zone.color,
          letterSpacing: '0.04em',
        }}
      >
        {zone.name}
        <span style={{ fontSize: 11, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ background: zone.bg, border: `2px solid ${zone.color}`, borderTop: 'none' }}>
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => onOpen(item)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none',
                borderBottom: idx < items.length - 1 ? '1px solid #1E1E1E' : 'none',
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}
            >
              <span style={{ fontFamily: FONT, fontSize: 8, color: '#F0EDE8', lineHeight: 1.8 }}>
                {item.title}
              </span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                {item.shortDesc}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export function MobilePortfolio() {
  const itemById = Object.fromEntries(allPortfolioData.map(i => [i.id, i]));
  const { card, zone, close, next, prev, currentIndex, total } = useInfoCard();

  // index.html locks overflow:hidden for the game — unlock it on mobile
  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const openItem = (item: PortfolioItem) => {
    window.dispatchEvent(new CustomEvent('portfolio:openCard', { detail: item }));
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#111111',
      color: '#F0EDE8',
      fontFamily: FONT,
      paddingBottom: 80,
    }}>

      {/* Header */}
      <header style={{
        background: '#222222',
        borderBottom: `4px solid ${ORANGE}`,
        padding: '24px 20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <img
            src="/assets/zach.jpg"
            alt="Zach Manring"
            style={{
              width: 52, height: 52, borderRadius: '50%',
              border: `2px solid ${ORANGE}`, objectFit: 'cover', flexShrink: 0,
            }}
          />
          <div>
            <div style={{ fontSize: 7, color: ORANGE, marginBottom: 6, letterSpacing: '0.08em' }}>
              // PORTFOLIO
            </div>
            <h1 style={{ fontFamily: FONT, fontSize: 16, color: '#F0EDE8', margin: 0, lineHeight: 1.6 }}>
              ZACH MANRING
            </h1>
          </div>
        </div>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: '#AAAAAA', margin: 0, lineHeight: 1.6 }}>
          Design Systems Architect · Front-End Engineer · Atlanta, GA
        </p>
        <p style={{ marginTop: 10, fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#666', lineHeight: 1.5 }}>
          25+ years building for the web. Also: basement workshop, podcast, maker.
        </p>
        <div style={{
          marginTop: 14, padding: '8px 12px',
          border: '1px solid #333', background: '#1A1A1A',
          fontFamily: FONT, fontSize: 7, color: '#555', lineHeight: 1.8,
        }}>
          ★ full interactive experience on desktop
        </div>
      </header>

      {/* Zones */}
      <main style={{ padding: '20px 16px 0' }}>
        {ZONE_DEFS.map(zone => (
          <ZoneSection key={zone.id} zone={zone} itemById={itemById} onOpen={openItem} />
        ))}
      </main>

      {/* Sticky footer */}
      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#222222',
        borderTop: `3px solid ${ORANGE}`,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 8,
        overflowX: 'auto',
        zIndex: 100,
      }}>
        {LINKS.map(l => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT, fontSize: 7,
              color: '#AAAAAA', textDecoration: 'none',
              border: '1px solid #444', padding: '6px 10px',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://linkedin.com/in/zachmanring"
          style={{
            fontFamily: FONT, fontSize: 7,
            color: '#F0EDE8', textDecoration: 'none',
            background: ORANGE, padding: '6px 10px',
            whiteSpace: 'nowrap', flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          LINKEDIN →
        </a>
      </footer>

      {card && (
        <InfoCard
          item={card}
          onClose={close}
          onNext={next}
          onPrev={prev}
          zoneColor={zone?.color}
          zoneName={zone?.name}
          currentIndex={currentIndex}
          total={total}
        />
      )}
    </div>
  );
}
