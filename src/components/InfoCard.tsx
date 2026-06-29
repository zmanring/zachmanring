import { useEffect, useRef } from 'react';
import type { PortfolioItem } from '../data/portfolio';
import { trackEvent } from '../analytics';

interface Props {
  item: PortfolioItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onMenu?: () => void;
  zoneColor?: string;
  zoneName?: string;
  currentIndex: number;
  total: number;
}

const FONT = '"Press Start 2P", monospace';
const GREY = '#222222';

const typeLabel: Record<PortfolioItem['type'], string> = {
  info:           '// INFO',
  'case-study':   '// CASE STUDY',
  project:        '// PROJECT',
  podcast:        '// PODCAST',
  article:        '// ARTICLE',
};

// Returns true if the color is bright enough that white text would be hard to read
function isLight(hex: string): boolean {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8)  & 0xff;
  const b =  n        & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55;
}

function darken(hex: string): string {
  // Produce a darker shadow color from the accent
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (n >> 16) - 80);
  const g = Math.max(0, ((n >> 8) & 0xff) - 80);
  const b = Math.max(0, (n & 0xff) - 80);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function NavBtn({
  onClick, disabled, children, color, shadow,
}: {
  onClick: () => void; disabled: boolean; children: string;
  color: string; shadow: string;
}) {
  const press   = (el: HTMLElement) => { el.style.boxShadow = `1px 1px 0 ${shadow}`; el.style.transform = 'translate(2px,2px)'; };
  const release = (el: HTMLElement) => { el.style.boxShadow = `3px 3px 0 ${shadow}`; el.style.transform = ''; };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: GREY,
        border: `2px solid ${disabled ? '#444' : color}`,
        color: disabled ? '#666' : '#F0EDE8',
        fontFamily: FONT, fontSize: 11,
        padding: '8px 16px',
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: disabled ? 'none' : `3px 3px 0 ${shadow}`,
        transition: 'box-shadow 0.08s, transform 0.08s',
      }}
      onMouseEnter={e => { if (!disabled) press(e.currentTarget as HTMLElement); }}
      onMouseLeave={e => { if (!disabled) release(e.currentTarget as HTMLElement); }}
      onFocus={e => { if (!disabled) press(e.currentTarget as HTMLElement); }}
      onBlur={e => { if (!disabled) release(e.currentTarget as HTMLElement); }}
    >
      {children}
    </button>
  );
}

export function InfoCard({
  item, onClose, onNext, onPrev, onMenu,
  zoneColor = '#DD4400', zoneName,
  currentIndex, total,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shadow  = darken(zoneColor);
  const light   = isLight(zoneColor);
  const btnBg   = light ? '#222222' : zoneColor;
  const btnText = light ? zoneColor  : '#F0EDE8';

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowRight')  onNext();
      if (e.key === 'ArrowLeft')   onPrev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, onNext, onPrev]);

  useEffect(() => { cardRef.current?.focus(); }, [item]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        card.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    card.addEventListener('keydown', trap);
    return () => card.removeEventListener('keydown', trap);
  }, [item]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.82)',
        animation: 'fadeIn 0.12s ease',
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="infocard-title"
        tabIndex={-1}
        style={{
          background: GREY,
          border: `3px solid ${zoneColor}`,
          boxShadow: `6px 6px 0 ${zoneColor}`,
          padding: '28px 32px 32px',
          maxWidth: 620,
          width: '90vw',
          maxHeight: '82vh',
          overflowY: 'auto',
          fontFamily: FONT,
          outline: 'none',
          position: 'relative',
          animation: 'slideUp 0.15s ease',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Zone label + type */}
        <div style={{ fontSize: 10, color: zoneColor, marginBottom: item.tags?.length ? 10 : 16, letterSpacing: '0.05em' }}>
          {zoneName && (
            <span style={{ marginRight: 12 }}>{zoneName}</span>
          )}
          {typeLabel[item.type]}
        </div>

        {/* Tags */}
        {!!item.tags?.length && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {item.tags.map(t => (
              <span key={t} style={{
                background: '#333', padding: '2px 8px',
                fontSize: 8, color: '#AAAAAA', fontFamily: FONT,
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Photo (optional) */}
        {item.image && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <img
              src={item.image}
              alt="Zach Manring"
              style={{
                width: 100, height: 100,
                borderRadius: '50%',
                border: `3px solid ${zoneColor}`,
                boxShadow: `0 0 0 3px ${zoneColor}44`,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* Title */}
        <h2 id="infocard-title" style={{
          fontSize: 16, color: '#F0EDE8', margin: '0 0 16px',
          lineHeight: 1.8, fontFamily: FONT,
        }}>
          {item.title}
        </h2>

        {/* Short desc */}
        <p style={{
          fontSize: 11, color: '#AAAAAA', margin: '0 0 20px',
          lineHeight: 2.2, fontFamily: FONT,
        }}>
          {item.shortDesc}
        </p>

        {/* Pixel divider — zone color */}
        <div style={{
          height: 3, marginBottom: 20,
          background: `repeating-linear-gradient(90deg, ${zoneColor} 0 6px, transparent 6px 12px)`,
        }} />

        {/* Long desc */}
        <p style={{
          fontSize: 11, color: '#CCCCCC', lineHeight: 2.4,
          whiteSpace: 'pre-wrap', fontFamily: FONT, margin: 0,
        }}>
          {item.longDesc}
        </p>

        {/* CTA */}
        {item.link && (
          <a
            href={item.link}
            target={item.link.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={() => trackEvent('cta_click', { item_id: item.id, item_title: item.title, link_url: item.link as string })}
            style={{
              display: 'inline-block', marginTop: 24,
              padding: '12px 24px',
              background: btnBg, color: btnText,
              textDecoration: 'none', fontSize: 11, fontFamily: FONT,
              boxShadow: `4px 4px 0 ${shadow}`,
              transition: 'box-shadow 0.08s, transform 0.08s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = `1px 1px 0 ${shadow}`;
              el.style.transform = 'translate(3px,3px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = `4px 4px 0 ${shadow}`;
              el.style.transform = '';
            }}
          >
            {item.linkLabel ?? '> GO'}
          </a>
        )}

        {/* Prev / counter / Next */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginTop: 28,
          borderTop: '2px solid #333', paddingTop: 20,
        }}>
          <NavBtn onClick={onPrev} disabled={false} color={zoneColor} shadow={shadow}>
            {'< PREV'}
          </NavBtn>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 9, color: '#999999' }}>
            {currentIndex + 1} / {total}
          </span>
          <NavBtn onClick={onNext} disabled={false} color={zoneColor} shadow={shadow}>
            {'NEXT >'}
          </NavBtn>
        </div>

        {/* Close + Menu */}
        <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 6 }}>
          {onMenu && (
            <button
              onClick={onMenu}
              aria-label="Back to directory"
              title="Back to menu"
              style={{
                background: 'transparent', border: '2px solid #444',
                color: '#AAAAAA', fontSize: 8, fontFamily: FONT,
                cursor: 'pointer', padding: '4px 8px', lineHeight: 1,
                transition: 'border-color 0.1s, color 0.1s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = zoneColor;
                el.style.color = zoneColor;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#444';
                el.style.color = '#AAAAAA';
              }}
            >
              {'< MENU'}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: btnBg, border: 'none',
              color: btnText, fontSize: 13, fontFamily: FONT,
              cursor: 'pointer', padding: '4px 9px', lineHeight: 1,
            }}
          >
            X
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(10px);opacity:0 } to { transform:none;opacity:1 } }
      `}</style>
    </div>
  );
}
