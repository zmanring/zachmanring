import Phaser from 'phaser';
import { PLAYER_SPEED, DEPTH } from '../constants';

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
  private idleTimer = 0;
  private bubbleVisible = false;
  private bubble!: Phaser.GameObjects.Text;
  private bubbleBg!: Phaser.GameObjects.Graphics;
  private emojiIndex = 0;
  private readonly EMOJIS = ['☕', '💻', '🔨', '🎙️', '🏕️', '🎮', '🌲', '📐'];
  private readonly IDLE_TRIGGER = 5000; // ms before bubble appears

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
    const left  = this.keys.left.isDown  || this.keys.a.isDown;
    const right = this.keys.right.isDown || this.keys.d.isDown;
    const up    = this.keys.up.isDown    || this.keys.w.isDown;
    const down  = this.keys.down.isDown  || this.keys.s.isDown;

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
