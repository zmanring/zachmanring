import Phaser from 'phaser';
import { SCENES, PALETTE, GAME_WIDTH, GAME_HEIGHT, FONT } from '../constants';

const SKIN = 0xF5CBA7;


export class BootScene extends Phaser.Scene {
  constructor() { super({ key: SCENES.BOOT }); }

  preload() {

    // Load hand-drawn character sprites
    // Audio
    this.load.audio('hello', 'assets/hello.mp3');
    // Zach sprites — used for both NPC and player
    this.load.image('npc_zach_s', 'assets/zach_s.png');
    this.load.image('npc_zach_n', 'assets/zach_n.png');
    this.load.image('player_s',   'assets/zach_s.png');
    this.load.image('player_n',   'assets/zach_n.png');
    this.load.image('player_s_b', 'assets/zach_s_b.png');
    this.load.image('player_n_b', 'assets/zach_n_b.png');
    // NPC sprites
    this.load.image('npc_maker_s',        'assets/maker_s.png');
    this.load.image('npc_maker_n',        'assets/maker_n.png');
    this.load.image('npc_podcaster_s',    'assets/podcaster_s.png');
    this.load.image('npc_podcaster_n',    'assets/podcaster_n.png');
    this.load.image('npc_developer_s',    'assets/developer_s.png');
    this.load.image('npc_developer_n',    'assets/developer_n.png');
    this.load.image('npc_engineer_s',     'assets/engineer_s.png');
    this.load.image('npc_engineer_n',     'assets/engineer_n.png');
    this.load.image('npc_casual_s',       'assets/casual_s.png');
    this.load.image('npc_casual_n',       'assets/casual_n.png');
    this.load.image('npc_professional_s', 'assets/professional_s.png');
    this.load.image('npc_professional_n', 'assets/professional_n.png');
    this.load.image('npc_cameraman_s',    'assets/cameraman_s.png');
    this.load.image('npc_cameraman_n',    'assets/cameraman_n.png');
    this.load.image('npc_brocc_s',        'assets/brocc_s.png');
    this.load.image('npc_brocc_n',        'assets/brocc_n.png');
    this.load.image('npc_wife_s',         'assets/wife_s.png');
    this.load.image('npc_wife_n',         'assets/wife_n.png');
    // Dog sprites (Max + Ozzy)
    this.load.image('dog_max_s',  'assets/max_s.png');
    this.load.image('dog_max_n',  'assets/max_n.png');
    this.load.image('dog_ozzy_s', 'assets/ozzy_s.png');
    this.load.image('dog_ozzy_n', 'assets/ozzy_n.png');

    this.load.on('complete', () => {
      (window as any).__portfolioReady = true;
      window.dispatchEvent(new CustomEvent('portfolio:ready'));
    });

    this.generateTextures();
  }

  private generateTextures() {
    this.genGroundTiles();
    this.genPlayerSprites();
    this.genNPCSprites();
    // this.genBroccSprite(); // using loaded PNG sprites
    this.genDecorations();
  }

  // ── Load asset-based sprites (optional, can override procedural) ──────────────
  private loadAssetSprites() {
    // Loaded in preload() — these textures override procedural generation if present
  }

  // ── Ground ────────────────────────────────────────────────────────────────

  private genGroundTiles() {
    const tile = (key: string, base: number, detail: number) => {
      const g = this.make.graphics({ x: 0, y: 0 });
      g.fillStyle(base); g.fillRect(0, 0, 32, 32);
      g.fillStyle(detail, 0.4);
      // subtle dither pattern
      for (let y = 0; y < 32; y += 4)
        for (let x = (y / 4) % 2 === 0 ? 0 : 2; x < 32; x += 4)
          g.fillRect(x, y, 1, 1);

      g.generateTexture(key, 32, 32); g.destroy();
    };

    tile('ground_grass', PALETTE.GRASS,    0x2A4A1A);
    tile('ground_path',  PALETTE.PATH,     0x3A3025);
    tile('ground_ws',    PALETTE.FLOOR_WS, 0xDD4400);  // SGW orange grid detail
    tile('ground_st',    PALETTE.FLOOR_ST, 0x08D7A9);  // teal grid (Pixel Broccoli brand)
    tile('ground_of',    PALETTE.FLOOR_OF, 0x163050);
    tile('ground_pj',    PALETTE.FLOOR_PJ, 0x252525);
  }

  // ── Player (top-down 3/4 view, 32×32) ────────────────────────────────────

  private genPlayerSprites() {
    // Zach: orange spike hair, orange shirt, blue pants — outlined chibi style
    const HC    = 0xDD4400;  // orange — hair, shirt, shoes
    const SHIRT = 0xDD4400;
    const PANTS = 0x1565C0;
    const SHOES = 0xDD4400;
    const K     = 0x0A0A0A;
    const STUB  = 0xC74000;  // stubble + spike shadow

    const draw = (key: string, dir: 'S' | 'N' | 'E', walkB: boolean) => {
      const g = this.make.graphics({ x: 0, y: 0 });

      if (dir === 'S') {
        const lx = walkB ? 7 : 10, rx = walkB ? 19 : 17, lw = walkB ? 6 : 5;
        // Outline pass
        [[9,1,14,9],[10,4,12,11],[8,14,16,12],[4,15,6,10],[22,15,6,10],
         [lx,24,lw,7],[rx,24,lw,7]].forEach(
          ([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
        // Head
        g.fillStyle(HC);    g.fillRect(10,2,12,7);    // hair
        g.fillStyle(SKIN);  g.fillRect(11,5,10,9);    // face
        g.fillStyle(K);     g.fillRect(13,10,2,2);    // eye L
                            g.fillRect(17,10,2,2);    // eye R
        g.fillStyle(SKIN);  g.fillRect(14,14,4,2);    // neck
        // Body + arms
        g.fillStyle(SHIRT); g.fillRect(9,15,14,10);
        g.fillStyle(SHIRT); g.fillRect(5,16,4,8); g.fillRect(23,16,4,8);
        // Legs + shoes
        g.fillStyle(PANTS); g.fillRect(lx,25,lw,5); g.fillRect(rx,25,lw,5);
        g.fillStyle(SHOES); g.fillRect(lx-1,29,lw+2,3); g.fillRect(rx-1,29,lw+2,3);
        // Front hair spike
        g.fillStyle(K);    g.fillRect(13,0,6,4);
        g.fillStyle(HC);   g.fillRect(14,1,4,3);
        g.fillStyle(STUB); g.fillRect(14,1,1,3);
        // Stubble
        g.fillStyle(STUB); g.fillRect(12,13,8,2);

      } else if (dir === 'N') {
        const lx = walkB ? 7 : 10, rx = walkB ? 19 : 17, lw = walkB ? 6 : 5;
        // Outline pass
        [[9,1,14,11],[8,12,16,12],[4,13,6,10],[22,13,6,10],
         [lx,22,lw,7],[rx,22,lw,7]].forEach(
          ([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
        g.fillStyle(HC);    g.fillRect(10,2,12,10);   // hair (full back of head)
        g.fillStyle(SKIN);  g.fillRect(12,11,8,2);    // nape
        g.fillStyle(SHIRT); g.fillRect(9,13,14,10);
        g.fillStyle(SHIRT); g.fillRect(5,14,4,8); g.fillRect(23,14,4,8);
        g.fillStyle(PANTS); g.fillRect(lx,23,lw,5); g.fillRect(rx,23,lw,5);
        g.fillStyle(SHOES); g.fillRect(lx-1,27,lw+2,3); g.fillRect(rx-1,27,lw+2,3);
        // Spike crown bump (visible from back)
        g.fillStyle(K);    g.fillRect(13,0,6,4);
        g.fillStyle(HC);   g.fillRect(14,1,4,3);
        g.fillStyle(STUB); g.fillRect(14,1,1,3);

      } else { // E — east side profile (west = flipX)
        // Outlines
        [[13,1,15,8],[14,4,13,11],[9,13,14,11],[22,14,5,8],[7,15,4,7]].forEach(
          ([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
        g.fillStyle(HC);    g.fillRect(14,2,14,7);    // hair (side)
        g.fillStyle(SKIN);  g.fillRect(15,5,12,8);    // face
        g.fillStyle(K);     g.fillRect(25,9,2,2);     // single eye
        g.fillStyle(SKIN);  g.fillRect(15,13,6,2);    // neck
        g.fillStyle(SHIRT); g.fillRect(10,14,14,10);  // torso
        g.fillStyle(SHIRT); g.fillRect(23,15,4,8);    // front arm
        g.fillStyle(SHIRT); g.fillRect(7,16,4,6);     // back arm (partial)
        // Spike (front of head = right side when facing east)
        g.fillStyle(K);    g.fillRect(25,1,5,4);
        g.fillStyle(HC);   g.fillRect(26,2,3,3);
        g.fillStyle(STUB); g.fillRect(26,2,1,3);
        // Legs
        if (walkB) {
          [[8,23,9,8],[17,22,8,6]].forEach(
            ([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
          g.fillStyle(PANTS); g.fillRect(9,24,7,6);   // front leg (stride)
          g.fillStyle(SHOES); g.fillRect(8,29,9,3);
          g.fillStyle(PANTS); g.fillRect(18,23,6,5);  // back leg
          g.fillStyle(SHOES); g.fillRect(17,26,8,3);
        } else {
          [[9,23,12,8]].forEach(
            ([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
          g.fillStyle(PANTS); g.fillRect(10,24,10,6);
          g.fillStyle(SHOES); g.fillRect(9,29,12,3);
        }
      }

      g.generateTexture(key, 32, 32); g.destroy();
    };

    // player_s / player_n are loaded from SVG in preload(); only generate east fallback
    draw('player_e',   'E', false);
    draw('player_e_b', 'E', true);
  }

  // ── NPCs ─────────────────────────────────────────────────────────────────

  private genNPCSprites() {
    // All NPC sprites loaded from PNG assets in preload()
    // this.drawMakerNPC();
    // this.drawPodcasterNPC();
    // this.drawDeveloperNPC();
    // this.drawEngineerNPC();
    // this.drawCasualNPC();
    // this.drawProfessionalNPC();
    // this.drawZachNPC();
    // this.genCameramanSprite();
  }

  // ── NPC base renderer (outline-first, chibi proportions) ──────────────────

  private npcBase(
    g: Phaser.GameObjects.Graphics, dir: 'S' | 'N',
    hair: number, shirt: number, pants: number, shoes: number,
  ) {
    const K = 0x0A0A0A;
    if (dir === 'S') {
      // Outline pass (black expanded rects drawn first)
      [[9,1,14,9],[10,4,12,11],[8,14,16,12],[4,15,6,10],[22,15,6,10],[9,24,7,7],[16,24,7,7]]
        .forEach(([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
      // Fill pass
      g.fillStyle(hair);  g.fillRect(10,2,12,7);    // hair
      g.fillStyle(SKIN);  g.fillRect(11,5,10,9);    // face
      g.fillStyle(K);     g.fillRect(13,10,2,2);    // eye L
                          g.fillRect(17,10,2,2);    // eye R
      g.fillStyle(SKIN);  g.fillRect(14,14,4,2);    // neck
      g.fillStyle(shirt); g.fillRect(9,15,14,10);   // body
      g.fillStyle(shirt); g.fillRect(5,16,4,8);     // arm L
                          g.fillRect(23,16,4,8);    // arm R
      g.fillStyle(pants); g.fillRect(10,25,5,5);    // leg L
                          g.fillRect(17,25,5,5);    // leg R
      g.fillStyle(shoes); g.fillRect(9,29,6,3);     // shoe L
                          g.fillRect(17,29,6,3);    // shoe R
    } else {
      [[9,1,14,11],[8,12,16,12],[4,13,6,10],[22,13,6,10],[9,23,7,7],[16,23,7,7]]
        .forEach(([x,y,w,h]) => { g.fillStyle(K); g.fillRect(x-1,y-1,w+2,h+2); });
      g.fillStyle(hair);  g.fillRect(10,2,12,10);   // hair (full back-of-head)
      g.fillStyle(SKIN);  g.fillRect(12,11,8,2);    // nape of neck
      g.fillStyle(shirt); g.fillRect(9,13,14,10);   // body
      g.fillStyle(shirt); g.fillRect(5,14,4,8);     // arm L
                          g.fillRect(23,14,4,8);    // arm R
      g.fillStyle(pants); g.fillRect(10,23,5,5);    // leg L
                          g.fillRect(17,23,5,5);    // leg R
      g.fillStyle(shoes); g.fillRect(9,27,6,3);     // shoe L
                          g.fillRect(17,27,6,3);    // shoe R
    }
  }

  // ── Per-type NPC draw methods ─────────────────────────────────────────────

  private drawMakerNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0x5D4037;   // brown hair
    const SHIRT = 0xBF360C;   // plaid red
    const PANTS = 0x37474F;
    const SHOES = 0x3E2723;   // dark boots
    // South
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      // Plaid lines
      g.fillStyle(0x8B2500);
      [12,16,20].forEach(x => g.fillRect(x,15,1,10));
      // Beard (outline then fill)
      g.fillStyle(K); g.fillRect(10,12,12,5);
      g.fillStyle(0x4E342E); g.fillRect(11,13,10,4);
      // Cowboy hat (outline then fill)
      g.fillStyle(K); g.fillRect(7,0,18,7); g.fillRect(2,4,28,4);
      g.fillStyle(0x111111); g.fillRect(8,1,16,5);    // crown
      g.fillStyle(0x111111); g.fillRect(3,5,26,2);    // brim
      g.fillStyle(0xDD4400); g.fillRect(8,5,16,1);    // orange band
      // Axe prop right side
      g.fillStyle(K); g.fillRect(22,13,7,13);
      g.fillStyle(0x5D4037); g.fillRect(23,16,3,9);   // handle
      g.fillStyle(0x9E9E9E); g.fillRect(22,14,5,4);   // blade
      g.fillStyle(0xBDBDBD); g.fillRect(23,14,2,3);   // blade highlight
      g.generateTexture('npc_maker_s', 32, 32); g.destroy();
    }
    // North
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      g.fillStyle(0x8B2500);
      [12,16,20].forEach(x => g.fillRect(x,13,1,10));
      // Hat (back view)
      g.fillStyle(K); g.fillRect(7,0,18,7); g.fillRect(2,4,28,4);
      g.fillStyle(0x111111); g.fillRect(8,1,16,5);
      g.fillStyle(0x111111); g.fillRect(3,5,26,2);
      g.fillStyle(0xDD4400); g.fillRect(8,5,16,1);
      g.generateTexture('npc_maker_n', 32, 32); g.destroy();
    }
  }

  private drawPodcasterNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0x6A1B9A;   // purple hair
    const SHIRT = 0x08D7A9;   // PB teal
    const PANTS = 0x06102B;
    const SHOES = 0xC42DD7;   // purple

    const drawHP = (g: Phaser.GameObjects.Graphics) => {
      // Headphones
      g.fillStyle(K);       g.fillRect(8,1,16,3);
      g.fillStyle(0x1A1A1A); g.fillRect(9,2,14,2);   // band
      g.fillStyle(K);       g.fillRect(4,3,7,9);     // cup L outline
      g.fillStyle(K);       g.fillRect(21,3,7,9);    // cup R outline
      g.fillStyle(0x444444); g.fillRect(5,4,5,7);    // cup L
      g.fillStyle(0x444444); g.fillRect(22,4,5,7);   // cup R
      g.fillStyle(0xC42DD7); g.fillRect(6,5,3,5);    // accent L
      g.fillStyle(0xC42DD7); g.fillRect(23,5,3,5);   // accent R
    };
    // South
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      drawHP(g);
      // Mic prop right side
      g.fillStyle(K); g.fillRect(23,13,5,13);
      g.fillStyle(0x888888); g.fillRect(24,17,2,9);  // stand
      g.fillStyle(K); g.fillRect(22,12,6,7);
      g.fillStyle(0xCCCCCC); g.fillRect(23,13,4,5);  // mic head
      g.fillStyle(0xAAAAAA); g.fillRect(23,13,4,1);  // grille top
      g.generateTexture('npc_podcaster_s', 32, 32); g.destroy();
    }
    // North
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      drawHP(g);
      g.generateTexture('npc_podcaster_n', 32, 32); g.destroy();
    }
  }

  private drawDeveloperNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0x1A237E;   // navy hair
    const SHIRT = 0x37474F;   // charcoal hoodie
    const PANTS = 0x212121;
    const SHOES = 0x1A1A1A;
    // South
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      // Glasses
      g.fillStyle(K);
      g.fillRect(11,10,4,3);   // left frame
      g.fillRect(17,10,4,3);   // right frame
      g.fillRect(15,11,2,1);   // bridge
      g.fillRect(10,11,1,1);   // left temple
      g.fillRect(21,11,1,1);   // right temple
      g.fillStyle(0x2236A0); g.fillRect(12,11,2,1);  // lens L tint
      g.fillStyle(0x2236A0); g.fillRect(18,11,2,1);  // lens R tint
      // Kangaroo pocket on hoodie
      g.fillStyle(0x2E3A42); g.fillRect(13,20,6,4);
      g.fillStyle(0x263238); g.fillRect(14,21,4,2);
      g.generateTexture('npc_developer_s', 32, 32); g.destroy();
    }
    // North
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      g.fillStyle(0x2E3A42); g.fillRect(13,18,6,4);
      g.generateTexture('npc_developer_n', 32, 32); g.destroy();
    }
  }

  private drawEngineerNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0x212121;   // black hair
    const SHIRT = 0x1565C0;   // blue
    const PANTS = 0x263238;
    const SHOES = 0x121212;

    const drawHat = (g: Phaser.GameObjects.Graphics) => {
      g.fillStyle(K); g.fillRect(7,0,18,8); g.fillRect(5,5,22,4);
      g.fillStyle(0xFDD835); g.fillRect(8,1,16,6);   // hat top yellow
      g.fillStyle(0xFBC02D); g.fillRect(6,6,20,2);   // brim
      g.fillStyle(0xE6AC00); g.fillRect(13,3,6,2);   // venting slit
    };
    // South
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      drawHat(g);
      // Tool belt stripe
      g.fillStyle(0x5D4037); g.fillRect(9,23,14,2);
      g.fillStyle(0xFDD835); g.fillRect(13,23,2,2);  // buckle
      g.generateTexture('npc_engineer_s', 32, 32); g.destroy();
    }
    // North
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      drawHat(g);
      g.generateTexture('npc_engineer_n', 32, 32); g.destroy();
    }
  }

  private drawCasualNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0x795548;   // brown hair
    const SHIRT = 0x8D6E63;   // warm khaki
    const PANTS = 0x2E4057;
    const SHOES = 0x4A2C2A;
    // South
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      // Ball cap (front brim extends forward)
      g.fillStyle(K); g.fillRect(7,1,18,7); g.fillRect(4,6,16,3);
      g.fillStyle(0x388E3C); g.fillRect(8,2,16,5);   // cap body
      g.fillStyle(0x2E7D32); g.fillRect(5,7,14,2);   // brim
      g.fillStyle(0x1B5E20); g.fillRect(14,3,1,2);   // button
      // Coffee cup (right hand)
      g.fillStyle(K); g.fillRect(22,16,8,10);
      g.fillStyle(0xF5F5F5); g.fillRect(23,17,5,7);
      g.fillStyle(0xDD4400); g.fillRect(23,17,5,1);  // sleeve stripe
      g.fillStyle(0xBBBBBB); g.fillRect(28,19,2,2);  // handle
      g.generateTexture('npc_casual_s', 32, 32); g.destroy();
    }
    // North
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      // Cap back view (rear brim shorter)
      g.fillStyle(K); g.fillRect(7,1,18,7); g.fillRect(14,6,10,3);
      g.fillStyle(0x388E3C); g.fillRect(8,2,16,5);
      g.fillStyle(0x2E7D32); g.fillRect(15,7,8,2);   // rear brim
      g.generateTexture('npc_casual_n', 32, 32); g.destroy();
    }
  }

  private drawProfessionalNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0x78909C;   // grey hair
    const SHIRT = 0x0D47A1;   // navy suit jacket
    const PANTS = 0x1A237E;
    const SHOES = 0x0A0A0A;
    // South
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      // White shirt collar
      g.fillStyle(0xFFFFFF);
      g.fillRect(13,14,6,4);
      g.fillRect(13,15,2,5); g.fillRect(17,15,2,5);
      // Red tie
      g.fillStyle(0xC62828); g.fillRect(15,16,2,8);
      g.fillStyle(0xB71C1C); g.fillRect(15,22,2,2);  // tie point
      // Scroll prop (left side)
      g.fillStyle(K); g.fillRect(3,15,9,12);
      g.fillStyle(0xF5F5DC); g.fillRect(4,16,7,9);   // parchment
      g.fillStyle(0xC8A96E); g.fillRect(4,15,7,2);   // top roll
      g.fillStyle(0xC8A96E); g.fillRect(4,24,7,2);   // bottom roll
      g.fillStyle(0x888888);
      [18,20,22].forEach(y => g.fillRect(5,y,4,1));  // text lines
      g.generateTexture('npc_professional_s', 32, 32); g.destroy();
    }
    // North
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      g.generateTexture('npc_professional_n', 32, 32); g.destroy();
    }
  }

  private drawZachNPC() {
    const K     = 0x0A0A0A;
    const HC    = 0xDD4400;   // orange — signature Zach color
    const SHIRT = 0xDD4400;   // matching orange shirt
    const PANTS = 0x1565C0;   // blue
    const SHOES = 0xDD4400;   // orange
    // South — front spike visible
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'S', HC, SHIRT, PANTS, SHOES);
      // Front hair spike
      g.fillStyle(K);      g.fillRect(13,0,6,4);      // spike outline
      g.fillStyle(HC);     g.fillRect(14,1,4,3);      // spike fill
      g.fillStyle(0xC74000); g.fillRect(14,1,1,3);    // spike shadow
      // Stubble / beard hint
      g.fillStyle(0xC74000); g.fillRect(12,13,8,2);
      g.generateTexture('npc_zach_s', 32, 32); g.destroy();
    }
    // North — small bump at crown
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      this.npcBase(g, 'N', HC, SHIRT, PANTS, SHOES);
      g.fillStyle(K);      g.fillRect(13,0,6,4);
      g.fillStyle(HC);     g.fillRect(14,1,4,3);
      g.fillStyle(0xC74000); g.fillRect(14,1,1,3);
      g.generateTexture('npc_zach_n', 32, 32); g.destroy();
    }
  }

  // ── Cameraman (film / 1st AD NPC) ────────────────────────────────────────

  private genCameramanSprite() {
    // Dark clothes — director/crew look
    const SHIRT  = 0x1A1A1A;
    const PANTS  = 0x2A2A2A;
    const SHOES  = 0x111111;
    const HAIR   = 0x2C1A0E;
    const SKIN_C = 0xC68642;
    // Camera colors
    const CAM_B  = 0x222222;  // camera body
    const CAM_L  = 0x111111;  // lens
    const CAM_H  = 0x888888;  // highlight
    const CAM_R  = 0xFF2222;  // record light

    // ── Facing South (camera pointed at viewer) ──
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Body
      g.fillStyle(PANTS); g.fillRect(9, 20, 14, 12);           // legs
      g.fillStyle(0x0A0A0A); g.fillRect(15, 20, 2, 12);        // leg divider
      g.fillStyle(SHOES);  g.fillRect(8,  30, 6,  4);          // shoe L
                            g.fillRect(18, 30, 6,  4);         // shoe R
      g.fillStyle(SHIRT);  g.fillRect(8,  10, 16, 12);         // torso
      // Arms holding camera
      g.fillStyle(SKIN_C); g.fillRect(5,  12, 4, 6);           // arm L
                            g.fillRect(23, 12, 4, 6);          // arm R
      // Head
      g.fillStyle(SKIN_C); g.fillRect(10, 2,  12, 10);         // head
      g.fillStyle(HAIR);   g.fillRect(10, 2,  12, 3);          // hair
      g.fillStyle(0x0A0A0A); g.fillRect(13, 7,  2, 2);         // eye L
                              g.fillRect(17, 7,  2, 2);        // eye R
      // Camera body in front of torso (south = facing us, camera points at viewer)
      g.fillStyle(CAM_B);  g.fillRect(7,  13, 18, 10);         // camera body
      g.fillStyle(CAM_L);  g.fillRect(12, 11, 8,  14);         // lens barrel
      g.fillStyle(0x333333); g.fillRect(13, 12, 6,  12);       // lens inner
      g.fillStyle(0x0A0A0A); g.fillRect(14, 13, 4,  10);       // lens dark
      g.fillStyle(CAM_H);  g.fillRect(14, 14, 2,  2);          // lens glint
      g.fillStyle(CAM_R);  g.fillRect(22, 12, 2,  2);          // rec light
      g.generateTexture('npc_cameraman_s', 32, 36); g.destroy();
    }

    // ── Facing North (camera on shoulder, walking away) ──
    {
      const g = this.make.graphics({ x: 0, y: 0 });
      // Body
      g.fillStyle(PANTS); g.fillRect(9, 20, 14, 12);
      g.fillStyle(0x0A0A0A); g.fillRect(15, 20, 2, 12);
      g.fillStyle(SHOES);  g.fillRect(8,  30, 6,  4);
                            g.fillRect(18, 30, 6,  4);
      g.fillStyle(SHIRT);  g.fillRect(8,  10, 16, 12);
      // Arms
      g.fillStyle(SKIN_C); g.fillRect(5,  12, 4, 8);
                            g.fillRect(23, 12, 4, 8);
      // Head (back of head)
      g.fillStyle(HAIR);   g.fillRect(10, 2,  12, 10);
      g.fillStyle(SKIN_C); g.fillRect(10, 8,  12, 4);          // neck/nape
      // Camera on right shoulder
      g.fillStyle(CAM_B);  g.fillRect(19, 4,  12, 8);          // camera body
      g.fillStyle(CAM_L);  g.fillRect(27, 5,  6,  6);          // lens front
      g.fillStyle(0x0A0A0A); g.fillRect(29, 6,  3,  4);        // lens dark
      g.fillStyle(CAM_H);  g.fillRect(19, 5,  3,  2);          // viewfinder
      g.fillStyle(CAM_R);  g.fillRect(20, 4,  2,  2);          // rec light
      g.generateTexture('npc_cameraman_n', 32, 36); g.destroy();
    }
  }

  // ── Brocc (pixel-art broccoli mascot — matches Pixel Broccoli brand) ────────

  private genBroccSprite() {
    // Floret greens (dark forest green, as in the reference image)
    const F_D  = 0x1A6B35;  // dark floret / shadow / outlines within head
    const F_M  = 0x289A4A;  // main floret fill
    const F_L  = 0x3DB85C;  // floret highlight
    // Lime face (lighter yellow-green, lower half of head)
    const FACE  = 0x6BBE2A; // lime face base
    const FACE_L = 0x88D840; // lighter lime cheek highlight
    // Body stem (green stalk below head)
    const STEM  = 0x2E7D32;
    const STEM_L = 0x4CAF50;
    // Details
    const BLACK = 0x0A0A0A;
    const PINK  = 0xFF2D6B;  // tongue — Pixel Broccoli brand red
    const PINK_D = 0xCC1050; // tongue shadow

    const draw = (key: string, dir: 'S' | 'N') => {
      const g = this.make.graphics({ x: 0, y: 0 });

      // ── Floret head silhouette (black border ring first) ──────────────
      g.fillStyle(BLACK); g.fillCircle(16, 11, 14);

      // Main floret fill
      g.fillStyle(F_M); g.fillCircle(16, 11, 12);

      // Three bumps on top (darker inset, lighter highlight)
      g.fillStyle(F_D); g.fillCircle(10, 7,  7);   // left bump
      g.fillStyle(F_L); g.fillCircle(8,  5,  3);   // left highlight
      g.fillStyle(F_D); g.fillCircle(22, 7,  7);   // right bump
      g.fillStyle(F_L); g.fillCircle(20, 5,  3);   // right highlight
      g.fillStyle(F_D); g.fillCircle(16, 4,  6);   // center bump
      g.fillStyle(F_L); g.fillCircle(14, 2,  2);   // center highlight
      // Divot lines between bumps (black pixel gaps = broccoli texture)
      g.fillStyle(BLACK); g.fillRect(12, 7, 1, 4);  // left divot
      g.fillStyle(BLACK); g.fillRect(19, 7, 1, 4);  // right divot
      // Re-fill main body between the bumps so they read as lumps not holes
      g.fillStyle(F_M);   g.fillRect(13, 10, 6, 4);

      if (dir === 'S') {
        // ── Face area (lime green, lower portion of head) ─────────────
        // Black outline for face region
        g.fillStyle(BLACK);  g.fillRect(7,  14, 18, 10);
        g.fillStyle(BLACK);  g.fillRect(5,  16, 22,  7);  // wider middle
        // Lime fill (slightly inset from black border)
        g.fillStyle(FACE);   g.fillRect(8,  14, 16, 9);
        g.fillStyle(FACE);   g.fillRect(6,  16, 20, 6);   // wider lime area
        // Cheek highlights
        g.fillStyle(FACE_L); g.fillRect(9,  15, 3, 3);    // left cheek
        g.fillStyle(FACE_L); g.fillRect(20, 15, 3, 3);    // right cheek

        // ── Eyes (happy closed squints — ^^) ─────────────────────────
        g.fillStyle(BLACK);
        // Left eye arc (4px wide, tilts down at edges = squint)
        g.fillRect(10, 16, 5, 1);   // top bar
        g.fillRect(10, 17, 1, 1);   // left foot
        g.fillRect(14, 17, 1, 1);   // right foot
        // Right eye arc
        g.fillRect(17, 16, 5, 1);
        g.fillRect(17, 17, 1, 1);
        g.fillRect(21, 17, 1, 1);

        // ── Mouth (wide open smile with pink tongue) ──────────────────
        g.fillStyle(BLACK);  g.fillRect(9,  19, 14, 5);   // mouth outer
        g.fillStyle(PINK);   g.fillRect(10, 20, 12, 3);   // pink inside
        g.fillStyle(PINK_D); g.fillRect(13, 22, 6,  1);   // tongue crease

        // Re-clip the round head shape over face corners
        g.fillStyle(BLACK); g.fillRect(5, 14, 2, 2);      // clip bottom-left
        g.fillStyle(BLACK); g.fillRect(25, 14, 2, 2);     // clip bottom-right
      } else {
        // ── North — back of head, all floret ─────────────────────────
        // Same bump arrangement slightly adjusted for back view
        g.fillStyle(F_M); g.fillCircle(16, 11, 12);
        g.fillStyle(F_D); g.fillCircle(10, 8, 6);
        g.fillStyle(F_L); g.fillCircle(8,  6, 2);
        g.fillStyle(F_D); g.fillCircle(22, 8, 6);
        g.fillStyle(F_L); g.fillCircle(20, 6, 2);
        g.fillStyle(F_D); g.fillCircle(16, 5, 5);
        g.fillStyle(F_L); g.fillCircle(14, 3, 2);
        g.fillStyle(BLACK); g.fillRect(12, 8, 1, 4);
        g.fillStyle(BLACK); g.fillRect(19, 8, 1, 4);
        g.fillStyle(F_M);   g.fillRect(13, 11, 6, 3);
      }

      // ── Stem body (below head) ────────────────────────────────────────
      g.fillStyle(BLACK);  g.fillRect(12, 23, 8, 2);      // neck
      g.fillStyle(STEM_L); g.fillRect(13, 23, 6, 2);
      g.fillStyle(BLACK);  g.fillRect(10, 25, 12, 5);     // body outline
      g.fillStyle(STEM);   g.fillRect(11, 25, 10, 4);
      g.fillStyle(STEM_L); g.fillRect(13, 25, 6,  3);     // highlight

      // Legs
      g.fillStyle(BLACK);  g.fillRect(11, 29, 4, 3);
                            g.fillRect(17, 29, 4, 3);
      g.fillStyle(STEM);   g.fillRect(12, 29, 3, 3);
                            g.fillRect(18, 29, 3, 3);

      g.generateTexture(key, 32, 32);
      g.destroy();
    };

    draw('npc_brocc_s', 'S');
    draw('npc_brocc_n', 'N');
  }

  // ── Core character renderer ───────────────────────────────────────────────
  // dir: 'S' = south/front, 'N' = north/back, 'E' = east/side
  // walkB: alternative leg position for stride animation

  private genDecorations() {
    // Tree: 32×40 (trunk + round canopy)
    const tree = this.make.graphics({ x: 0, y: 0 });
    tree.fillStyle(0x2D1B0E); tree.fillRect(12, 28, 8, 12);      // trunk
    tree.fillStyle(0x1A3A1A); tree.fillCircle(16, 18, 16);       // outer canopy
    tree.fillStyle(0x244E24); tree.fillCircle(13, 14, 10);       // inner highlight
    tree.fillStyle(0x2A5E2A); tree.fillCircle(19, 12, 8);        // highlight 2
    tree.generateTexture('tree', 32, 40); tree.destroy();

    // Bench: 32x20
    const bench = this.make.graphics({ x: 0, y: 0 });
    bench.fillStyle(0x6B4226); bench.fillRect(4, 8, 24, 6);      // seat
    bench.fillStyle(0x4A2E18); bench.fillRect(6, 14, 4, 6);      // leg L
                               bench.fillRect(22, 14, 4, 6);     // leg R
    bench.fillStyle(0x8B5E3C); bench.fillRect(4, 5, 24, 3);      // backrest
    bench.generateTexture('bench', 32, 20); bench.destroy();

    // Coin (for proximity indicator on NPC)
    const coin = this.make.graphics({ x: 0, y: 0 });
    coin.fillStyle(PALETTE.ACCENT);  coin.fillCircle(8, 8, 7);
    coin.fillStyle(0xFFEB3B);        coin.fillCircle(8, 7, 4);
    coin.generateTexture('coin', 16, 16); coin.destroy();

    // Lamppost: 16×48 — plaza street lighting
    const lamp = this.make.graphics({ x: 0, y: 0 });
    lamp.fillStyle(0x555555); lamp.fillRect(7, 16, 3, 32);       // pole
    lamp.fillStyle(0x444444); lamp.fillRect(4, 44, 9, 4);        // base
    lamp.fillStyle(0x666666); lamp.fillRect(5, 12, 8, 6);        // arm
    lamp.fillStyle(0xFFEE88); lamp.fillRect(3, 6, 12, 8);        // glass
    lamp.fillStyle(0xFFFF99); lamp.fillRect(5, 8, 8, 4);         // inner glow
    lamp.generateTexture('lamppost', 16, 48); lamp.destroy();

    // Flower pot: 20×22 — plaza color accent
    const pot = this.make.graphics({ x: 0, y: 0 });
    pot.fillStyle(0xBB4422); pot.fillRect(5, 13, 10, 9);         // pot body
    pot.fillStyle(0x993311); pot.fillRect(4, 12, 12, 3);         // pot rim
    pot.fillStyle(0x3A6B2A); pot.fillRect(8, 7, 4, 8);           // stem
    pot.fillStyle(0xE84040); pot.fillCircle(6, 6, 4);            // flower L
    pot.fillStyle(0xE84040); pot.fillCircle(14, 6, 4);           // flower R
    pot.fillStyle(0xF06060); pot.fillCircle(10, 4, 4);           // flower top
    pot.fillStyle(0xFFCC00); pot.fillCircle(10, 6, 2);           // center
    pot.generateTexture('flowerpot', 20, 22); pot.destroy();

    // Crate: 28×28 — workshop + lab storage
    const crate = this.make.graphics({ x: 0, y: 0 });
    crate.fillStyle(0x8B6914); crate.fillRect(2, 2, 24, 24);     // body
    crate.fillStyle(0x6B4F10); crate.fillRect(2, 2, 24, 3);      // top plank
                                crate.fillRect(2, 23, 24, 3);    // bottom plank
                                crate.fillRect(2, 11, 24, 3);    // mid plank
                                crate.fillRect(2, 2, 3, 24);     // left plank
                                crate.fillRect(23, 2, 3, 24);    // right plank
    crate.fillStyle(0xA07820); crate.fillRect(5, 5, 18, 5);      // top panel
                                crate.fillRect(5, 16, 18, 5);    // bottom panel
    crate.generateTexture('crate', 28, 28); crate.destroy();

    // Workbench: 48×28 — workshop zone
    const wb = this.make.graphics({ x: 0, y: 0 });
    wb.fillStyle(0x5C3D1A); wb.fillRect(0, 6, 48, 4);            // bench top surface
    wb.fillStyle(0x7A5020); wb.fillRect(0, 2, 48, 6);            // bench top
    wb.fillStyle(0x4A3015); wb.fillRect(2, 10, 6, 18);           // leg L
                             wb.fillRect(40, 10, 6, 18);         // leg R
                             wb.fillRect(12, 14, 24, 4);         // shelf
    // Tools on top
    wb.fillStyle(0x888888); wb.fillRect(8, 0, 3, 4);             // chisel
    wb.fillStyle(0xAAAAAA); wb.fillRect(14, 1, 8, 2);            // ruler
    wb.fillStyle(0xDD4400); wb.fillRect(26, 0, 6, 3);            // clamp (orange SGW)
    wb.fillStyle(0x555555); wb.fillRect(36, 0, 4, 4);            // mallet head
                             wb.fillRect(37, 3, 2, 5);           // mallet handle
    wb.generateTexture('workbench', 48, 28); wb.destroy();

    // Mic stand: 16×44 — studio zone
    const mic = this.make.graphics({ x: 0, y: 0 });
    mic.fillStyle(0x444444); mic.fillRect(7, 10, 2, 34);         // pole
    mic.fillStyle(0x555555); mic.fillRect(3, 40, 10, 4);         // base L
                              mic.fillRect(5, 38, 6, 4);         // base R
    mic.fillStyle(0x888888); mic.fillRect(5, 4, 6, 8);           // mic body
    mic.fillStyle(0xAAAAAA); mic.fillRect(6, 5, 4, 5);           // mic grill
    mic.fillStyle(0xC42DD7); mic.fillRect(5, 2, 6, 3);           // PB purple top
    mic.generateTexture('micstand', 16, 44); mic.destroy();

    // Computer terminal: 36×36 — office + lab
    const term = this.make.graphics({ x: 0, y: 0 });
    term.fillStyle(0x1A2233); term.fillRect(2, 2, 32, 24);       // monitor body
    term.fillStyle(0x0A1020); term.fillRect(4, 4, 28, 20);       // screen
    term.fillStyle(0x1565C0); term.fillRect(5, 5, 26, 3);        // title bar (Motif blue)
    // Code lines on screen
    term.fillStyle(0x08D7A9); term.fillRect(5, 11, 14, 2);       // line 1 (teal)
    term.fillStyle(0x444466); term.fillRect(21, 11, 7, 2);       // line 1 rest
    term.fillStyle(0xC42DD7); term.fillRect(7, 15, 10, 2);       // line 2 (purple)
    term.fillStyle(0xF0EDE8); term.fillRect(5, 19, 5, 2);        // cursor
    // Stand
    term.fillStyle(0x333344); term.fillRect(16, 26, 4, 6);       // neck
                               term.fillRect(10, 30, 16, 4);     // foot
    term.generateTexture('terminal', 36, 36); term.destroy();

    // RV (Class A motorhome): 96×48 — side view facing right
    // Colors match the actual rig: dark body, tan storage, red swoosh, orange accent
    const rv = this.make.graphics({ x: 0, y: 0 });
    const RV_DARK = 0x1C1C1C;  // dark charcoal body
    const RV_TAN  = 0xBBA070;  // tan lower storage bays
    const RV_ROOF = 0xE2DFDA;  // white roof
    const RV_RED  = 0xCC1500;  // red stripe
    const RV_ORG  = 0xFF5500;  // orange accent / dots
    const RV_WIN  = 0x2A3C50;  // tinted window glass
    const RV_RIM  = 0x999999;  // wheel rim
    const RV_TRE  = 0x111111;  // tire
    const RV_STEP = 0x444444;  // entry step

    // ── Roof ──────────────────────────────────────────────────────────────
    rv.fillStyle(RV_ROOF); rv.fillRect(2, 0, 90, 7);             // white roof panel
    // AC units on roof
    rv.fillStyle(0xBBBBBB); rv.fillRect(18, 0, 12, 4);           // AC unit front
    rv.fillStyle(0xBBBBBB); rv.fillRect(58, 0, 12, 4);           // AC unit rear
    rv.fillStyle(0xCCCCCC); rv.fillRect(19, 1, 10, 2);
    rv.fillStyle(0xCCCCCC); rv.fillRect(59, 1, 10, 2);

    // ── Main dark body ────────────────────────────────────────────────────
    rv.fillStyle(RV_DARK); rv.fillRect(2, 6, 90, 26);            // body slab

    // Front cap (cab area) — slight rounding with stepped corners
    rv.fillStyle(RV_DARK); rv.fillRect(85, 6,  7, 26);           // front cap
    rv.fillStyle(RV_ROOF); rv.fillRect(90, 6,  2, 4);            // front corner clip top
    rv.fillStyle(RV_ORG);  rv.fillRect(85, 6,  8, 10);           // orange cab face
    // Front windshield
    rv.fillStyle(RV_WIN);  rv.fillRect(86, 8,  6, 8);

    // ── Windows ───────────────────────────────────────────────────────────
    rv.fillStyle(RV_WIN);  rv.fillRect(8,  9, 14, 9);            // window 1
    rv.fillStyle(RV_WIN);  rv.fillRect(26, 9, 10, 9);            // window 2 (smaller)
    rv.fillStyle(RV_WIN);  rv.fillRect(40, 9, 12, 9);            // window 3
    rv.fillStyle(RV_WIN);  rv.fillRect(56, 9,  8, 5);            // window 4 (top vent)
    rv.fillStyle(RV_WIN);  rv.fillRect(68, 9, 12, 9);            // window 5 (bedroom)
    // Window frames (slightly lighter than body)
    rv.fillStyle(0x333333);
    rv.strokeRect(8, 9, 14, 9);
    rv.strokeRect(40, 9, 12, 9);
    rv.strokeRect(68, 9, 12, 9);

    // ── Red stripe (bold horizontal slash across the body) ────────────────
    rv.fillStyle(RV_RED); rv.fillRect(2,  20, 84, 5);            // main red stripe
    // Swoosh — diagonal graphic cutting into the stripe
    rv.fillStyle(RV_DARK); rv.fillRect(36, 18, 18, 9);           // dark break in stripe
    rv.fillStyle(RV_DARK); rv.fillRect(34, 19, 4,  7);           // left edge of break
    rv.fillStyle(RV_DARK); rv.fillRect(54, 18, 4,  8);           // right edge of break
    // Orange accent bubble cluster (matches the orange dots on the real rig)
    rv.fillStyle(RV_ORG); rv.fillCircle(48, 21, 4);
    rv.fillStyle(RV_ORG); rv.fillCircle(43, 23, 2);
    rv.fillStyle(RV_ORG); rv.fillCircle(53, 23, 2);

    // ── Tan lower storage bays ────────────────────────────────────────────
    rv.fillStyle(RV_TAN); rv.fillRect(2, 31, 84, 11);            // storage panel
    // Bay door seams
    rv.fillStyle(0x9A8060);
    rv.lineBetween(22, 31, 22, 42);                              // seam 1
    rv.lineBetween(42, 31, 42, 42);                              // seam 2
    rv.lineBetween(62, 31, 62, 42);                              // seam 3
    // Bay door hinges (tiny dark rects)
    rv.fillStyle(0x777777);
    rv.fillRect(23, 33, 2, 2); rv.fillRect(23, 38, 2, 2);
    rv.fillRect(43, 33, 2, 2); rv.fillRect(43, 38, 2, 2);
    rv.fillRect(63, 33, 2, 2); rv.fillRect(63, 38, 2, 2);

    // ── Entry steps ───────────────────────────────────────────────────────
    rv.fillStyle(RV_STEP); rv.fillRect(58, 38, 8, 3);            // step 1
    rv.fillStyle(RV_STEP); rv.fillRect(59, 41, 6, 2);            // step 2 (lower)

    // ── Wheels ────────────────────────────────────────────────────────────
    rv.fillStyle(RV_TRE); rv.fillCircle(16, 43, 5);              // rear tire
    rv.fillStyle(RV_RIM); rv.fillCircle(16, 43, 3);
    rv.fillStyle(RV_TRE); rv.fillCircle(15, 43, 2);              // hub
    rv.fillStyle(RV_TRE); rv.fillCircle(80, 43, 5);              // front tire
    rv.fillStyle(RV_RIM); rv.fillCircle(80, 43, 3);
    rv.fillStyle(RV_TRE); rv.fillCircle(80, 43, 2);

    // ── Rear bumper ───────────────────────────────────────────────────────
    rv.fillStyle(0x888888); rv.fillRect(2, 39, 4, 4);
    // Front bumper
    rv.fillStyle(0x888888); rv.fillRect(90, 36, 4, 6);

    rv.generateTexture('rv', 96, 48); rv.destroy();

    // Jeep Wrangler Rubicon: 64×44 side view facing right
    // Crush Orange body, black hard top + fenders, roof rack, big black tires
    const jeep = this.make.graphics({ x: 0, y: 0 });
    const J_ORG = 0xE05A08;  // Crush Orange
    const J_BLK = 0x111111;  // hard top, fenders, tires
    const J_WIN = 0x1C2C3C;  // dark tinted windows
    const J_RIM = 0x2A2A2A;  // black rims
    const J_RCK = 0x303030;  // roof rack platform
    const J_SHD = 0x7A2800;  // panel line / shadow on orange

    // ── Roof rack (Gobi-style overland platform) ─────────────────────────
    jeep.fillStyle(J_RCK); jeep.fillRect(9, 0, 38, 3);           // rack platform
    jeep.fillStyle(0x505050); jeep.fillRect(9, 0, 38, 1);        // top rail
    jeep.fillStyle(J_RCK); jeep.fillRect(12, 3, 3, 3);           // leg front
    jeep.fillStyle(J_RCK); jeep.fillRect(42, 3, 3, 3);           // leg rear

    // ── Hard top (cab) ────────────────────────────────────────────────────
    jeep.fillStyle(J_BLK); jeep.fillRect(8, 5, 44, 16);          // hard top slab

    // ── Windows (4 windows across 4-door cab) ────────────────────────────
    jeep.fillStyle(J_WIN); jeep.fillRect(10, 8, 8,  9);          // rear quarter
    jeep.fillStyle(J_WIN); jeep.fillRect(20, 8, 10, 9);          // rear door window
    jeep.fillStyle(J_WIN); jeep.fillRect(32, 8, 10, 9);          // front door window
    jeep.fillStyle(J_WIN); jeep.fillRect(44, 6, 8,  13);         // windshield

    // ── Hood (flat, slightly lower than cab) ─────────────────────────────
    jeep.fillStyle(J_ORG); jeep.fillRect(50, 14, 10, 7);         // hood
    jeep.fillStyle(J_SHD); jeep.fillRect(50, 20, 10, 1);         // hood edge shadow

    // ── Front face (grille + headlight) ──────────────────────────────────
    jeep.fillStyle(J_ORG); jeep.fillRect(58, 12, 6, 18);         // front fender cap
    jeep.fillStyle(J_BLK); jeep.fillRect(59, 16, 4, 12);         // grille opening
    // 7-slot grille lines
    jeep.fillStyle(0x333333);
    for (let i = 0; i < 5; i++) jeep.fillRect(60, 17 + i * 2, 2, 1);
    // Round headlight
    jeep.fillStyle(0xFFDD44); jeep.fillCircle(61, 14, 3);
    jeep.fillStyle(0xFFFFAA); jeep.fillCircle(61, 14, 1);
    // Front bumper
    jeep.fillStyle(J_BLK); jeep.fillRect(56, 28, 8, 4);

    // ── Orange body / doors ───────────────────────────────────────────────
    jeep.fillStyle(J_ORG); jeep.fillRect(6, 20, 50, 12);         // door slab
    // Door seam lines
    jeep.fillStyle(J_SHD);
    jeep.fillRect(20, 20, 1, 12);   // seam 1
    jeep.fillRect(32, 20, 1, 12);   // seam 2
    jeep.fillRect(44, 20, 1, 12);   // seam 3 (A-pillar)

    // ── Rocker panel / side step ──────────────────────────────────────────
    jeep.fillStyle(J_BLK); jeep.fillRect(14, 31, 40, 3);         // side step

    // ── Fender flares (black, oversized) ─────────────────────────────────
    jeep.fillStyle(J_BLK); jeep.fillRect(2,  26, 22, 10);        // rear flare
    jeep.fillStyle(J_BLK); jeep.fillRect(42, 24, 22, 12);        // front flare

    // ── Spare tire on rear ────────────────────────────────────────────────
    jeep.fillStyle(J_BLK); jeep.fillCircle(4, 26, 7);
    jeep.fillStyle(J_RIM); jeep.fillCircle(4, 26, 4);
    jeep.fillStyle(J_BLK); jeep.fillCircle(4, 26, 2);

    // ── Big chunky tires ──────────────────────────────────────────────────
    jeep.fillStyle(J_BLK); jeep.fillCircle(13, 36, 8);           // rear tire
    jeep.fillStyle(J_RIM); jeep.fillCircle(13, 36, 5);
    jeep.fillStyle(J_BLK); jeep.fillCircle(13, 36, 2);
    jeep.fillStyle(J_BLK); jeep.fillCircle(51, 36, 8);           // front tire
    jeep.fillStyle(J_RIM); jeep.fillCircle(51, 36, 5);
    jeep.fillStyle(J_BLK); jeep.fillCircle(51, 36, 2);

    // ── Rear bumper ───────────────────────────────────────────────────────
    jeep.fillStyle(J_BLK); jeep.fillRect(2, 28, 6, 5);

    jeep.generateTexture('jeep', 64, 44); jeep.destroy();

    // Campfire: 24×28 — flickering log fire for campsite scene
    const fire = this.make.graphics({ x: 0, y: 0 });
    // Logs
    fire.fillStyle(0x3D1F0A); fire.fillRect(3, 20, 18, 5);       // main log
    fire.fillStyle(0x2A1200); fire.fillRect(6, 22, 12, 3);       // log shadow
    fire.fillStyle(0x3D1F0A); fire.fillRect(1, 22, 8, 4);        // side log L
    fire.fillStyle(0x3D1F0A); fire.fillRect(15, 22, 8, 4);       // side log R
    // Embers at base
    fire.fillStyle(0xFF5500); fire.fillRect(8, 19, 8, 3);
    fire.fillStyle(0xFF8800); fire.fillRect(9, 18, 6, 2);
    // Flame body (orange base)
    fire.fillStyle(0xFF4400); fire.fillRect(7, 10, 10, 10);
    fire.fillStyle(0xFF4400); fire.fillRect(5, 13, 14, 8);
    // Flame mid (yellow-orange)
    fire.fillStyle(0xFF8800); fire.fillRect(8, 8,  8, 10);
    fire.fillStyle(0xFF8800); fire.fillRect(6, 11, 12, 8);
    // Flame tip (bright yellow)
    fire.fillStyle(0xFFCC00); fire.fillRect(9, 5,  6, 8);
    fire.fillStyle(0xFFEE44); fire.fillRect(10, 3, 4, 5);
    fire.fillStyle(0xFFFFAA); fire.fillRect(11, 1, 2, 4);
    fire.generateTexture('campfire', 24, 28); fire.destroy();

    // Campfire glow: 48×48 soft radial — tweened for flicker effect
    const glow = this.make.graphics({ x: 0, y: 0 });
    glow.fillStyle(0xFF6600, 0.18); glow.fillCircle(24, 24, 24);
    glow.fillStyle(0xFF8800, 0.22); glow.fillCircle(24, 24, 16);
    glow.fillStyle(0xFFAA00, 0.28); glow.fillCircle(24, 24, 8);
    glow.generateTexture('campfire_glow', 48, 48); glow.destroy();

    // Rock cluster: 36×20 — off-road trail rocks
    const rock = this.make.graphics({ x: 0, y: 0 });
    // Big rock
    rock.fillStyle(0x555555); rock.fillRect(2, 8, 18, 12);
    rock.fillStyle(0x444444); rock.fillRect(2, 15, 18, 5);       // shadow underside
    rock.fillStyle(0x777777); rock.fillRect(3, 8, 10, 5);        // highlight face
    rock.fillStyle(0x888888); rock.fillRect(4, 9, 4, 2);         // specular
    // Med rock
    rock.fillStyle(0x4A4A4A); rock.fillRect(18, 10, 12, 10);
    rock.fillStyle(0x666666); rock.fillRect(19, 10, 6, 4);
    // Small rock
    rock.fillStyle(0x505050); rock.fillRect(30, 14, 6, 6);
    rock.fillStyle(0x686868); rock.fillRect(31, 14, 3, 2);
    rock.generateTexture('rock', 36, 20); rock.destroy();

    // Mud track: 64×16 — tire ruts for off-road scene
    const mud = this.make.graphics({ x: 0, y: 0 });
    mud.fillStyle(0x3A2A1A); mud.fillRect(0, 0, 64, 16);         // mud base
    mud.fillStyle(0x2A1A0A); mud.fillRect(4, 3, 10, 10);         // left rut
    mud.fillStyle(0x2A1A0A); mud.fillRect(50, 3, 10, 10);        // right rut
    mud.fillStyle(0x4A3A28); mud.fillRect(16, 6, 32, 4);         // mid dry strip
    mud.generateTexture('mudtrack', 64, 16); mud.destroy();

    // Southern Woodworkers sign: 48×52 — simple gold badge/shield + post
    const sww = this.make.graphics({ x: 0, y: 0 });
    const SW_GOLD = 0xF0A800;
    const SW_BRN  = 0x3D2200;
    const SW_POST = 0x5C3D1A;

    // Post
    sww.fillStyle(SW_POST); sww.fillRect(22, 44, 4, 8);
    sww.fillStyle(0x4A3015); sww.fillRect(23, 44, 2, 8);

    // Shield outer (brown border) — hexagonal badge
    sww.fillStyle(SW_BRN); sww.fillRect(4, 0, 40, 44);
    sww.fillStyle(SW_BRN); sww.fillRect(0, 6, 48, 34);
    sww.fillStyle(SW_BRN); sww.fillRect(14, 40, 20, 6);
    sww.fillStyle(SW_BRN); sww.fillRect(18, 44, 12, 4);
    sww.fillStyle(SW_BRN); sww.fillRect(22, 46, 4, 2);

    // Gold fill (inset 3px)
    sww.fillStyle(SW_GOLD); sww.fillRect(7, 3, 34, 38);
    sww.fillStyle(SW_GOLD); sww.fillRect(3, 9, 42, 28);
    sww.fillStyle(SW_GOLD); sww.fillRect(17, 39, 14, 5);
    sww.fillStyle(SW_GOLD); sww.fillRect(20, 42, 8, 3);
    sww.fillStyle(SW_GOLD); sww.fillRect(23, 44, 2, 2);

    // Inner border line (thin brown inset)
    sww.lineStyle(1, SW_BRN, 0.6);
    sww.strokeRect(9, 5, 30, 34);

    sww.generateTexture('sww_sign', 48, 52); sww.destroy();

    // Signpost: 24×40 — plaza / zone entrances
    const sign = this.make.graphics({ x: 0, y: 0 });
    sign.fillStyle(0x4A3015); sign.fillRect(11, 16, 4, 24);      // post
    sign.fillStyle(0x7A5020); sign.fillRect(2, 6, 20, 12);       // sign board
    sign.fillStyle(0x5C3D10); sign.fillRect(2, 6, 20, 2);        // board top
                               sign.fillRect(2, 16, 20, 2);      // board bottom
    sign.fillStyle(0xF0EDE8); sign.fillRect(5, 9, 14, 2);        // text line 1
                               sign.fillRect(5, 13, 10, 2);      // text line 2
    sign.generateTexture('signpost', 24, 40); sign.destroy();
    // ═══════════════════════════════════════════════════════════════════════
    //  ZONE BUILDINGS (top-down 3/4 view: roof + front face visible)
    // ═══════════════════════════════════════════════════════════════════════

    // ── Workshop cabin: 120×88 ────────────────────────────────────────────
    {
      const b = this.make.graphics({ x: 0, y: 0 });
      // Roof — orange-brown shingles, ridge down center
      b.fillStyle(0xB05A20); b.fillRect(6, 0, 108, 62);          // right half (darker)
      b.fillStyle(0xC86828); b.fillRect(6, 0, 54, 62);           // left half (lighter)
      b.fillStyle(0xE0885A); b.fillRect(58, 0, 4, 62);           // ridge
      // Shingle row marks
      b.fillStyle(0x7A3E14, 0.35);
      for (let y = 9; y < 62; y += 10) b.fillRect(6, y, 108, 2);
      // Chimney stub (top-right)
      b.fillStyle(0x3A2820); b.fillRect(96, 0, 14, 10);
      b.fillStyle(0x2A1E16); b.fillRect(97, 0, 12, 8);
      b.fillStyle(0x5A4030, 0.5); b.fillRect(96, 9, 14, 2);     // chimney shadow
      // Front wall (south face)
      b.fillStyle(0x7A5030); b.fillRect(6, 62, 108, 20);         // log wall
      b.fillStyle(0x4A3018); b.fillRect(6, 62, 108, 3);          // wall-roof shadow
      // Log grain lines
      b.fillStyle(0x5A3820, 0.3);
      for (let y = 66; y < 82; y += 5) b.fillRect(6, y, 108, 1);
      // Door
      b.fillStyle(0x281408); b.fillRect(52, 66, 16, 16);
      b.fillStyle(0x6A4020); b.fillRect(66, 71, 2, 3);           // handle
      // Windows
      b.fillStyle(0x7AB8D8); b.fillRect(14, 65, 18, 13);
      b.fillStyle(0x7AB8D8); b.fillRect(88, 65, 18, 13);
      b.fillStyle(0x3A2818, 0.5); b.fillRect(22, 65, 2, 13); b.fillRect(96, 65, 2, 13);
      b.generateTexture('bldg_workshop', 120, 88); b.destroy();
    }

    // ── Studio building: 120×88 — dark modern with satellite dish ─────────
    {
      const b = this.make.graphics({ x: 0, y: 0 });
      // Roof — near-black flat roof
      b.fillStyle(0x14141E); b.fillRect(6, 0, 108, 62);
      b.fillStyle(0x1E1E2A); b.fillRect(6, 0, 108, 4);           // roof edge
      // Satellite dish on roof (top-left)
      b.fillStyle(0x888888); b.fillEllipse(26, 16, 24, 16);
      b.fillStyle(0xAAAAAA); b.fillEllipse(25, 15, 20, 13);
      b.fillStyle(0x666666); b.fillRect(25, 24, 2, 10);          // dish arm
      b.fillStyle(0xDD4400); b.fillCircle(26, 34, 3);            // feed
      // AC units on roof
      b.fillStyle(0x666666); b.fillRect(70, 10, 20, 12); b.fillRect(95, 22, 14, 10);
      b.fillStyle(0x888888); b.fillRect(71, 11, 18, 5); b.fillRect(96, 23, 12, 4);
      // Purple accent stripe
      b.fillStyle(0xC42DD7); b.fillRect(6, 58, 108, 4);
      // Front wall
      b.fillStyle(0x18181E); b.fillRect(6, 62, 108, 20);
      b.fillStyle(0x14141A); b.fillRect(6, 62, 108, 3);
      // Glass front
      b.fillStyle(0x1A3050); b.fillRect(14, 64, 92, 16);
      b.fillStyle(0x2A4868, 0.6);
      for (let x = 14; x < 106; x += 14) b.fillRect(x, 64, 12, 16);
      // Door/entry
      b.fillStyle(0x0A0A12); b.fillRect(52, 66, 16, 14);
      b.generateTexture('bldg_studio', 120, 88); b.destroy();
    }

    // ── Office/design building: 120×88 — modern blue-grey ─────────────────
    {
      const b = this.make.graphics({ x: 0, y: 0 });
      // Roof — flat modern
      b.fillStyle(0x2A3848); b.fillRect(6, 0, 108, 62);
      b.fillStyle(0x364858); b.fillRect(6, 0, 108, 4);
      // HVAC / roof detail
      b.fillStyle(0x445568); b.fillRect(20, 10, 30, 16); b.fillRect(70, 14, 24, 12);
      b.fillStyle(0x566878); b.fillRect(21, 11, 28, 8); b.fillRect(71, 15, 22, 6);
      // Blue accent
      b.fillStyle(0x1565C0); b.fillRect(6, 58, 108, 4);
      // Front wall — glass curtain
      b.fillStyle(0x1A2838); b.fillRect(6, 62, 108, 20);
      b.fillStyle(0x2A4070, 0.7);
      for (let x = 8; x < 114; x += 16) b.fillRect(x, 64, 13, 16);
      b.fillStyle(0x4A70A0, 0.4);
      for (let x = 8; x < 114; x += 16) b.fillRect(x, 64, 13, 7);
      // Door
      b.fillStyle(0x0A1824); b.fillRect(52, 65, 16, 17);
      b.fillStyle(0x3A6090); b.fillRect(66, 71, 2, 4);
      b.generateTexture('bldg_office', 120, 88); b.destroy();
    }

    // ── Tech lab building: 120×88 — dark with circuit traces ──────────────
    {
      const b = this.make.graphics({ x: 0, y: 0 });
      b.fillStyle(0x080C0E); b.fillRect(6, 0, 108, 88);          // base
      // Roof circuit traces
      b.lineStyle(1, 0x004820, 0.6);
      [8,20,38,62,80,100].forEach(x => b.lineBetween(x, 0, x, 62));
      [8,20,34,48,58].forEach(y => b.lineBetween(6, y, 114, y));
      b.fillStyle(0x00FF44, 0.8);
      [[20,20],[38,8],[80,34],[100,20],[62,48]].forEach(([x,y]) => b.fillRect(x-1,y-1,3,3));
      // Green accent line
      b.fillStyle(0x00CC44); b.fillRect(6, 58, 108, 3);
      // Server antenna on roof
      b.fillStyle(0x333333); b.fillRect(100, 0, 4, 14);
      b.fillStyle(0x555555); b.fillRect(98, 0, 2, 14); b.fillRect(104, 4, 8, 2);
      b.fillStyle(0xFF4400); b.fillRect(111, 3, 2, 2);           // blink light
      // Front face
      b.fillStyle(0x0A0E10); b.fillRect(6, 62, 108, 20);
      b.fillStyle(0x0D2218); b.fillRect(6, 62, 108, 3);
      // LED strip windows
      b.fillStyle(0x00AA44, 0.9); b.fillRect(14, 66, 40, 8);
      b.fillStyle(0x0066CC, 0.9); b.fillRect(66, 66, 40, 8);
      b.fillStyle(0x00FF66, 0.4);
      for (let x = 14; x < 54; x += 8) b.fillRect(x, 66, 6, 8);
      b.generateTexture('bldg_projects', 120, 88); b.destroy();
    }

    // ── Church building: 80×100 — white with steeple ──────────────────────
    {
      const b = this.make.graphics({ x: 0, y: 0 });
      // Steeple (top — pointed tower viewed from above)
      b.fillStyle(0xA0A0A8); b.fillRect(30, 0, 20, 28);          // steeple body
      b.fillStyle(0xC8C8D0); b.fillRect(31, 0, 18, 26);
      b.fillStyle(0xF0EDE8); b.fillRect(36, 2, 8, 10);           // steeple cap top
      // Cross on steeple
      b.fillStyle(0x888890); b.fillRect(38, 4, 4, 12); b.fillRect(34, 7, 12, 4);
      b.fillStyle(0xFFFFFF); b.fillRect(39, 5, 2, 4); b.fillRect(35, 8, 10, 2);
      // Steeple base
      b.fillStyle(0x8A8A92); b.fillRect(26, 25, 28, 6);
      // Main church roof — grey shingles
      b.fillStyle(0x787880); b.fillRect(4, 30, 72, 40);
      b.fillStyle(0x8E8E96); b.fillRect(4, 30, 36, 40);          // left lighter
      b.fillStyle(0xA0A0A8); b.fillRect(38, 30, 2, 40);          // ridge
      // Shingle marks
      b.fillStyle(0x585860, 0.4);
      for (let y = 38; y < 70; y += 8) b.fillRect(4, y, 72, 2);
      // Front wall
      b.fillStyle(0xE8E4DC); b.fillRect(4, 70, 72, 24);
      b.fillStyle(0xC8C4BC); b.fillRect(4, 70, 72, 3);
      // Arched window (left)
      b.fillStyle(0x7AB8D8); b.fillRect(8, 74, 14, 16);
      b.fillStyle(0x7AB8D8); b.fillEllipse(15, 74, 14, 8);
      // Arched window (right)
      b.fillStyle(0x7AB8D8); b.fillRect(58, 74, 14, 16);
      b.fillStyle(0x7AB8D8); b.fillEllipse(65, 74, 14, 8);
      // Door arch
      b.fillStyle(0x3A2818); b.fillRect(32, 76, 16, 18);
      b.fillStyle(0x3A2818); b.fillEllipse(40, 76, 16, 10);
      b.generateTexture('bldg_church', 80, 100); b.destroy();
    }

    // ── Town house: 72×64 — plaza building (place 4 of these) ────────────
    {
      const b = this.make.graphics({ x: 0, y: 0 });
      // Terracotta/red roof
      b.fillStyle(0xB03820); b.fillRect(4, 0, 64, 42);
      b.fillStyle(0xC84428); b.fillRect(4, 0, 32, 42);           // left lighter
      b.fillStyle(0xE06040); b.fillRect(34, 0, 2, 42);           // ridge
      // Shingles
      b.fillStyle(0x7A2414, 0.35);
      for (let y = 8; y < 42; y += 8) b.fillRect(4, y, 64, 2);
      // Front wall — cream/beige
      b.fillStyle(0xD4C8A0); b.fillRect(4, 42, 64, 18);
      b.fillStyle(0xA89870, 0.5); b.fillRect(4, 42, 64, 3);
      // Door
      b.fillStyle(0x5A3818); b.fillRect(30, 46, 12, 14);
      b.fillStyle(0x7A5028); b.fillRect(40, 51, 2, 3);
      // Windows
      b.fillStyle(0x90CCE0); b.fillRect(8, 45, 14, 11);
      b.fillStyle(0x90CCE0); b.fillRect(50, 45, 14, 11);
      b.fillStyle(0x6A8878, 0.4); b.fillRect(14, 45, 2, 11); b.fillRect(56, 45, 2, 11);
      b.generateTexture('bldg_house', 72, 64); b.destroy();
    }

    // ── Pine tree (denser, taller variant): 28×44 ─────────────────────────
    {
      const p = this.make.graphics({ x: 0, y: 0 });
      // Shadow
      p.fillStyle(0x0A1A0A, 0.4); p.fillEllipse(14, 42, 22, 6);
      // Trunk
      p.fillStyle(0x5A3A18); p.fillRect(11, 34, 6, 10);
      // Three tiers of foliage
      p.fillStyle(0x1A4818); p.fillTriangle(0, 32, 14, 16, 28, 32);
      p.fillStyle(0x1E5020); p.fillTriangle(3, 28, 14, 14, 25, 28);
      p.fillStyle(0x1A4818); p.fillTriangle(3, 24, 14, 8,  25, 24);
      p.fillStyle(0x204A1A); p.fillTriangle(5, 20, 14, 4,  23, 20);
      p.fillStyle(0x2A5C22); p.fillTriangle(7, 16, 14, 2,  21, 16); // top tier bright
      // Snow highlight on one side
      p.fillStyle(0xFFFFFF, 0.15); p.fillTriangle(7, 16, 14, 2, 14, 16);
      p.generateTexture('pine', 28, 44); p.destroy();
    }

    // ── Grass tuft: 14×12 — scattered ground detail ───────────────────────
    const tuft = this.make.graphics({ x: 0, y: 0 });
    tuft.fillStyle(0x1A3A14); tuft.fillRect(1, 2, 2, 10);    // left blade
    tuft.fillStyle(0x224A1A); tuft.fillRect(4, 0, 2, 12);    // center-left
    tuft.fillStyle(0x2A5420); tuft.fillRect(7, 1, 2, 11);    // center (brightest)
    tuft.fillStyle(0x1E4218); tuft.fillRect(10, 3, 2, 9);    // right blade
    tuft.fillStyle(0x305C24); tuft.fillRect(7, 0, 1, 4);     // highlight tip
    tuft.fillStyle(0x1A2E10, 0.6); tuft.fillRect(0, 10, 14, 2); // ground shadow
    tuft.generateTexture('grass_tuft', 14, 12); tuft.destroy();

    // ── Shore pebble: 10×6 — rocky beach detail ───────────────────────────
    const peb = this.make.graphics({ x: 0, y: 0 });
    peb.fillStyle(0x404040); peb.fillEllipse(5, 3, 10, 6);
    peb.fillStyle(0x585858); peb.fillEllipse(4, 2, 5, 3);    // highlight
    peb.generateTexture('pebble', 10, 6); peb.destroy();

    // ── Fountain: 52×44 — plaza centrepiece ──────────────────────────────
    const fount = this.make.graphics({ x: 0, y: 0 });
    // Outer stone rim
    fount.fillStyle(0x888880); fount.fillEllipse(26, 38, 52, 18);
    fount.fillStyle(0xA0A090); fount.fillEllipse(26, 36, 52, 18);
    fount.fillStyle(0xC8C8B8); fount.fillEllipse(26, 35, 50, 16);
    // Inner water
    fount.fillStyle(0x3A7DC8, 0.9); fount.fillEllipse(26, 34, 38, 11);
    fount.fillStyle(0x5A9EE0, 0.7); fount.fillEllipse(26, 33, 30, 8);
    // Center pedestal
    fount.fillStyle(0xA0A090); fount.fillRect(22, 14, 8, 22);
    fount.fillStyle(0xC8C8B8); fount.fillEllipse(26, 14, 14, 6);
    // Water arc spray (light pixels)
    fount.fillStyle(0x90D0F8, 0.9);
    fount.fillRect(24, 4,  2, 10);   // center jet
    fount.fillRect(18, 8,  2, 6);    // left arc
    fount.fillRect(32, 8,  2, 6);    // right arc
    fount.fillRect(15, 12, 2, 4);
    fount.fillRect(35, 12, 2, 4);
    fount.fillStyle(0xC8EEFF, 0.8);
    fount.fillRect(25, 3,  2, 4);
    fount.fillRect(19, 7,  2, 3);
    fount.fillRect(31, 7,  2, 3);
    fount.generateTexture('fountain', 52, 44); fount.destroy();

    // ── Lumber stack: 44×22 — workshop planks ────────────────────────────
    const lumb = this.make.graphics({ x: 0, y: 0 });
    const WOOD = [0xA0622A, 0xC07830, 0x8A5220, 0xB87040, 0x7A4818];
    for (let i = 0; i < 5; i++) {
      lumb.fillStyle(WOOD[i % WOOD.length]); lumb.fillRect(0, 18 - i * 4, 44, 4);
      // grain marks
      lumb.fillStyle(0x00000022);
      lumb.fillRect(8 + i * 3, 18 - i * 4, 1, 4);
      lumb.fillRect(20 + i * 2, 18 - i * 4, 1, 3);
      lumb.fillRect(34, 18 - i * 4, 1, 4);
      // end grain (right side)
      lumb.fillStyle(WOOD[(i + 2) % WOOD.length]); lumb.fillRect(42, 18 - i * 4, 2, 4);
    }
    lumb.generateTexture('lumber_stack', 44, 22); lumb.destroy();

    // ── Studio couch: 52×22 — podcast lounge sofa ────────────────────────
    const couch = this.make.graphics({ x: 0, y: 0 });
    couch.fillStyle(0x2A2A3A); couch.fillRect(0, 4, 52, 18);     // base
    couch.fillStyle(0x1A1A28); couch.fillRect(0, 4, 52, 3);      // top shadow
    couch.fillStyle(0x1A1A28); couch.fillRect(0, 18, 52, 4);     // bottom
    // Cushions
    couch.fillStyle(0x363648);
    couch.fillRect(3, 6, 14, 11);
    couch.fillRect(19, 6, 14, 11);
    couch.fillRect(35, 6, 14, 11);
    // Cushion highlights
    couch.fillStyle(0x4A4A60);
    couch.fillRect(3, 6, 14, 2);
    couch.fillRect(19, 6, 14, 2);
    couch.fillRect(35, 6, 14, 2);
    // Arms
    couch.fillStyle(0x1E1E2C); couch.fillRect(0, 2, 4, 20); couch.fillRect(48, 2, 4, 20);
    couch.fillStyle(0x363648); couch.fillRect(0, 0, 4, 4); couch.fillRect(48, 0, 4, 4);
    couch.generateTexture('studio_couch', 52, 22); couch.destroy();

    // ── Stage light: 14×32 — PAR can / studio spot ───────────────────────
    const slt = this.make.graphics({ x: 0, y: 0 });
    // Yoke / mount bar
    slt.fillStyle(0x333333); slt.fillRect(1, 0, 12, 3);
    // Housing
    slt.fillStyle(0x222222); slt.fillRect(3, 3, 8, 14);
    slt.fillStyle(0x444444); slt.fillRect(3, 3, 8, 2);
    // Lens
    slt.fillStyle(0xFFEE88); slt.fillCircle(7, 14, 5);
    slt.fillStyle(0xFFFFCC); slt.fillCircle(6, 13, 2);
    // Light cone (warm amber)
    slt.fillStyle(0xFFCC44, 0.25); slt.fillTriangle(3, 16, 11, 16, 14, 32);
    slt.fillStyle(0xFFDD77, 0.12); slt.fillTriangle(5, 16, 9, 16, 12, 32);
    slt.generateTexture('stage_light', 14, 32); slt.destroy();

    // ── Whiteboard: 44×30 — office / design notes ────────────────────────
    const wb2 = this.make.graphics({ x: 0, y: 0 });
    wb2.fillStyle(0x333333); wb2.fillRect(0, 0, 44, 30);          // frame
    wb2.fillStyle(0xF4F2EE); wb2.fillRect(2, 2, 40, 24);          // surface
    // Diagram — component tree sketch
    wb2.fillStyle(0x1565C0); wb2.fillRect(18, 4, 8, 4);           // root box
    wb2.fillStyle(0x333333); wb2.fillRect(10, 10, 7, 4); wb2.fillRect(27, 10, 7, 4);
    wb2.lineBetween(22, 8, 14, 10); wb2.lineBetween(22, 8, 30, 10);
    wb2.fillStyle(0xDD4400); wb2.fillRect(4,  17, 6, 3); wb2.fillRect(12, 17, 6, 3);
    wb2.fillRect(20, 17, 6, 3); wb2.fillRect(28, 17, 6, 3); wb2.fillRect(36, 17, 6, 3);
    // Tray
    wb2.fillStyle(0x444444); wb2.fillRect(2, 26, 40, 2);
    // Marker
    wb2.fillStyle(0x1565C0); wb2.fillRect(8, 26, 6, 2);
    wb2.fillStyle(0xDD4400); wb2.fillRect(16, 26, 6, 2);
    wb2.generateTexture('whiteboard', 44, 30); wb2.destroy();

    // ── Coffee machine: 18×28 — espresso bar ─────────────────────────────
    const cof = this.make.graphics({ x: 0, y: 0 });
    cof.fillStyle(0x1A1A1A); cof.fillRect(2, 0, 14, 24);          // body
    cof.fillStyle(0x888880); cof.fillRect(0, 6, 2, 12);           // left side
    cof.fillStyle(0x888880); cof.fillRect(16, 6, 2, 12);          // right side
    cof.fillStyle(0xAAAAAA); cof.fillRect(3, 2, 12, 6);           // top panel
    cof.fillStyle(0xDD4400); cof.fillRect(13, 3, 2, 2);           // power light
    cof.fillStyle(0x444444); cof.fillRect(3, 10, 12, 8);          // portafilter area
    cof.fillStyle(0x666666); cof.fillRect(6, 10, 2, 8);           // group head
    cof.fillStyle(0x888880); cof.fillRect(8, 18, 2, 4);           // steam wand
    cof.fillStyle(0x444444); cof.fillRect(2, 22, 14, 6);          // drip tray
    cof.fillStyle(0x1A1A1A); cof.fillRect(3, 22, 12, 2);          // grill
    cof.generateTexture('coffee_machine', 18, 28); cof.destroy();

    // ── Server rack: 24×44 — projects lab cabinet ────────────────────────
    const rack = this.make.graphics({ x: 0, y: 0 });
    rack.fillStyle(0x111111); rack.fillRect(0, 0, 24, 44);         // frame
    rack.fillStyle(0x222222); rack.fillRect(2, 2, 20, 40);         // panel
    // rack units (servers)
    for (let i = 0; i < 9; i++) {
      const y = 3 + i * 4;
      const col = [0x1A2030, 0x181818, 0x1E2A1E, 0x1A1A1A][i % 4];
      rack.fillStyle(col); rack.fillRect(3, y, 18, 3);
      // LED
      rack.fillStyle(i % 3 === 0 ? 0x00FF44 : 0xFFAA00);
      rack.fillRect(19, y + 1, 2, 1);
    }
    // Rack ears
    rack.fillStyle(0x333333); rack.fillRect(0, 0, 2, 44); rack.fillRect(22, 0, 2, 44);
    rack.generateTexture('server_rack', 24, 44); rack.destroy();

    // ── Mixing board: 52×22 — AV console ─────────────────────────────────
    const mix = this.make.graphics({ x: 0, y: 0 });
    mix.fillStyle(0x1A1A1A); mix.fillRect(0, 0, 52, 22);           // surface
    mix.fillStyle(0x111111); mix.fillRect(0, 0, 52, 3);            // top edge
    // Fader channels (8 channels)
    for (let i = 0; i < 8; i++) {
      const x = 3 + i * 6;
      // Channel strip
      mix.fillStyle(0x2A2A2A); mix.fillRect(x, 3, 5, 14);
      // Fader track
      mix.fillStyle(0x444444); mix.fillRect(x + 2, 4, 1, 12);
      // Fader cap (random positions for variety)
      const pos = [3, 6, 9, 4, 8, 5, 7, 6][i];
      mix.fillStyle(0xCCCCCC); mix.fillRect(x + 1, 4 + pos, 3, 2);
      // Channel LED
      mix.fillStyle([0x00FF44, 0xFFAA00, 0x00FF44, 0x00FF44, 0xFF4444, 0x00FF44, 0x00FF44, 0x00FF44][i]);
      mix.fillRect(x + 1, 3, 3, 1);
    }
    // Master section (right side)
    mix.fillStyle(0x2A2A2A); mix.fillRect(51, 3, 1, 14);           // master divider
    // Knobs row
    mix.fillStyle(0x444444);
    for (let i = 0; i < 7; i++) {
      mix.fillCircle(6 + i * 7, 20, 2);
    }
    mix.generateTexture('mixing_board', 52, 22); mix.destroy();

    // ── Church cross: 18×30 — east end landmark ───────────────────────────
    const cross = this.make.graphics({ x: 0, y: 0 });
    cross.fillStyle(0xF0EDE8); cross.fillRect(7, 0, 4, 30);        // vertical
    cross.fillStyle(0xF0EDE8); cross.fillRect(0, 8, 18, 4);        // horizontal
    cross.fillStyle(0xFFFFFF); cross
    cross.fillStyle(0xE0E8FF, 0.5); cross.fillRect(7, 0, 2, 14);  // highlight
    cross.generateTexture('church_cross', 18, 30); cross.destroy();

    // ── Camping tent: 52×28 ────────────────────────────────────────────────
    const tent = this.make.graphics({ x: 0, y: 0 });
    tent.fillStyle(0x3A6830); tent.fillTriangle(0, 28, 26, 0, 52, 28);
    tent.fillStyle(0x4A7840); tent.fillTriangle(0, 28, 26, 0, 26, 28);
    tent.fillStyle(0x2A5020); tent.fillRect(0, 26, 52, 2);
    // Door opening
    tent.fillStyle(0x1A3018); tent.fillTriangle(18, 28, 26, 12, 34, 28);
    // Highlight
    tent.fillStyle(0x5A9050, 0.5); tent.fillTriangle(4, 26, 26, 2, 26, 26);
    tent.generateTexture('tent', 52, 28);
  }

  create() {
    this.scene.launch(SCENES.WORLD);
    this.scene.launch(SCENES.UI);
  }
}