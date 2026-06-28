import { useState, useEffect } from 'react';

const FONT = '"Press Start 2P", monospace';
const ORANGE = '#DD4400';
const GREY = '#222222';

const LINKS = {
  podcast: 'https://pixelbroccoli.com',
  sgw:     'https://southerngingerworkshop.com',
  youtube: 'https://youtube.com/@southernginger',
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

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      style={{
        fontSize: 7, color: '#AAAAAA', fontFamily: FONT,
        textDecoration: 'none', padding: '3px 7px',
        border: '1px solid #444444',
        transition: 'color 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = ORANGE;
        el.style.borderColor = ORANGE;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = '#AAAAAA';
        el.style.borderColor = '#444444';
      }}
    >
      {label}
    </a>
  );
}

export function HUD({ onMenuClick }: { onMenuClick?: () => void }) {
  const [score, setScore] = useState(0);
  const [world, setWorld] = useState('PLAZA');
  const [subtitle, setSubtitle] = useState('TOWN');

  useEffect(() => {
    const onCoin = () => setScore(s => s + 200);
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

      {/* WORLD */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 7, color: '#666666' }}>WORLD</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#F0EDE8' }}>{world}</span>
          <span style={{ fontSize: 7, color: ORANGE }}>{subtitle}</span>
        </div>
      </div>

      {/* MENU button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <button
          onClick={onMenuClick}
          title="Portfolio Directory (M)"
          style={{
            fontSize: 8, color: '#F0EDE8', fontFamily: FONT,
            background: 'transparent', border: '2px solid #444444',
            padding: '6px 14px', cursor: 'pointer',
            whiteSpace: 'nowrap', transition: 'border-color 0.1s, color 0.1s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.borderColor = ORANGE;
            el.style.color = ORANGE;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.borderColor = '#444444';
            el.style.color = '#F0EDE8';
          }}
        >
          MENU
        </button>
        <span style={{ fontSize: 6, color: '#555555' }}>PRESS M</span>
      </div>

      {/* QUICK LINKS */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 7, color: '#666666' }}>FIND ME</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <NavLink href={LINKS.podcast} label="PODCAST" />
          <NavLink href={LINKS.sgw}     label="SGW" />
          <NavLink href={LINKS.youtube} label="YOUTUBE" />
        </div>
      </div>

      {/* LINKEDIN */}
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
  );
}
