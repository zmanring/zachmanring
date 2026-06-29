import Phaser from 'phaser';
import { DEPTH, FONT } from '../constants';

const DOG_SPEED   = 85;   // px/s
const MAX_LEG     = 600;  // max pixels per wander leg
const COMPANION_R = 180;  // radius around companion to target
const WORLD_MIN_X = 200;
const WORLD_MAX_X = 2360;
const WORLD_MIN_Y = 200;
const WORLD_MAX_Y = 1720;

/** A freely-roaming dog — no portfolio card, just vibes. */
export class Dog {
  public  sprite:     Phaser.Physics.Arcade.Sprite;
  /** Set after construction to keep two dogs near each other. */
  public  companion:  Dog | null = null;

  private scene:      Phaser.Scene;
  private texBase:    string;
  private _label:     Phaser.GameObjects.Text;
  private labelBg:    Phaser.GameObjects.Graphics;
  private shadow:     Phaser.GameObjects.Ellipse;
  private movingNorth = false;

  constructor(
    scene: Phaser.Scene,
    x: number, y: number,
    name: string,
    texBase: string,
  ) {
    this.scene   = scene;
    this.texBase = texBase;

    // Shadow — same spec as NPC
    this.shadow = scene.add
      .ellipse(x, y + 24, 28, 10, 0x000000, 0.25)
      .setDepth(DEPTH.NPC - 1);

    this.sprite = scene.physics.add
      .sprite(x, y, `${texBase}_s`)
      .setDepth(DEPTH.NPC)
      .setScale(0.85);

    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Name label pill
    this.labelBg = scene.add.graphics().setDepth(DEPTH.UI - 0.1);
    this._label  = scene.add.text(x, y - 14, name, {
      fontSize: '5px', color: '#F0EDE8', fontFamily: FONT,
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setDepth(DEPTH.UI);

    this.drawPill(this.labelBg, this._label.width, this._label.height, 0x111111, 0.85);

    this.scheduleMove();
  }

  private drawPill(g: Phaser.GameObjects.Graphics, w: number, h: number, col: number, alpha: number) {
    g.clear();
    g.fillStyle(col, alpha);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, h / 2);
  }

  // ── Wander loop ────────────────────────────────────────────────────────────

  private scheduleMove() {
    const wait = Phaser.Math.Between(1500, 5000);
    this.scene.time.delayedCall(wait, () => {
      if (!this.sprite.active) return;
      this.walkToTarget();
    });
  }

  private walkToTarget() {
    let tx: number, ty: number;

    if (this.companion) {
      // Head somewhere near the companion rather than a random world point
      const angle = Math.random() * Math.PI * 2;
      const dist  = Phaser.Math.Between(20, COMPANION_R);
      tx = Phaser.Math.Clamp(
        this.companion.sprite.x + Math.cos(angle) * dist,
        WORLD_MIN_X, WORLD_MAX_X,
      );
      ty = Phaser.Math.Clamp(
        this.companion.sprite.y + Math.sin(angle) * dist,
        WORLD_MIN_Y, WORLD_MAX_Y,
      );
    } else {
      tx = Phaser.Math.Between(WORLD_MIN_X, WORLD_MAX_X);
      ty = Phaser.Math.Between(WORLD_MIN_Y, WORLD_MAX_Y);
    }

    const dx  = tx - this.sprite.x;
    const dy  = ty - this.sprite.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 10) { this.scheduleMove(); return; }

    const travel = Math.min(len, MAX_LEG);
    const vx = (dx / len) * DOG_SPEED;
    const vy = (dy / len) * DOG_SPEED;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.movingNorth = dy < 0;
    body.setVelocity(vx, vy);
    this.updateSprite();

    this.scene.time.delayedCall((travel / DOG_SPEED) * 1000, () => {
      if (!this.sprite.active) return;
      body.setVelocity(0, 0);
      this.movingNorth = false;
      this.updateSprite();
      this.scheduleMove();
    });
  }

  private updateSprite() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.sprite.setTexture(this.movingNorth ? `${this.texBase}_n` : `${this.texBase}_s`);
    // North shows the back — left/right is mirrored, same logic as Player
    const movingLeft = body.velocity.x < -5;
    this.sprite.setFlipX(this.movingNorth ? !movingLeft : movingLeft);
  }

  // ── Update (called every frame from WorldScene) ───────────────────────────

  update() {
    const { x, y } = this.sprite;
    this._label.setPosition(x, y - 14);
    this.labelBg.setPosition(x, y - 14);
    this.shadow.setPosition(x, y + 24);
  }
}
