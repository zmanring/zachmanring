import { useState, useEffect } from 'react';

const FONT = '"Press Start 2P", monospace';
const ORANGE = '#DD4400';
const GREY = '#222222';
const MAX_SCORE = 4600; // 23 NPCs × 200pts

const LINKS = {
  contact: 'https://linkedin.com/in/zachmanring',
};

const WORLD_NAMES: Record<string, string> = {
  PLAZA:    'PLAZA',
  WORKSHOP: 'S.G.W.',
  STUDIO:   'P.B.',
  OFFICE:   'DS',
  PROJECTS: 'CODE',
  CHURCH:   'CHURCH',
};

const WORLD_SUBTITLES: Record<string, string> = {
  PLAZA:    'TOWN',
  WORKSHOP: 'WORKSHOP',
  STUDIO:   'PODCAST',
  OFFICE:   'DESIGN SYS',
  PROJECTS: 'LAB',
  CHURCH:   'COMMUNITY',
};


export function HUD({ onMenuClick }: { onMenuClick?: () => void }) {
  const [score, setScore] = useState(0);
  const [world, setWorld] = useState('PLAZA');
  const [subtitle, setSubtitle] = useState('TOWN');
  const [showMaxScore, setShowMaxScore] = useState(false);

  useEffect(() => {
    const onCoin = () => setScore(s => {
      const next = s + 200;
      if (next === MAX_SCORE) setTimeout(() => setShowMaxScore(true), 600);
      return next;
    });
    const onLevel = (e: Event) => {
      const scene = (e as CustomEvent<string>).detail;
      setWorld(WORLD_NAMES[scene] ?? scene);
      setSubtitle(WORLD_SUBTITLES[scene] ?? '');
    };
    window.addEventListener('portfolio:coinCollect', onCoin);
    window.addEventListener('portfolio:levelComplete', onLevel);
    return () => {
      window.removeEventListener('portfolio:coinCollect', onCoin);
      window.removeEventListener('portfolio:levelComplete', onLevel);
    };
  }, []);

  const pad = (n: number, len: number) => String(n).padStart(len, '0');

  return (
    <>
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 72,
      background: GREY,
      borderBottom: `4px solid ${ORANGE}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 500,
      fontFamily: FONT,
      boxSizing: 'border-box',
      userSelect: 'none',
      gap: 16,
    }}>

      {/* LEFT — Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <img
          src="/assets/zach.jpg"
          alt="Zach Manring"
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            border: `2px solid ${ORANGE}`,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 9, color: '#F0EDE8', letterSpacing: '0.04em' }}>ZACH MANRING</span>
          <span style={{ fontSize: 7, color: ORANGE }}>
            {pad(score, 6)} PTS
          </span>
        </div>
      </div>

      {/* WORLD — centered */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 7, color: '#999999' }}>WORLD</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#F0EDE8', transition: 'opacity 0.3s' }}>{world}</span>
          <span style={{ fontSize: 7, color: ORANGE, transition: 'opacity 0.3s' }}>{subtitle}</span>
        </div>
      </div>

      {/* RIGHT — Menu + LinkedIn */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button
          onClick={onMenuClick}
          title="Portfolio Directory (M)"
          style={{
            fontSize: 8, color: '#F0EDE8', fontFamily: FONT,
            background: '#333333', border: 'none',
            padding: '8px 14px', cursor: 'pointer',
            boxShadow: '3px 3px 0 #111111',
            whiteSpace: 'nowrap', transition: 'box-shadow 0.08s, transform 0.08s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.boxShadow = '1px 1px 0 #111111';
            el.style.transform = 'translate(2px,2px)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.boxShadow = '3px 3px 0 #111111';
            el.style.transform = '';
          }}
        >
          MENU (M)
        </button>

        <a
        href={LINKS.contact}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 8, color: '#F0EDE8', fontFamily: FONT,
          textDecoration: 'none', padding: '8px 14px',
          background: ORANGE,
          boxShadow: '3px 3px 0 #7A2600',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'box-shadow 0.08s, transform 0.08s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = '1px 1px 0 #7A2600';
          el.style.transform = 'translate(2px,2px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = '3px 3px 0 #7A2600';
          el.style.transform = '';
        }}
      >
        LINKEDIN
        </a>
      </div>
    </div>

    {/* Max score easter egg */}

    {showMaxScore && (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{
          background: GREY, border: `4px solid ${ORANGE}`,
          boxShadow: `8px 8px 0 #7A2600`,
          padding: '40px 48px', maxWidth: 480, textAlign: 'center',
          fontFamily: FONT, animation: 'slideUp 0.4s ease',
        }}>
          <div style={{ fontSize: 28, marginBottom: 20 }}>🏆</div>
          <div style={{ fontSize: 10, color: ORANGE, marginBottom: 20, letterSpacing: '0.05em' }}>
            MAX SCORE!
          </div>
          <p style={{ fontSize: 8, color: '#F0EDE8', lineHeight: 2.4, margin: '0 0 12px' }}>
            WOW. YOU READ EVERYTHING.
          </p>
          <p style={{ fontSize: 8, color: '#AAAAAA', lineHeight: 2.4, margin: '0 0 32px' }}>
            YOU OFFICIALLY KNOW MORE ABOUT ZACH
            THAN MOST PEOPLE WHO HAVE MET HIM.
            MAYBE IT'S TIME TO SAY HI?
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a
              href="https://linkedin.com/in/zachmanring"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 8, color: '#F0EDE8', fontFamily: FONT,
                textDecoration: 'none', padding: '10px 18px',
                background: ORANGE, boxShadow: `3px 3px 0 #7A2600`,
                transition: 'box-shadow 0.08s, transform 0.08s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '1px 1px 0 #7A2600'; el.style.transform = 'translate(2px,2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '3px 3px 0 #7A2600'; el.style.transform = ''; }}
            >
              SAY HI ON LINKEDIN
            </a>
            <button
              onClick={() => setShowMaxScore(false)}
              style={{
                fontSize: 8, color: '#F0EDE8', fontFamily: FONT,
                background: '#333', border: 'none', padding: '10px 18px',
                cursor: 'pointer', boxShadow: '3px 3px 0 #111',
                transition: 'box-shadow 0.08s, transform 0.08s',
              }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = '1px 1px 0 #111'; el.style.transform = 'translate(2px,2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = '3px 3px 0 #111'; el.style.transform = ''; }}
            >
              KEEP EXPLORING
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
