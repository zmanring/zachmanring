import { useRef, useState, useEffect, useCallback } from 'react';
import { useGame } from '../hooks/useGame';
import { useInfoCard } from '../hooks/useInfoCard';
import { InfoCard } from './InfoCard';
import { Directory } from './Directory';
import { HUD } from './HUD';
import { allPortfolioData } from '../data/portfolio';

const HUD_HEIGHT = 72;

export function GameContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGame(containerRef);
  const { card, zone, close, next, prev, currentIndex, total } = useInfoCard();
  const [showDirectory, setShowDirectory] = useState(false);

  const openDirectory  = useCallback(() => setShowDirectory(true),  []);
  const closeDirectory = useCallback(() => setShowDirectory(false), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') setShowDirectory(v => !v);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#111111' }}>
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
