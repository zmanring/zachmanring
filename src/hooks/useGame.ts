import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { createGame } from '../game/Game';

export function useGame(containerRef: React.RefObject<HTMLDivElement | null>) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    gameRef.current = createGame(containerRef.current);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [containerRef]);

  return gameRef;
}
