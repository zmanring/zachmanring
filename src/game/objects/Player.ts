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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.shadow = scene.add.ellipse(x, y + 30, 18, 7, 0x000000, 0.22).setDepth(DEPTH.PLAYER - 1);
    this.sprite = scene.physics.add.sprite(x, y, 'player_s').setDepth(DEPTH.PLAYER);
    this.sprite.setCollideWorldBounds(true);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(18, 14).setOffset(7, 46);

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
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
}
