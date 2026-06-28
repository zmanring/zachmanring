import Phaser from 'phaser';
import {
  SCENES, WORLD_W, WORLD_H, TILE, DEPTH, EVENTS, FONT, PALETTE, CAMERA_LERP,
} from '../constants';
import { Player } from '../objects/Player';
import { NPC } from '../objects/NPC';
import { allPortfolioData } from '../../data/portfolio';
import zoneData from '../../data/zones.json';

// ── NPC spawn definitions ────────────────────────────────────────────────────
// Each entry: [x, y, outfitKey, wanderRadius, portfolioItemId, zone]
const NPC_DEFS: [number, number, string, number, string, string][] = [
  [1287, 568,  'zach',  40, 'contact-zach', 'PLAZA'],
  [1293, 936,  'maker', 170, 'intro-career', 'PLAZA'],
  [1440, 696,  'maker', 140, 'intro-currently', 'PLAZA'],
  [899, 944,  'professional', 100, 'contact-linkedin', 'PLAZA'],
  [1580, 739,  'developer', 100, 'contact-github', 'PLAZA'],
  [453, 712,  'maker', 180, 'intro-origin', 'WORKSHOP'],
  [509, 396,  'maker', 160, 'intro-sgw', 'WORKSHOP'],
  [221, 340,  'maker', 140, 'project-sgw-plans', 'WORKSHOP'],
  [1435, 416,  'casual',  60, 'project-rv-build', 'CAMPING'],
  [1111, 409,  'wife',  80, 'easter-egg-wife', 'CAMPING'],
  [1943, 435,  'brocc', 180, 'podcast-pixel-broccoli', 'STUDIO'],
  [1685, 289,  'podcaster', 160, 'community-sww', 'STUDIO'],
  [2311, 486,  'casual', 140, 'sgw-youtube', 'STUDIO'],
  [2142, 480,  'cameraman', 140, 'film-imdb', 'STUDIO'],
  [243, 1133,  'developer', 190, 'motif-overview', 'OFFICE'],
  [553, 1107,  'developer', 170, 'motif-speed', 'OFFICE'],
  [750, 1118,  'engineer', 150, 'motif-ai', 'OFFICE'],
  [408, 1296,  'developer', 150, 'motif-tech', 'OFFICE'],
  [834, 1289,  'engineer', 140, 'motif-leadership', 'OFFICE'],
  [1808, 1160,  'developer', 190, 'project-portfolio-game', 'PROJECTS'],
  [2222, 1240,  'developer', 170, 'project-brocc', 'PROJECTS'],
  [1947, 865,  'professional', 100, 'church-td', 'CHURCH'],
];

const TILE_SIZE = 48;

// Compute pixel bounding box for a zone from the tile map
function getZoneBounds(tileMap: Record<string, string>, zone: string, tileSz: number) {
  const tiles = Object.entries(tileMap)
    .filter(([, z]) => z === zone)
    .map(([k]) => k.split('_').map(Number));
  if (!tiles.length) return undefined;
  const cols = tiles.map(([c]) => c);
  const rows = tiles.map(([, r]) => r);
  return {
    minX: Math.min(...cols) * tileSz,
    maxX: (Math.max(...cols) + 1) * tileSz,
    minY: Math.min(...rows) * tileSz,
    maxY: (Math.max(...rows) + 1) * tileSz,
  };
}

// Zone detection — tile map lookup first, then quadrant fallback
function detectZone(x: number, y: number, tileZoneMap: Record<string, string> = {}): string {
  const c = Math.floor(x / TILE_SIZE);
  const r = Math.floor(y / TILE_SIZE);
  const key = `${c}_${r}`;
  if (tileZoneMap[key] && tileZoneMap[key] !== 'NONE') return tileZoneMap[key];
  return 'PLAZA';
}

export class WorldScene extends Phaser.Scene {
  private player!:      Player;
  private npcs:         NPC[] = [];
  private currentZone = '';
  private tileZoneMap: Record<string, string> = {};
  private walls!: Phaser.Physics.Arcade.StaticGroup;

  constructor() { super({ key: SCENES.WORLD }); }

  preload() {
    this.load.image('world-bg', 'assets/world-bg.png');
  }

  create() {
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // World background — your concept art map
    this.add.image(WORLD_W / 2, WORLD_H / 2, 'world-bg')
      .setDisplaySize(WORLD_W, WORLD_H)
      .setDepth(0);

    this.walls = this.physics.add.staticGroup();

    // ── Load zone data from zones.json ───────────────────────────────────────
    Object.entries(zoneData as Record<string, string[]>).forEach(([zone, keys]) => {
      keys.forEach(k => { this.tileZoneMap[k] = zone; });
    });
    this.buildWalls();
    this.spawnNPCs();

    if (new URLSearchParams(window.location.search).get('editor') === '1') {
      this.addTileEditor();
    }
    if (new URLSearchParams(window.location.search).get('npc-editor') === '1') {
      this.addNPCEditor();
    }

    this.player = new Player(this, WORLD_W / 2 - 100, WORLD_H / 2);
    this.physics.add.collider(this.player.sprite, this.walls);
    this.npcs.forEach(npc => this.physics.add.collider(npc.sprite, this.walls));

    this.cameras.main.startFollow(this.player.sprite, true, CAMERA_LERP, CAMERA_LERP);
    this.cameras.main.setDeadzone(90, 60);

    ['ENTER', 'E'].forEach(key => {
      this.input.keyboard!.on(`keydown-${key}`, () => {
        const npc = this.npcs.find(n => n.isNear && !n.isOpen);
        if (npc) npc.openFromKeyboard();
      });
    });

    this.game.events.emit(EVENTS.LEVEL_COMPLETE, 'PLAZA');
  }

  update() {
    this.player.update();
    const { x, y } = this.player;
    this.npcs.forEach(n => n.update(x, y));

    const zone = detectZone(x, y, this.tileZoneMap);
    if (zone !== this.currentZone) {
      this.currentZone = zone;
      this.game.events.emit(EVENTS.LEVEL_COMPLETE, zone);
    }
  }

  // ── World drawing ──────────────────────────────────────────────────────────

  // ═══════════════════════════════════════════════════════════════════════════
  //  WORLD DRAWING — island surrounded by ocean + mountains
  // ═══════════════════════════════════════════════════════════════════════════

  // Build physics wall bodies from WALL tiles in the zone map
  private buildWalls() {
    this.walls.clear(true, true);
    Object.entries(this.tileZoneMap).forEach(([key, zone]) => {
      if (zone !== 'WALL') return;
      const [c, r] = key.split('_').map(Number);
      const wx = c * TILE_SIZE + TILE_SIZE / 2;
      const wy = r * TILE_SIZE + TILE_SIZE / 2;
      const body = this.walls.create(wx, wy, '__DEFAULT') as Phaser.Physics.Arcade.Sprite;
      body.setVisible(false).setDisplaySize(TILE_SIZE, TILE_SIZE).refreshBody();
    });
  }

  private drawWorld() {
    // ── SVG world map as the primary background ────────────────────────────
    // Sits at the very bottom; procedural layers on top for interactive areas
    if (this.textures.exists('world-bg')) {
      this.add.image(WORLD_W / 2, WORLD_H / 2, 'world-bg')
        .setDisplaySize(WORLD_W, WORLD_H)
        .setDepth(DEPTH.BG - 3);
    }

    this.drawWater();
    this.drawIslandLand();
    this.drawMountains();
    this.drawShore();
    this.drawGrassTexture();
    this.drawPaths();
    this.drawZoneInteriors();
    this.drawZoneWalls();
  }

  // ── Ocean / water background ─────────────────────────────────────────────
  private drawWater() {
    const g = this.add.graphics().setDepth(DEPTH.BG - 2);
    g.fillStyle(0x071624);
    g.fillRect(0, 0, WORLD_W, WORLD_H);

    // Tiled wave pattern
    const WAVES = [0x0B2040, 0x091A38, 0x0D2448, 0x0A1C3C, 0x0E2850];
    const WW = 64, WH = 40;
    for (let x = 0; x < WORLD_W; x += WW) {
      for (let y = 0; y < WORLD_H; y += WH) {
        const idx = ((x / WW | 0) + (y / WH | 0)) % WAVES.length;
        g.fillStyle(WAVES[idx]);
        g.fillRect(x, y, WW, WH);
        // Wave crest lines
        g.fillStyle(0x1A4060, 0.45);
        g.fillRect(x + 6, y + 10, 22, 2);
        g.fillRect(x + 38, y + 26, 16, 2);
        g.fillStyle(0x2A5878, 0.2);
        g.fillRect(x + 12, y + 18, 14, 1);
      }
    }

    // Animated shimmer overlay
    const shimmer = this.add.graphics().setDepth(DEPTH.BG - 1).setAlpha(0.5);
    shimmer.fillStyle(0x1A4868, 0.35);
    for (let x = 0; x < WORLD_W; x += 88) {
      for (let y = 0; y < WORLD_H; y += 52) {
        const offset = ((x / 88 | 0) % 3) * 14;
        shimmer.fillRect(x + offset, y + 10, 36, 3);
        shimmer.fillRect(x + offset + 16, y + 30, 20, 2);
      }
    }
    this.tweens.add({
      targets: shimmer, alpha: { from: 0.3, to: 0.65 }, x: { from: 0, to: 10 },
      duration: 2800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
  }

  // ── Island land polygon (organic, irregular) ──────────────────────────────
  private drawIslandLand() {
    const g = this.add.graphics().setDepth(DEPTH.BG);
    g.fillStyle(PALETTE.GRASS);
    // Irregular polygon — clockwise from top-left
    g.fillPoints([
      // ── North edge ──
      { x:  820, y:  65 }, { x: 980,  y:  35 }, { x: 1120, y: 18 },
      { x: 1280, y:  10 }, { x: 1440, y: 18 },  { x: 1580, y: 35 },
      { x: 1740, y:  60 },
      // ── NE corner (cliffs) ──
      { x: 2000, y: 115 }, { x: 2210, y: 85 }, { x: 2400, y: 140 },
      { x: 2510, y: 300 }, { x: 2548, y: 500 },
      // ── East edge (church peninsula) ──
      { x: 2556, y: 720 }, { x: 2550, y: 960 }, { x: 2556, y: 1200 },
      // ── SE corner ──
      { x: 2535, y: 1420 }, { x: 2465, y: 1640 }, { x: 2280, y: 1800 },
      { x: 2010, y: 1878 },
      // ── South edge (beach) ──
      { x: 1680, y: 1908 }, { x: 1440, y: 1916 }, { x: 1280, y: 1918 },
      { x: 1120, y: 1916 }, { x:  880, y: 1908 },
      // ── SW corner ──
      { x:  570, y: 1880 }, { x:  295, y: 1800 }, { x:  115, y: 1640 },
      { x:   38, y: 1420 },
      // ── West edge (SWW peninsula) ──
      { x:   14, y: 1200 }, { x:    8, y: 960 }, { x:   14, y: 720 },
      // ── NW corner (cliffs) ──
      { x:   52, y: 500 }, { x:  112, y: 300 }, { x:  330, y: 140 },
      { x:  580, y:  90 },
    ], true);
  }

  // ── Mountain peaks (north range + NW/NE cliff corners) ───────────────────
  private drawMountains() {
    const g = this.add.graphics().setDepth(DEPTH.BG + 5);
    // [cx, tipY, baseY, halfW]
    const PEAKS: [number,number,number,number][] = [
      // North range — above campsite trail
      [1060, 8, 90, 120], [1180, 2, 75,  95], [1280, 0, 65, 80],
      [1380, 2, 75,  95], [1500, 8, 90, 120],
      // NW cliff
      [90, 45, 210, 160], [240, 15, 180, 175], [420, 26, 185, 160],
      [610, 41, 160, 130], [780, 38, 130, 105],
      // NE cliff
      [1780, 38, 130, 105], [1960, 26, 165, 135],
      [2170, 15, 180, 160], [2360, 26, 185, 155], [2500, 41, 210, 145],
    ];

    // Deep shadow base
    g.fillStyle(0x0E0C12);
    PEAKS.forEach(([cx, ty, by, hw]) =>
      g.fillTriangle(cx - hw - 12, by + 22, cx, ty - 6, cx + hw + 12, by + 22)
    );
    // Main mountain body
    g.fillStyle(0x26242E);
    PEAKS.forEach(([cx, ty, by, hw]) =>
      g.fillTriangle(cx - hw, by, cx, ty, cx + hw, by)
    );
    // Left face highlight
    g.fillStyle(0x3C3A42);
    PEAKS.forEach(([cx, ty, by, hw]) =>
      g.fillTriangle(cx - hw, by, cx, ty, cx - hw * 0.25, by)
    );
    // Right face shadow
    g.fillStyle(0x16141C);
    PEAKS.forEach(([cx, ty, by, hw]) =>
      g.fillTriangle(cx + hw * 0.25, by, cx, ty, cx + hw, by)
    );
    // Snow caps
    g.fillStyle(0xEAE8E6);
    PEAKS.forEach(([cx, ty, by, hw]) => {
      const capH = (by - ty) * 0.28;
      g.fillTriangle(cx - hw * 0.22, ty + capH, cx, ty, cx + hw * 0.22, ty + capH);
    });
    g.fillStyle(0xFFFFFF, 0.8);
    PEAKS.forEach(([cx, ty]) => g.fillRect(cx - 1, ty, 3, 8));

    // Rocky scree at mountain bases (pebble-like dots)
    g.fillStyle(0x2A2830, 0.6);
    PEAKS.forEach(([cx, , by, hw]) => {
      for (let i = -3; i <= 3; i++) {
        g.fillRect(cx + i * (hw / 4), by - 4 + (Math.abs(i) % 2) * 6, 6, 4);
      }
    });
  }

  // ── Shore / beach transition at south + sides ─────────────────────────────
  private drawShore() {
    const g = this.add.graphics().setDepth(DEPTH.BG + 5);
    // Sandy beach — south peninsula
    g.fillStyle(0x7A6A3C, 0.75);
    g.fillEllipse(1280, 1895, 920, 58);
    g.fillEllipse(620,  1868, 310, 38);
    g.fillEllipse(1940, 1868, 310, 38);
    // SW/SE sandy patches
    g.fillEllipse(240,  1785, 200, 36);
    g.fillEllipse(2330, 1785, 200, 36);
    // Foam line
    g.fillStyle(0x4A7898, 0.4);
    g.fillEllipse(1280, 1910, 1120, 48);
    g.fillEllipse(80,   1440, 80, 220);   // west shore
    g.fillEllipse(2480, 1440, 80, 220);   // east shore
    // Water-edge rocks
    g.fillStyle(0x383640);
    ([
      [180, 1371, 32, 18], [310, 1396, 22, 14], [420, 1391, 18, 12],
      [2150, 1376, 28, 16], [2270, 1394, 20, 13],
    ] as number[][]).forEach(([x, y, w, h]) => g.fillEllipse(x, y, w, h));
  }

  // ── Grass tile variation (organic dithered patches) ───────────────────────
  private drawGrassTexture() {
    const g = this.add.graphics().setDepth(DEPTH.BG + 0.15);
    const SHADES: [number, number][] = [
      [0x142214, 0.38], [0x1E3C1E, 0.24], [0x243E1C, 0.2], [0x162A16, 0.3],
    ];
    const GT = 32;
    for (let x = 0; x < WORLD_W; x += GT) {
      for (let y = 0; y < WORLD_H; y += GT) {
        const h = ((x * 7 ^ y * 13) + ((x / 32 | 0) * 3) + ((y / 32 | 0) * 5)) % 4;
        const [col, alpha] = SHADES[h];
        g.fillStyle(col, alpha);
        g.fillRect(x, y, GT, GT);
      }
    }
  }

  // ── Cobblestone / paver paths ─────────────────────────────────────────────
  private drawPaths() {
    const g = this.add.graphics().setDepth(DEPTH.BG + 1);
    const PCOLS = [0xC4A868, 0xBCA060, 0xCAB070, 0xAA8A50, 0xD0BC7C];
    const PW = 36, PH = 20;

    const cobbles = (x0: number, y0: number, x1: number, y1: number) => {
      for (let py = y0; py < y1; py += PH) {
        const off = (((py - y0) / PH | 0) % 2) * (PW >> 1);
        for (let px = x0; px < x1; px += PW) {
          g.fillStyle(PCOLS[(((px * 3) ^ (py * 7)) / 50 | 0) % PCOLS.length]);
          g.fillRect((px + off) % (x1 - x0) + x0, py, PW - 2, PH - 2);
        }
      }
    };

    cobbles(1024, 0, 1536, WORLD_H);           // vertical spine
    cobbles(0, 768, 1024, 1152);               // horizontal left
    cobbles(1536, 768, WORLD_W, 1152);         // horizontal right

    // Path edge shadows
    g.fillStyle(0x6A5430, 0.55);
    g.fillRect(1024, 0, 4, WORLD_H); g.fillRect(1532, 0, 4, WORLD_H);
    g.fillRect(0, 768, WORLD_W, 4);  g.fillRect(0, 1148, WORLD_W, 4);
    g.fillStyle(0x8A7040, 0.25);
    g.fillRect(1028, 0, 4, WORLD_H); g.fillRect(1528, 0, 4, WORLD_H);
    g.fillRect(0, 772, WORLD_W, 4);  g.fillRect(0, 1144, WORLD_W, 4);
  }

  // ── Zone interior floor patterns ──────────────────────────────────────────
  private drawZoneInteriors() {
    // Workshop NW — wood plank floor (inset 120px from outer world edges)
    {
      const g = this.add.graphics().setDepth(DEPTH.BG + 2);
      const PLANKS = [0x2E1E0C, 0x261608, 0x321E0C, 0x22140A, 0x2A1A0A, 0x241408];
      for (let py = 120; py < 768; py += 14) {
        g.fillStyle(PLANKS[(py / 14 | 0) % PLANKS.length]);
        g.fillRect(120, py, 904, 13);
      }
      g.fillStyle(0x0C0602, 0.3);
      for (let py = 120; py < 768; py += 56)
        [200, 270, 580, 800, 980].forEach(kx => g.fillEllipse(kx, py + 6, 26, 5));
    }

    // Studio NE — dark stage floor (inset 120px from top + right edges)
    {
      const g = this.add.graphics().setDepth(DEPTH.BG + 2);
      const BOARDS = [0x060A1E, 0x080D24, 0x05091A, 0x0A0F28];
      for (let px = 1536; px < WORLD_W - 120; px += 18) {
        g.fillStyle(BOARDS[((px - 1536) / 18 | 0) % BOARDS.length]);
        g.fillRect(px, 120, 17, 648);
      }
    }

    // Office SW — tile grid floor (inset 120px from bottom + left edges)
    {
      const g = this.add.graphics().setDepth(DEPTH.BG + 2);
      for (let tx = 120; tx < 1024; tx += 32) {
        for (let ty = 1152; ty < WORLD_H - 120; ty += 32) {
          const alt = (((tx >> 5) + (ty >> 5)) % 2 === 0);
          g.fillStyle(alt ? 0x0F1E30 : 0x0C192A);
          g.fillRect(tx + 1, ty + 1, 30, 30);
        }
      }
    }

    // Projects Lab SE — dark concrete + circuit grid (inset 120px from right + bottom)
    {
      const g = this.add.graphics().setDepth(DEPTH.BG + 2);
      g.fillStyle(0x090D0F);
      g.fillRect(1536, 1152, WORLD_W - 1536 - 120, WORLD_H - 1152 - 120);
      g.lineStyle(1, 0x192620, 0.45);
      for (let x = 1536; x < WORLD_W - 120; x += 24) g.lineBetween(x, 1152, x, WORLD_H - 120);
      for (let y = 1152; y < WORLD_H - 120; y += 24) g.lineBetween(1536, y, WORLD_W - 120, y);
      g.lineStyle(1, 0x004818, 0.2);
      [48,144,240,480,720,864].forEach(ox => {
        if (1536 + ox < WORLD_W - 120) g.lineBetween(1536+ox, 1152, 1536+ox, WORLD_H - 120);
      });
    }

    // Plaza center — warm stone pavers
    {
      const g = this.add.graphics().setDepth(DEPTH.BG + 2);
      const STONES = [0x302E28, 0x343230, 0x2C2A24, 0x383630, 0x2E2C26];
      for (let px = 1024; px < 1536; px += 32) {
        for (let py = 768; py < 1152; py += 32) {
          const si = (((px - 1024) >> 5) + ((py - 768) >> 5)) % STONES.length;
          g.fillStyle(STONES[si]);
          g.fillRect(px + 1, py + 1, 30, 30);
        }
      }
    }
  }

  // ── Zone perimeter walls (room effect — outer edges only) ─────────────────
  private drawZoneWalls() {
    const g = this.add.graphics().setDepth(DEPTH.BG + 3);
    const W = 18; // wall thickness in px
    const M = 120; // outer world-edge margin (mountains/water show here)

    // Each zone: outer edges get a thick wall; path-adjacent edges stay open
    // Inset by M from outer world edge so mountains/water are visible
    const zones = [
      { x:  M,        y:  M,        w: 1024-M,   h: 768-M,   fc: 0x1C0C04, ac: PALETTE.CLR_WS, open: ['right','bottom'] },
      { x: 1536,      y:  M,        w: 1024-M,   h: 768-M,   fc: 0x03071C, ac: PALETTE.CLR_ST, open: ['left', 'bottom'] },
      { x:  M,        y: 1152,      w: 1024-M,   h: 768-M,   fc: 0x05101E, ac: PALETTE.CLR_OF, open: ['right','top']    },
      { x: 1536,      y: 1152,      w: 1024-M,   h: 768-M,   fc: 0x08090C, ac: PALETTE.CLR_PJ, open: ['left', 'top']   },
    ];

    zones.forEach(z => {
      g.fillStyle(z.fc);
      if (!z.open.includes('top' as never))    g.fillRect(z.x,           z.y,           z.w, W);
      if (!z.open.includes('bottom' as never)) g.fillRect(z.x,           z.y + z.h - W, z.w, W);
      if (!z.open.includes('left' as never))   g.fillRect(z.x,           z.y,           W, z.h);
      if (!z.open.includes('right' as never))  g.fillRect(z.x + z.w - W, z.y,           W, z.h);
      // Interior accent glow
      g.lineStyle(2, z.ac, 0.5);
      g.strokeRect(z.x + W, z.y + W, z.w - W * 2, z.h - W * 2);
      // Outer subtle trace
      g.lineStyle(1, z.ac, 0.18);
      g.strokeRect(z.x, z.y, z.w, z.h);
    });
  }

  private addZoneLabels() {
    const opts = (color: string) => ({
      fontSize: '20px', fontFamily: FONT, color, align: 'center' as const,
    });
    const sub = (color: string) => ({
      fontSize: '9px', fontFamily: FONT, color, align: 'center' as const,
    });

    const labels: [string, string, string, string, number, number][] = [
      ['WORKSHOP',        '(SOUTHERN GINGER WORKSHOP)', '#DD4400', '#888888', 510,  380],
      ['PODCAST\nSTUDIO', '(PIXEL BROCCOLI)',            '#08D7A9', '#C42DD7', 2050, 380],
      ['DESIGN\nSYSTEMS', '(ENTERPRISE)',            '#1565C0', '#0D3B7A', 510,  1540],
      ['PROJECTS\nLAB',   '(CODE & TOOLS)',              '#37474F', '#1A252A', 2050, 1540],
    ];

    labels.forEach(([name, sub2, color, subColor, x, y]) => {
      this.add.text(x, y,      name, opts(color))  .setOrigin(0.5).setAlpha(0.3).setDepth(DEPTH.BG + 2);
      this.add.text(x, y + 60, sub2, sub(subColor)).setOrigin(0.5).setAlpha(0.25).setDepth(DEPTH.BG + 2);
    });

    // Plaza
    this.add.text(WORLD_W / 2, WORLD_H / 2, 'TOWN\nSQUARE', {
      fontSize: '16px', fontFamily: FONT, color: '#DD4400', align: 'center',
    }).setOrigin(0.5).setAlpha(0.18).setDepth(DEPTH.BG + 2);

    // "ENTER →" hint arrows at zone entrances
    const arrowStyle = { fontSize: '8px', color: '#DD4400', fontFamily: FONT };
    const arrows: [string, number, number][] = [
      ['→', 990,  384],  ['←', 1570, 384],
      ['→', 990,  1540], ['←', 1570, 1540],
      ['↓', 1280, 740],  ['↑', 1280, 1180],
    ];
    arrows.forEach(([ch, x, y]) => {
      const t = this.add.text(x, y, ch, arrowStyle).setOrigin(0.5).setDepth(DEPTH.DECOR).setAlpha(0.5);
      this.tweens.add({ targets: t, alpha: 0.15, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    });
  }

  private addDecorations() {
    // Trees in outer corners and grass strips
    const trees: [number, number][] = [
      // NW outer edge
      [80,  80],  [200, 70],  [70,  200], [180, 180],
      // NE outer edge
      [2480, 80], [2360, 70], [2490, 200], [2380, 180],
      // SW outer edge
      [80,  1840], [200, 1850], [70,  1720], [180, 1740],
      // SE outer edge
      [2480, 1840],[2360, 1850],[2490, 1720],[2380, 1740],
      // Grass strips near path edges (NW quadrant side)
      [120, 760], [250, 750], [800, 755], [920, 745],
      [112, 1160],[260, 1160],[810, 1165],[910, 1155],
      // NE quadrant side
      [1580+60, 755], [1580+200, 745], [1580+800, 760], [1580+900, 750],
      [1580+60,1160], [1580+200,1155],[1580+800,1165],[1580+900,1155],
    ];
    trees.forEach(([x, y]) =>
      this.add.image(x, y, 'tree').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Benches in plaza
    const benches: [number, number, number][] = [
      [1100, 720, 0], [1460, 720, 0],
      [1280, 615, 90],[1280, 825, 90],
    ];
    benches.forEach(([x, y, angle]) => {
      this.add.image(x, y, 'bench').setDepth(DEPTH.DECOR).setAngle(angle);
    });

    // Lampposts — evenly spaced along both paths, 4 corners at intersections
    // World: 2560×1920 | Vertical path x:1024-1536 | Horizontal path y:768-1152
    // Spacing: vertical sections 192px (768/4), horizontal sections 256px (1024/4)
    const lampposts: [number, number][] = [
      // 4 corners where paths cross
      [1015, 762],  [1545, 762],  [1015, 1158], [1545, 1158],
      // Vertical path — left side (x=1015), above plaza
      [1015, 192],  [1015, 384],  [1015, 576],
      // Vertical path — left side, below plaza
      [1015, 1350], [1015, 1542], [1015, 1734],
      // Vertical path — right side (x=1545), above plaza
      [1545, 192],  [1545, 384],  [1545, 576],
      // Vertical path — right side, below plaza
      [1545, 1350], [1545, 1542], [1545, 1734],
      // Horizontal path — top side (y=762), left of plaza
      [256, 762],   [512, 762],   [768, 762],
      // Horizontal path — top side, right of plaza
      [1792, 762],  [2048, 762],  [2304, 762],
      // Horizontal path — bottom side (y=1158), left of plaza
      [256, 1158],  [512, 1158],  [768, 1158],
      // Horizontal path — bottom side, right of plaza
      [1792, 1158], [2048, 1158], [2304, 1158],
    ];
    lampposts.forEach(([x, y]) =>
      this.add.image(x, y, 'lamppost').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Flower pots — plaza accent color
    const pots: [number, number][] = [
      [1060, 820], [1500, 820], [1060, 1100], [1500, 1100],
      [1200, 790], [1360, 790], [1200, 1140], [1360, 1140],
    ];
    pots.forEach(([x, y]) =>
      this.add.image(x, y, 'flowerpot').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Crates — workshop (NW) + projects lab (SE)
    const crates: [number, number][] = [
      // Workshop stacks
      [180, 320], [210, 320], [140, 440], [500, 280], [530, 280],
      [300, 600], [440, 160],
      // Projects lab
      [2100, 1500],[2130, 1500],[2080, 1560],[2350, 1460],[2380, 1640],
    ];
    crates.forEach(([x, y]) =>
      this.add.image(x, y, 'crate').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Workbenches — workshop zone
    const workbenches: [number, number][] = [
      [280, 260], [520, 480], [180, 560],
    ];
    workbenches.forEach(([x, y]) =>
      this.add.image(x, y, 'workbench').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // ── CAMPSITE — top of vertical path (north trail end) ────────────────
    // Ground dirt patch
    const camp = this.add.graphics().setDepth(DEPTH.BG + 1);
    camp.fillStyle(0x4A3820, 0.55); camp.fillEllipse(1280, 160, 340, 140);

    // Trees framing the campsite
    [[1040, 80],[1060, 180],[1080, 260],
     [1520, 80],[1500, 180],[1480, 260],
     [1180, 60],[1380, 60]].forEach(([x, y]) =>
      this.add.image(x, y, 'tree').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // RV parked to the right of the path
    this.add.image(1430, 200, 'rv').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // Campfire left of path with glow
    const fireGlow = this.add.image(1170, 165, 'campfire_glow')
      .setDepth(DEPTH.BG + 2).setAlpha(0.6).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: fireGlow, alpha: { from: 0.4, to: 0.75 }, scaleX: { from: 0.9, to: 1.1 },
      duration: 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    this.add.image(1170, 175, 'campfire').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // Benches / log seats around fire
    this.add.image(1130, 190, 'bench').setDepth(DEPTH.DECOR).setAngle(30);
    this.add.image(1200, 200, 'bench').setDepth(DEPTH.DECOR).setAngle(-20);

    // ── TRAIL END — bottom of vertical path (south trailhead) ─────────────
    // Dirt trail ground
    const trail = this.add.graphics().setDepth(DEPTH.BG + 1);
    trail.fillStyle(0x3A2A14, 0.6); trail.fillEllipse(1280, 1830, 380, 160);
    trail.fillStyle(0x2A1A08, 0.4); trail.fillRect(1230, 1750, 100, 160);  // rut marks

    // Trees framing the trail end
    [[1040, 1840],[1060, 1740],[1080, 1660],
     [1520, 1840],[1500, 1740],[1480, 1660],
     [1160, 1870],[1400, 1870]].forEach(([x, y]) =>
      this.add.image(x, y, 'tree').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Mud tracks
    this.add.image(1280, 1800, 'mudtrack').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(1280, 1820, 'mudtrack').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // Rock clusters along the trail
    [[1100, 1780],[1150, 1830],[1380, 1810],[1420, 1770],[1460, 1840]].forEach(([x, y]) =>
      this.add.image(x, y, 'rock').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Jeep on the trail
    this.add.image(1280, 1860, 'jeep').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // ── SOUTHERN WOODWORKERS GATHERING — west end of horizontal path ───────
    // Trees framing the entrance
    [[80, 740],[140, 720],[220, 730],[300, 745],
     [80, 1180],[140, 1200],[220, 1185],[300, 1170]].forEach(([x, y]) =>
      this.add.image(x, y, 'tree').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Dirt clearing ground patch
    const swwGround = this.add.graphics().setDepth(DEPTH.BG + 1);
    swwGround.fillStyle(0x4A3A20, 0.4); swwGround.fillEllipse(150, 960, 300, 200);

    // Community sign — on a post, sign-sized
    this.add.image(150, 930, 'sww_sign').setDepth(DEPTH.DECOR).setOrigin(0.5, 1).setScale(0.6);

    // Workbenches for a community workshop feel
    this.add.image(70, 1020, 'workbench').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(230, 1020, 'workbench').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // Campfire for the gathering vibe
    const swwGlow = this.add.image(150, 985, 'campfire_glow')
      .setDepth(DEPTH.BG + 2).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: swwGlow, alpha: { from: 0.3, to: 0.6 }, scaleX: { from: 0.85, to: 1.05 },
      duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    this.add.image(150, 995, 'campfire').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // Crates and benches scattered around
    this.add.image(60, 1000, 'crate').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(245, 1000, 'crate').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(100, 1060, 'bench').setDepth(DEPTH.DECOR).setAngle(15);
    this.add.image(200, 1060, 'bench').setDepth(DEPTH.DECOR).setAngle(-15);

    // Mic stands — podcast studio (NE)
    const micstands: [number, number][] = [
      [1920, 320], [2120, 180], [2300, 360], [2040, 540],
    ];
    micstands.forEach(([x, y]) =>
      this.add.image(x, y, 'micstand').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Computer terminals — office (SW) + projects lab (SE)
    const terminals: [number, number][] = [
      // Motif office
      [480, 1480], [260, 1560], [700, 1560], [420, 1700], [620, 1700],
      // Projects lab
      [2000, 1480],[2260, 1500],[2100, 1680],[2320, 1680],
    ];
    terminals.forEach(([x, y]) =>
      this.add.image(x, y, 'terminal').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Signposts — zone border entrances
    const signposts: [number, number][] = [
      [1024, 380], [1024, 1380],   // Workshop / Plaza west boundaries
      [1536, 380], [1536, 1380],   // Studio / Plaza east boundaries
      [640, 768],  [1920, 768],    // N-S midpoint markers
    ];
    signposts.forEach(([x, y]) =>
      this.add.image(x, y, 'signpost').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // ── PLAZA — fountain centrepiece ──────────────────────────────────────
    const fountain = this.add.image(1280, 960, 'fountain')
      .setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    // Gentle bob animation
    this.tweens.add({
      targets: fountain, y: { from: 960, to: 956 },
      duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // ── Grass tufts — scattered across path margins + open areas ────────────
    const tufts: [number, number][] = [
      // Along vertical path left edge
      [1010,  80],[1012, 180],[1008, 260],[1014, 400],[1010, 500],[1012, 620],
      [1010, 700],[1014,1260],[1010,1360],[1012,1480],[1008,1600],[1014,1720],
      // Along vertical path right edge
      [1538,  80],[1540, 200],[1536, 320],[1540, 460],[1538, 580],[1540, 700],
      [1536,1280],[1540,1380],[1538,1500],[1540,1640],[1536,1760],
      // Along horizontal path top edge
      [150, 762],[300, 764],[500, 762],[720, 760],[900, 764],
      [1700,762],[1900,764],[2100,760],[2300,762],[2450,764],
      // Along horizontal path bottom edge
      [180,1148],[380,1150],[600,1148],[820,1150],[980,1148],
      [1700,1148],[1900,1150],[2120,1148],[2320,1150],[2480,1148],
      // Workshop margins (plank floor edge)
      [24, 40],[26, 120],[22, 250],[24, 500],[22, 680],
      [200, 22],[400, 20],[600, 22],[850, 20],
      // Studio margins
      [2536, 40],[2534, 180],[2536, 320],[2532, 550],[2534, 680],
      [1700, 22],[1900, 20],[2100, 22],[2350, 20],
      // Office margins
      [24,1170],[26,1350],[22,1550],[24,1750],[26,1890],
      [200,1888],[400,1892],[680,1888],[900,1892],
      // Projects lab margins
      [2534,1170],[2536,1350],[2532,1520],[2534,1720],[2536,1890],
      [1700,1888],[1900,1892],[2100,1890],[2350,1892],
      // Near mountain bases (north)
      [880, 78],[1040, 62],[1160, 52],[1300, 48],[1420, 54],[1600, 66],[1740, 76],
      // Near shore (south)
      [700,1868],[950,1884],[1100,1892],[1460,1890],[1680,1882],[2000,1862],
    ];
    tufts.forEach(([x, y]) =>
      this.add.image(x, y, 'grass_tuft').setDepth(DEPTH.DECOR - 1).setOrigin(0.5, 1)
    );

    // ── Shore pebbles (south beach area) ────────────────────────────────────
    ([
      [820,1875],[870,1888],[1020,1882],[1150,1896],[1350,1898],
      [1550,1896],[1720,1886],[1880,1878],[2020,1868],[2180,1852],
      [240,1800],[310,1830],[2320,1808],[2440,1830],
    ] as [number,number][]).forEach(([x, y]) =>
      this.add.image(x, y, 'pebble').setDepth(DEPTH.DECOR - 1).setOrigin(0.5, 1)
    );

    // ── WORKSHOP (NW) — lumber stacks ─────────────────────────────────────
    [[160, 400],[400, 180],[600, 340],[280, 620],[480, 520]].forEach(([x, y]) =>
      this.add.image(x, y, 'lumber_stack').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // ── PODCAST STUDIO (NE) — couch + stage lights ───────────────────────
    this.add.image(2060, 640, 'studio_couch').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(2260, 620, 'studio_couch').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    // Stage lights hanging from ceiling — placed high, pointing down
    [[1920, 140],[2020, 120],[2140, 130],[2300, 140],[2420, 120]].forEach(([x, y]) =>
      this.add.image(x, y, 'stage_light').setDepth(DEPTH.DECOR).setOrigin(0.5, 0)
    );

    // ── MOTIF OFFICE (SW) — whiteboard + coffee machine ──────────────────
    this.add.image(200, 1400, 'whiteboard').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(680, 1700, 'whiteboard').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(760, 1360, 'coffee_machine').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);
    this.add.image(160, 1620, 'coffee_machine').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // ── PROJECTS LAB (SE) — server racks ─────────────────────────────────
    [[2000, 1380],[2060, 1380],[1880, 1500],[2380, 1360],[2440, 1360],[2320, 1600]].forEach(([x, y]) =>
      this.add.image(x, y, 'server_rack').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // ── CAMPSITE (north trail end) — tent ────────────────────────────────
    this.add.image(1200, 140, 'tent').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // ── EAST END — Woodstock City Church tech scene ───────────────────────
    // Trees framing the entrance from the path
    [[2300, 740],[2360, 720],[2440, 730],[2520, 750],
     [2300, 1180],[2360, 1200],[2440, 1185],[2520, 1170]].forEach(([x, y]) =>
      this.add.image(x, y, 'tree').setDepth(DEPTH.DECOR).setOrigin(0.5, 1)
    );

    // Stage platform — elevated wooden stage floor
    const stageGround = this.add.graphics().setDepth(DEPTH.BG + 1);
    stageGround.fillStyle(0x1A0A00, 0.5);
    stageGround.fillRect(2380, 800, 170, 200);          // stage backdrop area
    stageGround.fillStyle(0x2A1A08, 0.6);
    stageGround.fillRect(2380, 880, 170, 120);          // stage floor platform
    stageGround.fillStyle(0x3A2A10, 0.3);               // stage edge highlight
    stageGround.fillRect(2380, 880, 170, 4);

    // Church cross on the back wall
    this.add.image(2455, 820, 'church_cross')
      .setDepth(DEPTH.DECOR).setOrigin(0.5, 1).setScale(2.5);

    // Stage lights above the stage
    [[2390, 800],[2430, 790],[2470, 800],[2510, 790],[2540, 800]].forEach(([x, y]) =>
      this.add.image(x, y, 'stage_light').setDepth(DEPTH.DECOR).setOrigin(0.5, 0)
    );

    // Mixing board — the TD's station, front of house
    this.add.image(2390, 990, 'mixing_board').setDepth(DEPTH.DECOR).setOrigin(0.5, 1);

    // Speakers / PA clusters flanking the stage
    [[2382, 870],[2538, 870]].forEach(([x, y]) => {
      const spk = this.add.graphics().setDepth(DEPTH.DECOR);
      spk.fillStyle(0x111111); spk.fillRect(x - 8, y - 28, 16, 28);
      spk.fillStyle(0x333333); spk.fillCircle(x, y - 20, 5);   // horn
      spk.fillStyle(0x222222); spk.fillCircle(x, y - 10, 7);   // woofer
    });

    // Cable runs on the floor (subtle lines)
    const cables = this.add.graphics().setDepth(DEPTH.BG + 2);
    cables.lineStyle(1, 0x222222, 0.5);
    cables.lineBetween(2390, 990, 2420, 880);   // FOH cable to stage
    cables.lineBetween(2420, 880, 2455, 830);
    cables.lineStyle(1, 0x332200, 0.4);
    cables.lineBetween(2382, 870, 2390, 960);   // speaker cable L
    cables.lineBetween(2538, 870, 2530, 960);   // speaker cable R

    // Small WCC sign post
    const wccSign = this.add.graphics().setDepth(DEPTH.DECOR);
    wccSign.fillStyle(0x1A3A6A); wccSign.fillRect(2305, 920, 28, 16);   // sign bg
    wccSign.fillStyle(0xF0EDE8); wccSign.fillRect(2307, 922, 24, 12);   // white surface
    wccSign.fillStyle(0x1A3A6A); wccSign.fillRect(2316, 923, 8, 2);     // text line 1
                                  wccSign.fillRect(2316, 927, 6, 2);     // text line 2
                                  wccSign.fillRect(2316, 931, 4, 2);     // text line 3
    wccSign.fillStyle(0x4A3015); wccSign.fillRect(2318, 936, 2, 12);    // post
  }

  // ── Projects Lab terminal ambience ───────────────────────────────────────

  private addProjectsLabAmbience() {
    // Zone bounds: x 1570–2530, y 1190–1890
    const ZX = 1570, ZY = 1190, ZW = 960, ZH = 700;

    // ── Scanline grid overlay ─────────────────────────────────────────────
    const grid = this.add.graphics().setDepth(DEPTH.BG + 1).setAlpha(0.08);
    grid.lineStyle(1, 0x00FF41);
    for (let x = ZX; x <= ZX + ZW; x += 16) grid.lineBetween(x, ZY, x, ZY + ZH);
    for (let y = ZY; y <= ZY + ZH; y += 16) grid.lineBetween(ZX, y, ZX + ZW, y);

    // ── Static code-line decoration (syntax highlight feel) ───────────────
    const code = this.add.graphics().setDepth(DEPTH.BG + 2).setAlpha(0.13);
    const COLS = { kw: 0xC792EA, str: 0xC3E88D, fn: 0x82AAFF, num: 0xF78C6C, comment: 0x546E7A };
    // Rows of "code" — each entry: [x, y, width, color]
    const lines: [number, number, number, number][] = [
      // Row 1
      [ZX+40,  ZY+60,  38, COLS.kw], [ZX+84,  ZY+60,  56, COLS.fn],  [ZX+148, ZY+60,  12, 0xFFFFFF],
      [ZX+168, ZY+60,  44, COLS.str],[ZX+220, ZY+60,  12, 0xFFFFFF],
      // Row 2
      [ZX+40,  ZY+76,  28, COLS.kw], [ZX+76,  ZY+76,  18, COLS.fn],  [ZX+102, ZY+76,  8,  0xFFFFFF],
      [ZX+118, ZY+76,  36, COLS.num],[ZX+162, ZY+76,  8,  0xFFFFFF],
      // Row 3 (indent)
      [ZX+56,  ZY+92,  44, COLS.kw], [ZX+108, ZY+92,  64, COLS.str],
      // Row 4 (comment)
      [ZX+40,  ZY+108, 120, COLS.comment],
      // Row 5
      [ZX+40,  ZY+124, 32, COLS.fn], [ZX+80,  ZY+124, 48, COLS.num], [ZX+136, ZY+124, 16, 0xFFFFFF],
      // Repeat block lower down
      [ZX+200, ZY+200, 38, COLS.kw], [ZX+244, ZY+200, 56, COLS.fn],
      [ZX+200, ZY+216, 28, COLS.str],[ZX+234, ZY+216, 48, COLS.num],
      [ZX+200, ZY+232, 80, COLS.comment],
      // Far right column
      [ZX+700, ZY+80,  44, COLS.fn], [ZX+700, ZY+96,  32, COLS.kw],  [ZX+700, ZY+112, 60, COLS.str],
      [ZX+700, ZY+128, 24, COLS.comment],
      // Bottom area
      [ZX+100, ZY+560, 56, COLS.fn], [ZX+100, ZY+576, 40, COLS.kw],
      [ZX+600, ZY+540, 48, COLS.str],[ZX+600, ZY+556, 28, COLS.num],
    ];
    lines.forEach(([x, y, w, c]) => {
      code.fillStyle(c); code.fillRect(x, y, w, 3);
    });

    // ── Matrix rain — falling characters ─────────────────────────────────
    const CHARS = ['0','1','>','<','{','}','=','/','*','#','_','|','&','$'];
    const columns = 24;
    const colW = ZW / columns;

    for (let col = 0; col < columns; col++) {
      const x = ZX + col * colW + colW * 0.4;
      // Pick 1–2 drops per column, staggered
      const drops = Phaser.Math.Between(1, 2);
      for (let d = 0; d < drops; d++) {
        const char = CHARS[Phaser.Math.Between(0, CHARS.length - 1)];
        const startY = ZY + Phaser.Math.Between(0, ZH);
        const speed  = Phaser.Math.Between(6000, 14000);
        const alpha  = Phaser.Math.FloatBetween(0.07, 0.18);

        const t = this.add.text(x, startY, char, {
          fontFamily: '"Courier New", monospace',
          fontSize: '11px',
          color: '#00FF41',
        }).setDepth(DEPTH.BG + 3).setAlpha(0);

        // Fade in, fall, fade out — loop forever
        this.tweens.add({
          targets: t,
          y: startY + ZH,
          alpha: { from: 0, to: alpha },
          duration: speed,
          delay: Phaser.Math.Between(0, 8000),
          repeat: -1,
          ease: 'Linear',
          onRepeat: () => {
            t.setText(CHARS[Phaser.Math.Between(0, CHARS.length - 1)]);
            t.setY(ZY + Phaser.Math.Between(0, 60));
          },
        });
      }
    }

    // ── Glowing border for the zone ───────────────────────────────────────
    // ── Glowing border for the zone ──────────────────────
    const glow = this.add.graphics().setDepth(DEPTH.BG + 1).setAlpha(0.22);
    glow.lineStyle(2, 0x00FF41, 1);
    glow.strokeRect(ZX, ZY, ZW, ZH);
  }

  // ── Tile grid editor ─────────────────────────────────────────────────────────

  private addTileEditor() {
    const COLS = Math.ceil(WORLD_W / TILE_SIZE);
    const ROWS = Math.ceil(WORLD_H / TILE_SIZE);
    const ZONE_COLORS: Record<string, number> = {
      NONE:     0x000000,
      WORKSHOP: 0xDD4400,
      STUDIO:   0x08D7A9,
      OFFICE:   0x1565C0,
      PROJECTS: 0x9C27B0,
      PLAZA:    0xFFFFFF,
      CAMPING:  0x4CAF50,
      OFFROAD:  0x8D6E63,
      CHURCH:   0xFFC107,
      SGW:      0xFF5722,
      PATH:     0xBCAAA4,
      WALL:     0x333333,
    };
    const ZONE_CYCLE = [
      'NONE','WORKSHOP','STUDIO','OFFICE','PROJECTS','PLAZA',
      'CAMPING','OFFROAD','CHURCH','SGW','PATH','WALL',
    ];

    // Tile state map: col_row → zone name (shared with detectZone)
    const tileMap = this.tileZoneMap;

    const grid   = this.add.graphics().setDepth(200);
    const fill   = this.add.graphics().setDepth(199);
    const cursor = this.add.graphics().setDepth(202);

    // Draw grid lines
    grid.lineStyle(1, 0xffffff, 0.12);
    for (let c = 0; c <= COLS; c++) grid.lineBetween(c * TILE_SIZE, 0, c * TILE_SIZE, WORLD_H);
    for (let r = 0; r <= ROWS; r++) grid.lineBetween(0, r * TILE_SIZE, WORLD_W, r * TILE_SIZE);

    const hoverText = this.add.text(0, 0, '', {
      fontSize: '9px', color: '#ffffff', backgroundColor: '#000000cc',
      padding: { x: 4, y: 2 },
    }).setDepth(203).setVisible(false);

    const doSave = async () => {
      const out: Record<string, string[]> = {};
      Object.entries(tileMap).forEach(([key, zone]) => {
        if (zone === 'NONE') return;
        if (!out[zone]) out[zone] = [];
        out[zone].push(key);
      });
      saveBtn.setText('[ SAVING... ]').setStyle({ backgroundColor: '#888800' });
      try {
        const res = await fetch('/api/save-zones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(out),
        });
        if (res.ok) {
          saveBtn.setText('[ SAVED ✓ ]').setStyle({ backgroundColor: '#006600' });
          this.time.delayedCall(2000, () => saveBtn.setText('[ SAVE ZONES ]').setStyle({ backgroundColor: '#FFD700' }));
        } else {
          throw new Error('save failed');
        }
      } catch {
        saveBtn.setText('[ SAVE FAILED ]').setStyle({ backgroundColor: '#880000' });
        this.time.delayedCall(2000, () => saveBtn.setText('[ SAVE ZONES ]').setStyle({ backgroundColor: '#FFD700' }));
        console.log(JSON.stringify(out, null, 2));
      }
    };

    // Fixed screen-space save button
    const saveBtn = this.add.text(12, 8, '[ SAVE ZONES ]', {
      fontSize: '9px', color: '#000000', backgroundColor: '#FFD700',
      padding: { x: 6, y: 3 },
    }).setDepth(203).setScrollFactor(0).setInteractive({ useHandCursor: true })
      .on('pointerdown', doSave);

    // Also save with X key
    this.input.keyboard!.on('keydown-X', doSave);

    let paintZone = 'PLAZA';
    let isDragging = false;

    // Paint color label — pinned to screen top
    const paintLabel = this.add.text(160, 8, `painting: ${paintZone}`, {
      fontSize: '9px', color: '#000000', backgroundColor: '#ffffff',
      padding: { x: 6, y: 3 },
    }).setDepth(203).setScrollFactor(0);

    const setPaintZone = (z: string) => {
      paintZone = z;
      const hex = '#' + (ZONE_COLORS[z] ?? 0xffffff).toString(16).padStart(6, '0');
      paintLabel.setText(`painting: ${z}`).setStyle({ backgroundColor: hex, color: z === 'NONE' ? '#ffffff' : '#000000' });
    };

    // Tab cycles forward, Shift+Tab cycles backward
    this.input.keyboard!.on('keydown-TAB', (e: KeyboardEvent) => {
      e.preventDefault();
      const idx = ZONE_CYCLE.indexOf(paintZone);
      const next = e.shiftKey
        ? ZONE_CYCLE[(idx - 1 + ZONE_CYCLE.length) % ZONE_CYCLE.length]
        : ZONE_CYCLE[(idx + 1) % ZONE_CYCLE.length];
      setPaintZone(next);
    });
    let dragStartC = 0, dragStartR = 0;
    const dragRect = this.add.graphics().setDepth(204);

    const redrawFills = () => {
      fill.clear();
      Object.entries(tileMap).forEach(([k, z]) => {
        if (z === 'NONE') return;
        const [tc, tr] = k.split('_').map(Number);
        fill.fillStyle(ZONE_COLORS[z] ?? 0xffffff, 0.4);
        fill.fillRect(tc * TILE_SIZE + 1, tr * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      });
      this.buildWalls();
    };

    // Redraw seeded tiles immediately
    redrawFills();

    // Hover highlight + drag preview
    this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
      const wx = ptr.worldX, wy = ptr.worldY;
      const c = Math.floor(wx / TILE_SIZE);
      const r = Math.floor(wy / TILE_SIZE);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) { cursor.clear(); return; }
      cursor.clear();
      cursor.lineStyle(2, 0xFFFFFF, 0.9);
      cursor.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const zone = tileMap[`${c}_${r}`] ?? 'NONE';
      hoverText.setText(`[${c},${r}] ${zone}  (painting: ${paintZone})`)
        .setPosition(wx + 12, wy - 20).setVisible(true);

      // Drag preview rectangle
      if (isDragging) {
        const minC = Math.min(dragStartC, c), maxC = Math.max(dragStartC, c);
        const minR = Math.min(dragStartR, r), maxR = Math.max(dragStartR, r);
        dragRect.clear();
        dragRect.lineStyle(2, ZONE_COLORS[paintZone] ?? 0xffffff, 1);
        dragRect.strokeRect(
          minC * TILE_SIZE, minR * TILE_SIZE,
          (maxC - minC + 1) * TILE_SIZE, (maxR - minR + 1) * TILE_SIZE
        );
      }
    });

    // Mousedown — start drag
    this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      if (!ptr.leftButtonDown()) return;
      const c = Math.floor(ptr.worldX / TILE_SIZE);
      const r = Math.floor(ptr.worldY / TILE_SIZE);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
      isDragging = true;
      dragStartC = c;
      dragStartR = r;
    });

    // Mouseup — commit rectangle
    this.input.on('pointerup', (ptr: Phaser.Input.Pointer) => {
      if (!isDragging) return;
      isDragging = false;
      dragRect.clear();
      const c = Math.floor(ptr.worldX / TILE_SIZE);
      const r = Math.floor(ptr.worldY / TILE_SIZE);
      const minC = Math.min(dragStartC, c), maxC = Math.max(dragStartC, c);
      const minR = Math.min(dragStartR, r), maxR = Math.max(dragStartR, r);
      for (let tc = minC; tc <= maxC; tc++) {
        for (let tr = minR; tr <= maxR; tr++) {
          tileMap[`${tc}_${tr}`] = paintZone;
        }
      }
      redrawFills();
    });
  }

  private saveNPCs(npcs: NPC[], btn: HTMLButtonElement) {
    const payload = NPC_DEFS.map((def, i) => {
      const npc = npcs[i];
      if (!npc) return def;
      return [Math.round(npc.sprite.x), Math.round(npc.sprite.y), def[2], def[3], def[4], def[5]];
    });
    btn.textContent = '💾 Saving…';
    fetch('/api/save-npcs', { method: 'POST', body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(() => { btn.textContent = '✅ Saved!'; setTimeout(() => { btn.textContent = '💾 Save NPC positions'; }, 2000); })
      .catch(() => { btn.textContent = '❌ Save failed'; });
  }

  private addNPCEditor() {
    // Overlay panel — fixed to camera
    const panel = this.add.text(8, 8, '', {
      fontSize: '9px', color: '#ffffff', fontFamily: 'monospace',
      backgroundColor: '#000000cc', padding: { x: 8, y: 8 },
      lineSpacing: 4,
    }).setScrollFactor(0).setDepth(9999).setAlpha(0.92);

    // DOM save button — declared first so dragend can reference it
    const btn = document.createElement('button');
    btn.textContent = '💾 Save NPC positions';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '16px', left: '16px', zIndex: '9999',
      padding: '8px 14px', fontSize: '13px', fontFamily: 'monospace',
      background: '#DD4400', color: '#fff', border: 'none',
      borderRadius: '6px', cursor: 'pointer',
    });
    btn.onclick = () => this.saveNPCs(this.npcs, btn);
    document.body.appendChild(btn);
    this.events.once('shutdown', () => btn.remove());

    // Make each NPC draggable and label it
    this.npcs.forEach((npc, i) => {
      const def = NPC_DEFS[i];
      const label = def ? `${def[2]} / ${def[4]}` : `npc_${i}`;

      this.input.setDraggable(npc.sprite);
      npc.sprite.on('drag', (_: unknown, dragX: number, dragY: number) => {
        npc.sprite.setPosition(dragX, dragY);
      });
      npc.sprite.on('dragend', () => {
        (npc.sprite as any)._wasDragged = true;
        this.saveNPCs(this.npcs, btn);
      });

      // Highlight on hover
      npc.sprite.on('pointerover', () => npc.sprite.setTint(0xffff00));
      npc.sprite.on('pointerout',  () => npc.sprite.clearTint());

      (npc.sprite as any)._editorLabel = label;
    });

    // Update panel each frame
    this.events.on('update', () => {
      const lines = ['NPC EDITOR — drag to reposition (autosaves on drop)\n'];
      this.npcs.forEach(npc => {
        const lbl = (npc.sprite as any)._editorLabel ?? '?';
        lines.push(`${lbl}: x=${Math.round(npc.sprite.x)}, y=${Math.round(npc.sprite.y)}`);
      });
      panel.setText(lines.join('\n'));
    });

    this.input.on('dragstart', (_: unknown, obj: Phaser.GameObjects.GameObject) => {
      (obj as Phaser.GameObjects.Sprite).setDepth(9998);
    });
  }

  private spawnNPCs() {
    const itemById: Record<string, typeof allPortfolioData[0]> = {};
    allPortfolioData.forEach(item => { itemById[item.id] = item; });
    const isEditor = new URLSearchParams(window.location.search).get('npc-editor') === '1';

    NPC_DEFS.forEach(([x, y, outfitOrKey, radius, id, zone]) => {
      const item = itemById[id];
      if (!item) return;
      const textureBase = outfitOrKey.startsWith('char_') ? outfitOrKey : `npc_${outfitOrKey}`;
      const bounds = getZoneBounds(this.tileZoneMap, zone, TILE_SIZE);
      this.npcs.push(new NPC(this, x, y, textureBase, item, radius, bounds, isEditor));
    });
  }
}
