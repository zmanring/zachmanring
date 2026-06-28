// ─── Game Dimensions ─────────────────────────────────────────────────────────
export const GAME_WIDTH  = 960;
export const GAME_HEIGHT = 540;
export const TILE = 32;

// ─── World ────────────────────────────────────────────────────────────────────
export const WORLD_W = 2560;
export const WORLD_H = 1440;

// The world is four zone quadrants separated by a central plaza cross:
//   Vertical corridor:   x = 1024–1536
//   Horizontal corridor: y =  576–864
export const ZONE_RECTS = {
  WORKSHOP: { x: 0,    y: 0,   w: 1024, h: 576 },
  STUDIO:   { x: 1536, y: 0,   w: 1024, h: 576 },
  OFFICE:   { x: 0,    y: 864, w: 1024, h: 576 },
  PROJECTS: { x: 1536, y: 864, w: 1024, h: 576 },
} as const;

// ─── Physics ──────────────────────────────────────────────────────────────────
export const PLAYER_SPEED = 180;
export const NPC_SPEED    = 38;

// ─── Camera ───────────────────────────────────────────────────────────────────
export const CAMERA_LERP = 0.1;

// ─── Palette ──────────────────────────────────────────────────────────────────
export const PALETTE = {
  BG:           0x111111,
  ACCENT:       0xDD4400,
  ACCENT_DIM:   0x7A2600,
  TEXT_LIGHT:   0xF0EDE8,
  GREY:         0x222222,
  GREY_MID:     0x444444,
  // Ground
  GRASS:        0x1A2E1A,
  PATH:         0x2E2920,
  // Zone floors
  FLOOR_WS:     0x1A1A1A,  // workshop — SGW near-black (#222)
  FLOOR_ST:     0x06102B,  // studio — Pixel Broccoli deep space navy
  FLOOR_OF:     0x0F1E30,  // office — dark blue
  FLOOR_PJ:     0x1A1A1A,  // projects — near-black concrete
  // Zone accent tints (for borders/details)
  CLR_WS:       0xDD4400,  // SGW orange
  CLR_ST:       0xC42DD7,  // Brocc purple
  CLR_OF:       0x1565C0,
  CLR_PJ:       0x37474F,
} as const;

// ─── Depths ───────────────────────────────────────────────────────────────────
export const DEPTH = {
  BG:          0,
  GROUND:      5,
  DECOR:       8,
  NPC:         20,
  PLAYER:      30,
  PARTICLES:   40,
  UI:          100,
} as const;

// ─── Events ───────────────────────────────────────────────────────────────────
export const EVENTS = {
  OPEN_CARD:      'openCard',
  CLOSE_CARD:     'closeCard',
  LEVEL_COMPLETE: 'levelComplete',
  COIN_COLLECT:   'coinCollect',
} as const;

// ─── Scenes ───────────────────────────────────────────────────────────────────
export const SCENES = {
  BOOT:  'BootScene',
  WORLD: 'WorldScene',
  UI:    'UIScene',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONT = '"Press Start 2P", monospace';
