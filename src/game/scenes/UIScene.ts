import Phaser from 'phaser';
import { SCENES, EVENTS } from '../constants';

// UIScene: no HUD drawing — HUD lives in React for full-width rendering.
// This scene only bridges Phaser game events → window CustomEvents → React.
export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.UI });
  }

  create() {
    this.game.events.on(EVENTS.COIN_COLLECT, () => {
      window.dispatchEvent(new CustomEvent('portfolio:coinCollect'));
    });
    this.game.events.on(EVENTS.OPEN_CARD, (data: unknown) => {
      window.dispatchEvent(new CustomEvent('portfolio:openCard', { detail: data }));
    });
    this.game.events.on(EVENTS.CLOSE_CARD, () => {
      window.dispatchEvent(new CustomEvent('portfolio:closeCard'));
    });
    this.game.events.on(EVENTS.LEVEL_COMPLETE, (nextScene: string) => {
      window.dispatchEvent(new CustomEvent('portfolio:levelComplete', { detail: nextScene }));
    });
    window.addEventListener('portfolio:requestCloseCard', () => {
      this.game.events.emit(EVENTS.CLOSE_CARD);
    });
  }
}
