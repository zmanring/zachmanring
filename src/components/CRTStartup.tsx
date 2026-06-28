import React, { useEffect, useState } from 'react';

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

const TIMINGS: Record<Phase, number> = {
  0: 200,   // brief black hold
  1: 300,   // line visible (thin)
  2: 600,   // line expands
  3: 500,   // glow settles
  4: 600,   // fade out
  5: 0,
};

const MESSAGES = [
  'FINDING ZACH...',
  'LOCATING ZACH...',
  'ASSEMBLING ZACH...',
  'CONSTRUCTING ZACH...',
  'LOADING PERSONALITY...',
  'CONTACTING ZACH...',
  'BUFFERING ZACH...',
  'DOWNLOADING ZACH...',
  'INITIALIZING ZACH...',
  'COMPILING OPINIONS...',
  'RENDERING ZACH...',
  'DEPLOYING ZACH...',
  'RETICULATING SPLINES...',
  'MAKING COFFEE...',
  'CALIBRATING VIBES...',
  'INSTALLING ZACH...',
  'ZACH NOT FOUND. RETRYING...',
  'ZACH FOUND!',
];

const FONT = '"Press Start 2P", monospace';

export function CRTStartup({ style }: { style?: React.CSSProperties }) {
  const [phase, setPhase]       = useState<Phase>(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [gameReady, setGameReady] = useState(false);

  // Listen for Phaser load complete
  useEffect(() => {
    const h = () => setGameReady(true);
    window.addEventListener('portfolio:ready', h);
    return () => window.removeEventListener('portfolio:ready', h);
  }, []);

  // Phase sequencer — holds at phase 3 until game is ready
  useEffect(() => {
    let p: Phase = 0;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      p = (p + 1) as Phase;
      setPhase(p);
      if (p < 5) t = setTimeout(next, TIMINGS[p]);
    };
    t = setTimeout(next, TIMINGS[0]);
    return () => clearTimeout(t);
  }, []);

  // Once game is ready AND we've reached phase 3, kick off the fade
  useEffect(() => {
    if (!gameReady || phase < 3) return;
    const t = setTimeout(() => setPhase(4), 200);
    const t2 = setTimeout(() => setPhase(5), 200 + TIMINGS[4]);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [gameReady, phase]);

  // Message cycler — runs while screen is visible (phases 2-3)
  useEffect(() => {
    if (phase < 2 || phase >= 4) return;
    const id = setInterval(() => {
      setMsgIndex(i => {
        const next = i + 1;
        if (next >= MESSAGES.length - 1) { clearInterval(id); return MESSAGES.length - 1; }
        return next;
      });
    }, 160);
    return () => clearInterval(id);
  }, [phase]);

  if (phase === 5) return null;

  const clipPath = phase <= 1
    ? 'inset(calc(50% - 2px) 0px calc(50% - 2px) 0px)'
    : 'inset(0px 0px 0px 0px)';

  const brightness = phase <= 1 ? 8 : phase === 2 ? 2.5 : phase === 3 ? 1.3 : 1;
  const outerOpacity = phase === 4 ? 0 : 1;
  const showText = phase >= 2 && phase < 4;

  return (
    <div style={{
      position: 'absolute',
      pointerEvents: 'none',
      ...style,
      transition: phase === 4 ? `opacity ${TIMINGS[4]}ms ease-in` : 'none',
      opacity: outerOpacity,
    }}>
      {/* Black background */}
      <div style={{ position: 'absolute', inset: 0, background: '#000' }} />

      {/* Expanding phosphor screen */}
      {phase >= 1 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #b0ffb0 0%, #e8ffe8 30%, #e8ffe8 70%, #b0ffb0 100%)',
          clipPath,
          filter: `brightness(${brightness})`,
          transition: [
            phase >= 2 ? `clip-path ${TIMINGS[2]}ms cubic-bezier(0.16, 1, 0.3, 1)` : '',
            `filter ${TIMINGS[3]}ms ease`,
          ].filter(Boolean).join(', '),
        }} />
      )}

      {/* Loading messages — appear once screen has expanded */}
      {showText && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 16,
        }}>
          <div style={{
            fontFamily: FONT,
            fontSize: 'clamp(7px, 1.2vw, 11px)',
            color: '#1a6e1a',
            letterSpacing: '0.05em',
            textShadow: '0 0 8px rgba(0,180,0,0.6)',
            whiteSpace: 'nowrap',
            animation: 'crt-msg-in 0.08s ease',
          }}>
            {MESSAGES[msgIndex]}
          </div>
          {/* Blinking cursor */}
          <div style={{
            width: 10, height: 16,
            background: '#1a6e1a',
            animation: 'crt-blink 0.5s steps(1) infinite',
            boxShadow: '0 0 6px rgba(0,180,0,0.8)',
          }} />
        </div>
      )}
    </div>
  );
}
