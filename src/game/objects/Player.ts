import Phaser from 'phaser';
import { PLAYER_SPEED, DEPTH, FONT } from '../constants';

type Dir = 'S' | 'N' | 'E';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private keys!: {
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    a:     Phaser.Input.Keyboard.Key;
    d:     Phaser.Input.Keyboard.Key;
    w:     Phaser.Input.Keyboard.Key;
    s:     Phaser.Input.Keyboard.Key;
  };
  private dir: Dir = 'S';
  private facingLeft = false;
  private moving = false;
  private walkTimer = 0;
  private walkFrameB = false;
  private shadow: Phaser.GameObjects.Ellipse;

  // Thought bubble
  public inputEnabled = true;

  private idleTimer = 0;
  private bubbleVisible = false;
  private bubble!: Phaser.GameObjects.Text;
  private bubbleBg!: Phaser.GameObjects.Graphics;
  private emojiIndex = 0;
  private readonly EMOJIS = ['☕', '💻', '🔨', '🎙️', '🏕️', '🎮', '🌲', '📐'];
  private readonly IDLE_TRIGGER = 5000; // ms before bubble appears

  // First-move hint arrows
  private hintLeft!:  Phaser.GameObjects.Text;
  private hintRight!: Phaser.GameObjects.Text;
  private hintUp!:    Phaser.GameObjects.Text;
  private hintDown!:  Phaser.GameObjects.Text;
  private hintLabel!: Phaser.GameObjects.Text;
  private hintDismissed = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.shadow = scene.add.ellipse(x, y + 30, 18, 7, 0x000000, 0.22).setDepth(DEPTH.PLAYER - 1);
    this.sprite = scene.physics.add.sprite(x, y, 'player_s').setDepth(DEPTH.PLAYER);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerup', () => scene.sound.play('hello'));

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(18, 14).setOffset(7, 46);

    // Thought bubble (hidden until idle)
    this.bubbleBg = scene.add.graphics().setDepth(DEPTH.PLAYER + 1).setAlpha(0);
    this.bubble = scene.add.text(0, 0, '', {
      fontSize: '14px', padding: { x: 6, y: 4 },
    }).setOrigin(0.5).setDepth(DEPTH.PLAYER + 2).setAlpha(0);

    // First-move hint
    const hintStyle = { fontSize: '14px', color: '#F0EDE8', alpha: 0.85 };
    const hintDepth = DEPTH.PLAYER + 3;
    this.hintLeft  = scene.add.text(x - 38, y,      '←', hintStyle).setOrigin(0.5).setDepth(hintDepth);
    this.hintRight = scene.add.text(x + 38, y,      '→', hintStyle).setOrigin(0.5).setDepth(hintDepth);
    this.hintUp    = scene.add.text(x,      y - 52, '↑', hintStyle).setOrigin(0.5).setDepth(hintDepth);
    this.hintDown  = scene.add.text(x,      y + 52, '↓', hintStyle).setOrigin(0.5).setDepth(hintDepth);
    this.hintLabel = scene.add.text(x, y, '', {}).setDepth(hintDepth); // unused, kept for cleanup ref

    // Pulse the arrows
    [this.hintLeft, this.hintRight, this.hintUp, this.hintDown].forEach((h, i) => {
      const offsets = [[-6, 0], [6, 0], [0, -6], [0, 6]];
      scene.tweens.add({
        targets: h,
        x: h.x + offsets[i][0],
        y: h.y + offsets[i][1],
        alpha: 0.3,
        duration: 600,
        yoyo: true, repeat: -1,
        ease: 'Sine.InOut',
        delay: i * 80,
      });
    });

    const kb = scene.input.keyboard!;
    this.keys = {
      left:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      a:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      w:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      s:     kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    };
  }

  update() {
    const body  = this.sprite.body as Phaser.Physics.Arcade.Body;

    const left  = this.inputEnabled && (this.keys.left.isDown  || this.keys.a.isDown);
    const right = this.inputEnabled && (this.keys.right.isDown || this.keys.d.isDown);
    const up    = this.inputEnabled && (this.keys.up.isDown    || this.keys.w.isDown);
    const down  = this.inputEnabled && (this.keys.down.isDown  || this.keys.s.isDown);

    let vx = 0, vy = 0;
    if (left)  vx -= PLAYER_SPEED;
    if (right) vx += PLAYER_SPEED;
    if (up)    vy -= PLAYER_SPEED;
    if (down)  vy += PLAYER_SPEED;

    // Diagonal normalise
    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    body.setVelocity(vx, vy);
    this.moving = vx !== 0 || vy !== 0;

    // Direction — vertical takes priority over horizontal
    if (down)       this.dir = 'S';
    else if (up)    this.dir = 'N';
    else if (left || right) this.dir = 'E';

    // Track last horizontal facing so it persists when stopping
    if (left)  this.facingLeft = true;
    if (right) this.facingLeft = false;

    // Walk cycle
    if (this.moving) {
      this.walkTimer += this.scene.game.loop.delta;
      if (this.walkTimer > 140) { this.walkFrameB = !this.walkFrameB; this.walkTimer = 0; }
    } else {
      this.walkFrameB = false;
      this.walkTimer = 0;
    }

    // East uses south sprite, flipped
    const baseDir = this.dir === 'E' ? 's' : this.dir.toLowerCase();
    const frame = this.moving && this.walkFrameB ? '_b' : '';
    this.sprite.setTexture(`player_${baseDir}${frame}`);
    // North sprite shows the back, so left/right is mirrored
    this.sprite.setFlipX(this.dir === 'N' ? !this.facingLeft : this.facingLeft);

    this.shadow.setPosition(this.sprite.x, this.sprite.y + 30);

    // Thought bubble logic
    const bx = this.sprite.x + 20;
    const by = this.sprite.y - 52;

    // Dismiss movement hints on first move
    if (this.moving && !this.hintDismissed) {
      this.hintDismissed = true;
      const hints = [this.hintLeft, this.hintRight, this.hintUp, this.hintDown, this.hintLabel];
      this.scene.tweens.killTweensOf(hints);
      this.scene.tweens.add({ targets: hints, alpha: 0, duration: 400, onComplete: () => hints.forEach(h => h.destroy()) });
    }

    if (this.moving) {
      // Stop breathing while walking, reset scale
      this.idleTimer = 0;
      if (this.bubbleVisible) {
        this.bubbleVisible = false;
        this.scene.tweens.add({ targets: [this.bubble, this.bubbleBg], alpha: 0, duration: 200 });
      }
    } else {
      this.idleTimer += this.scene.game.loop.delta;

      if (this.idleTimer >= this.IDLE_TRIGGER && !this.bubbleVisible) {
        this.bubbleVisible = true;
        this.emojiIndex = Math.floor(Math.random() * this.EMOJIS.length);
        this.showBubble(bx, by);
      }

      // Cycle emoji every 3s while idle
      if (this.bubbleVisible && this.idleTimer > this.IDLE_TRIGGER) {
        const cycleIndex = Math.floor((this.idleTimer - this.IDLE_TRIGGER) / 3000) % this.EMOJIS.length;
        if (cycleIndex !== this.emojiIndex) {
          this.emojiIndex = cycleIndex;
          this.showBubble(bx, by);
        }
      }
    }

    if (this.bubbleVisible) {
      this.bubble.setPosition(bx, by);
      this.bubbleBg.setPosition(bx, by);
    }

    if (!this.hintDismissed) {
      const { x, y } = this.sprite;
      this.hintLeft.setPosition(x - 38, y);
      this.hintRight.setPosition(x + 38, y);
      this.hintUp.setPosition(x, y - 52);
      this.hintDown.setPosition(x, y + 52);
      this.hintLabel.setPosition(x, y + 70);
    }
  }

  private showBubble(x: number, y: number) {
    const emoji = this.EMOJIS[this.emojiIndex];
    this.bubble.setText(emoji).setPosition(x, y);

    // Redraw background bubble
    this.bubbleBg.clear();
    this.bubbleBg.fillStyle(0xffffff, 1);
    this.bubbleBg.fillRoundedRect(-18, -16, 36, 28, 8);
    // Little tail dots
    this.bubbleBg.fillCircle(0, 14, 4);
    this.bubbleBg.fillCircle(-4, 20, 2.5);
    this.bubbleBg.fillCircle(-7, 25, 1.5);
    this.bubbleBg.setPosition(x, y);

    this.scene.tweens.add({ targets: [this.bubble, this.bubbleBg], alpha: 1, duration: 300, ease: 'Back.Out' });
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
}
