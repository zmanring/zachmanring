import Phaser from 'phaser';
import { NPC_SPEED, DEPTH, EVENTS, FONT, PALETTE } from '../constants';
import type { PortfolioItem } from '../../data/portfolio';

const PROXIMITY = 72;

export class NPC {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public isNear  = false;
  public isOpen  = false;

  private scene:        Phaser.Scene;
  private item:         PortfolioItem;
  private home:         { x: number; y: number };
  private wanderRadius: number;
  private prompt:       Phaser.GameObjects.Text;
  private shadow:       Phaser.GameObjects.Ellipse;
  private closeHandler: () => void;
  private movingNorth = false;
  private bounds: { minX: number; maxX: number; minY: number; maxY: number } = { minX: 40, maxX: 2520, minY: 40, maxY: 1880 };

  // SVG character keys start with 'char_' — they're single textures, no _s/_n variants
  private isSvgChar: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number, y: number,
    textureBase: string,        // e.g. 'npc_maker' or 'char_lumberjack'
    item: PortfolioItem,
    wanderRadius = 110,
    bounds?: { minX: number; maxX: number; minY: number; maxY: number },
  ) {
    this.scene        = scene;
    this.item         = item;
    this.home         = { x, y };
    this.wanderRadius = wanderRadius;
    if (bounds) this.bounds = bounds;
    this.isSvgChar    = textureBase.startsWith('char_');

    // Shadow beneath sprite
    this.shadow = scene.add.ellipse(x, y + 13, 18, 7, 0x000000, 0.22)
      .setDepth(DEPTH.NPC - 1);

    const initialTex = this.isSvgChar ? textureBase : `${textureBase}_s`;
    this.sprite = scene.physics.add.sprite(x, y, initialTex)
      .setDepth(DEPTH.NPC)
      .setInteractive({ useHandCursor: true });

    // SVG characters are ~48px tall — scale down to feel right in the world
    if (this.isSvgChar) {
      this.sprite.setScale(0.55);
    }

    (this.sprite.body as Phaser.Physics.Arcade.Body)
      .setSize(16, 14).setOffset(8, 18)
      .setCollideWorldBounds(true);

    // Name label (floating, always visible)
    const label = scene.add.text(x, y - 24, item.title, {
      fontSize: '5px', color: '#DD4400', fontFamily: FONT,
      backgroundColor: '#111111', padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setDepth(DEPTH.UI);

    // Proximity prompt (hidden until near)
    this.prompt = scene.add.text(x, y - 36, '[ E ]', {
      fontSize: '6px', color: '#F0EDE8', fontFamily: FONT,
      backgroundColor: '#DD4400', padding: { x: 4, y: 3 },
    }).setOrigin(0.5).setDepth(DEPTH.UI).setAlpha(0);

    // Click to open
    this.sprite.on('pointerdown', () => this.openCard());

    // Keyboard open is handled in WorldScene (nearest NPC check)

    // Clean up window listener on scene end
    this.closeHandler = () => { this.isOpen = false; };
    window.addEventListener('portfolio:requestCloseCard', this.closeHandler);
    const cleanup = () => window.removeEventListener('portfolio:requestCloseCard', this.closeHandler);
    scene.events.once('shutdown', cleanup);
    scene.events.once('destroy',  cleanup);

    // Start wander loop
    this.scheduleMove();

    // Store label ref in sprite so WorldScene can keep it above the sprite
    (this.sprite as unknown as { _label: Phaser.GameObjects.Text })._label = label;
    this._label = label;
  }

  private _label: Phaser.GameObjects.Text;

  // ── Wander ──────────────────────────────────────────────────────────────

  private scheduleMove() {
    const wait = Phaser.Math.Between(1200, 3500);
    this.scene.time.delayedCall(wait, () => {
      if (!this.sprite.active) return;
      this.walkToTarget();
    });
  }

  private walkToTarget() {
    const angle  = Math.random() * Math.PI * 2;
    const dist   = Phaser.Math.Between(20, this.wanderRadius);
    const tx     = Phaser.Math.Clamp(this.home.x + Math.cos(angle) * dist, this.bounds.minX, this.bounds.maxX);
    const ty     = Phaser.Math.Clamp(this.home.y + Math.sin(angle) * dist, this.bounds.minY, this.bounds.maxY);
    const dx     = tx - this.sprite.x;
    const dy     = ty - this.sprite.y;
    const len    = Math.sqrt(dx * dx + dy * dy);

    if (len < 6) { this.scheduleMove(); return; }

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity((dx / len) * NPC_SPEED, (dy / len) * NPC_SPEED);
    this.movingNorth = dy < 0;
    this.updateSprite();

    const travelMs = (len / NPC_SPEED) * 1000;
    this.scene.time.delayedCall(travelMs, () => {
      if (!this.sprite.active) return;
      body.setVelocity(0, 0);
      this.movingNorth = false;
      this.updateSprite();
      this.scheduleMove();
    });
  }

  private updateSprite() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!this.isSvgChar) {
      const base = this.sprite.texture.key.replace(/_[sn]$/, '');
      const dir  = this.movingNorth ? 'n' : 's';
      this.sprite.setTexture(`${base}_${dir}`);
    }
    // flip for left-facing (works for both SVG and procedural)
    this.sprite.setFlipX(body.velocity.x < -5);
  }

  // ── Proximity + prompt ──────────────────────────────────────────────────

  update(px: number, py: number) {
    const dx   = px - this.sprite.x;
    const dy   = py - this.sprite.y;
    const near = Math.sqrt(dx * dx + dy * dy) < PROXIMITY;

    if (near !== this.isNear) {
      this.isNear = near;
      this.scene.tweens.add({ targets: this.prompt, alpha: near ? 1 : 0, duration: 150 });
    }

    // Keep floating elements above sprite
    this.prompt.setPosition(this.sprite.x, this.sprite.y - 36);
    this._label.setPosition(this.sprite.x, this.sprite.y - 24);
    this.shadow.setPosition(this.sprite.x, this.sprite.y + 13);
  }

  // ── Open ──────────────────────────────────────────────────────────────

  openFromKeyboard() {
    if (this.isNear && !this.isOpen) this.openCard();
  }

  private openCard() {
    if (this.isOpen) return;
    this.isOpen = true;

    // Coin pop on first open
    this.scene.game.events.emit(EVENTS.COIN_COLLECT);
    this.scene.game.events.emit(EVENTS.OPEN_CARD, this.item);

    // Small bounce tween for feedback
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 6,
      duration: 80, yoyo: true, ease: 'Power2',
    });
  }
}
