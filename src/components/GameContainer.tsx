import { useRef, useState, useEffect, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { useInfoCard } from '../hooks/useInfoCard';
import { InfoCard } from './InfoCard';
import { Directory } from './Directory';
import { HUD } from './HUD';
import { CRTStartup } from './CRTStartup';
import { allPortfolioData } from '../data/portfolio';

const HUD_HEIGHT = 72;

type CanvasRect = { top: number; left: number; width: number; height: number };

export function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGame(containerRef);
  const { card, zone, close, next, prev, currentIndex, total } = useInfoCard();
  const [showDirectory, setShowDirectory] = useState(false);
  const [canvasRect, setCanvasRect] = useState<CanvasRect | null>(null);

  const openDirectory  = useCallback(() => setShowDirectory(true),  []);
  const closeDirectory = useCallback(() => setShowDirectory(false), []);

  // Track the Phaser canvas position/size (it's centered + letterboxed by Phaser's FIT scale)
  useEffect(() => {
    let canvas: HTMLCanvasElement | null = null;
    let ro: ResizeObserver | null = null;

    const updateRect = () => {
      if (!canvas || !containerRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      const br = canvas.getBoundingClientRect();
      setCanvasRect({ top: br.top - cr.top, left: br.left - cr.left, width: br.width, height: br.height });
    };

    // Phaser appends the canvas asynchronously — watch for it
    const mo = new MutationObserver(() => {
      canvas = containerRef.current?.querySelector('canvas') ?? null;
      if (canvas) {
        ro = new ResizeObserver(updateRect);
        ro.observe(canvas);
        updateRect();
        mo.disconnect();
      }
    });
    if (containerRef.current) mo.observe(containerRef.current, { childList: true });
    window.addEventListener('resize', updateRect);
    return () => { mo.disconnect(); ro?.disconnect(); window.removeEventListener('resize', updateRect); };
  }, [containerRef]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') setShowDirectory(v => !v);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000' }}>
      <a href="#game-container" className="skip-link">Skip to game</a>
      <HUD onMenuClick={openDirectory} />
      <div
        ref={containerRef}
        id="game-container"
        style={{
          position: 'absolute',
          top: HUD_HEIGHT,
          left: 0, right: 0, bottom: 0,
          margin: 0, padding: 0, lineHeight: 0,
        }}
      />

      {/* CRT overlay — sized/positioned to match the actual Phaser canvas */}
      {canvasRect && <div style={{
        position: 'absolute',
        top: HUD_HEIGHT + canvasRect.top,
        left: canvasRect.left,
        width: canvasRect.width,
        height: canvasRect.height,
        pointerEvents: 'none',
        zIndex: 20,
      }}>

        {/* CRT power-on animation — behind the TV mask */}
        <CRTStartup style={{ inset: 0 }} />

        {/* TV bezel mask PNG — transparent center reveals game canvas */}
        <img
          src="/assets/tv-mask.png"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'fill',
            display: 'block',
          }}
        />

        {/* Scanlines */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 4px)',
          animation: 'crtFlicker 0.18s steps(1) infinite, crtScan 0.12s linear infinite',
          animationFillMode: 'both',
          willChange: 'transform',
        }} />

        {/* Vignette — outer ring */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.82) 100%)',
        }} />

        {/* Vignette — inner dark edge, tight to the border */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.75) 85%, rgba(0,0,0,0.95) 100%)',
          mixBlendMode: 'multiply',
        }} />

        {/* Screen glare arc — top-center highlight like old CRT glass */}
        <div style={{
          position: 'absolute',
          top: '-25%', left: '15%', right: '15%',
          height: '55%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />

        {/* Corner darkening for curved-screen illusion */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(circle at 0% 0%,   rgba(0,0,0,0.55) 0%, transparent 35%),
            radial-gradient(circle at 100% 0%,  rgba(0,0,0,0.55) 0%, transparent 35%),
            radial-gradient(circle at 0% 100%,  rgba(0,0,0,0.55) 0%, transparent 35%),
            radial-gradient(circle at 100% 100%,rgba(0,0,0,0.55) 0%, transparent 35%)
          `,
        }} />

        {/* Horizontal phosphor smear — faint green tint on bright areas */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(20, 40, 20, 0.04)',
          mixBlendMode: 'screen',
        }} />
      </div>}
      {showDirectory && <Directory onClose={closeDirectory} />}
      {card && (
        <InfoCard
          item={card}
          onClose={close}
          onNext={next}
          onPrev={prev}
          onMenu={() => { close(); openDirectory(); }}
          zoneColor={zone?.color}
          zoneName={zone?.name}
          currentIndex={currentIndex}
          total={total}
        />
      )}

      <section style={{
        position: 'absolute', width: 1, height: 1,
        margin: '-1px', padding: 0,
        overflow: 'hidden', clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap', border: 0,
      }}>
        <h1>Zach Manring — Design Systems Architect, Front-End Engineer, Podcast Host</h1>
        {allPortfolioData.map(item => (
          <article key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.shortDesc}</p>
            <p>{item.longDesc}</p>
            {item.link && <a href={item.link}>{item.linkLabel ?? item.title}</a>}
          </article>
        ))}
      </section>
    </div>
  );
}
