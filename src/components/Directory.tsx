import { useEffect } from 'react';
import { allPortfolioData, type PortfolioItem } from '../data/portfolio';
import { ZONE_DEFS } from '../data/zones';

const FONT = '"Press Start 2P", monospace';
const ORANGE = '#DD4400';

interface Props {
  onClose: () => void;
}

export function Directory({ onClose }: Props) {
  const itemById = Object.fromEntries(allPortfolioData.map(i => [i.id, i]));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const openItem = (item: PortfolioItem) => {
    // Don't close — InfoCard (z:9999) stacks on top of Directory (z:9998).
    // ESC from InfoCard returns here; ESC from Directory closes everything.
    window.dispatchEvent(new CustomEvent('portfolio:openCard', { detail: item }));
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.94)',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '36px 24px 64px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 36,
        }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 9, color: ORANGE, marginBottom: 10, letterSpacing: '0.06em' }}>
              // PORTFOLIO DIRECTORY
            </div>
            <div style={{ fontFamily: FONT, fontSize: 20, color: '#F0EDE8', lineHeight: 1.6 }}>
              ZACH MANRING
            </div>
            <div style={{ fontFamily: FONT, fontSize: 8, color: '#888', marginTop: 8 }}>
              CLICK ANY ITEM TO READ · ESC TO CLOSE CARD · ESC AGAIN TO CLOSE MENU
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close directory"
            style={{
              background: ORANGE, border: 'none', flexShrink: 0,
              color: '#F0EDE8', fontFamily: FONT, fontSize: 13,
              cursor: 'pointer', padding: '6px 12px', lineHeight: 1,
              boxShadow: '3px 3px 0 #7A2600',
            }}
          >
            X
          </button>
        </div>

        {/* Zone grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: 20,
        }}>
          {ZONE_DEFS.map(zone => {
            const items = (zone.ids as readonly string[]).map(id => itemById[id]).filter(Boolean) as PortfolioItem[];
            return (
              <div key={zone.id} style={{
                background: zone.bg,
                border: `2px solid ${zone.color}`,
                boxShadow: `4px 4px 0 ${zone.color}55`,
                display: 'flex', flexDirection: 'column',
              }}>
                {/* Zone header */}
                <div style={{
                  background: zone.color + '28',
                  borderBottom: `2px solid ${zone.color}`,
                  padding: '12px 18px',
                  display: 'flex', alignItems: 'baseline', gap: 10,
                }}>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: zone.color }}>
                    {zone.name}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: 7, color: '#666' }}>
                    {zone.sub}
                  </span>
                </div>

                {/* Items */}
                <div>
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => openItem(item)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        background: 'transparent', border: 'none',
                        borderBottom: idx < items.length - 1 ? '1px solid #1E1E1E' : 'none',
                        padding: '12px 18px',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = zone.color + '1A';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <div style={{
                        fontFamily: FONT, fontSize: 8, color: '#F0EDE8',
                        marginBottom: 5, lineHeight: 1.8,
                      }}>
                        {item.title}
                      </div>
                      <div style={{
                        fontFamily: 'system-ui, sans-serif', fontSize: 12,
                        color: '#777', lineHeight: 1.5,
                      }}>
                        {item.shortDesc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
