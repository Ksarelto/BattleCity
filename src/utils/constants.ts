import type { Direction, EnemyType, TileId } from '@/models';
import { Direction as Dir } from '@/enums';

/** Native tile cell; tank art is 40×40 and draws 1:1 at this size. */
export const TILE_SIZE = 40;
export const GRID_COLS = 35;
export const GRID_ROWS = 20;
export const FIELD_WIDTH = TILE_SIZE * GRID_COLS; // 1400
export const FIELD_HEIGHT = TILE_SIZE * GRID_ROWS; // 800
export const FIXED_DT = 1 / 60;
export const LOGIC_FPS = 60;
export const STAGE_COUNT = 35;
export const MAX_FRAME_DELTA = 0.1;
export const HUD_EMIT_INTERVAL_TICKS = 6;

export const STORAGE_KEYS = {
  settings: 'battlecity-storage',
  customLevels: 'battlecity-custom-levels',
  playtest: 'battlecity-playtest',
} as const;

export const INITIAL_LIVES = 3;
export const DEFAULT_SFX_VOLUME = 0.7;
export const DEFAULT_MUSIC_VOLUME = 0.5;
export const DEFAULT_MENU_MUSIC_VOLUME = 0.45;
export const ENGINE_VOLUME_FACTOR = 0.35;
export const MAX_HIGH_SCORES = 10;
export const MAX_CUSTOM_LEVELS = 10;
export const MAX_STAR_LEVEL = 3;
export const STEEL_HITS_TO_DESTROY = 2;
export const STEEL_MIN_TIER = 3;
export const HEAVY_BULLET_DAMAGE = 2;
export const BULLET_HITBOX_SIZE = 4;
export const BULLET_COLLIDE_DIST = 6;
export const BULLET_DRAW_SIZE = 6;
export const BULLET_CENTER_NUDGE = 2;
export const BASE_SIZE_TILES = 2;
export const ARMOR_BONUS_PER_LOOP = 2;
export const ENEMY_SPAWN_POINT_COUNT = 3;
export const INITIAL_AI_DIRECTION_TIMER = 30;
export const RNG_STAGE_SEED_SCALE = 1000;
export const LEVEL_LAYOUT_SEED_PRIME = 7919;

export const ENEMY_POINTS: Record<EnemyType, number> = {
  basic: 100,
  fast: 200,
  power: 300,
  armor: 400,
};

export const ENEMY_CONFIG: Record<
  EnemyType,
  { hp: number; moveSpeed: number; bulletSpeed: number; fireCooldown: number }
> = {
  basic: { hp: 1, moveSpeed: 3, bulletSpeed: 6, fireCooldown: 90 },
  fast: { hp: 1, moveSpeed: 6, bulletSpeed: 8, fireCooldown: 75 },
  power: { hp: 1, moveSpeed: 4, bulletSpeed: 10, fireCooldown: 45 },
  armor: { hp: 4, moveSpeed: 4, bulletSpeed: 8, fireCooldown: 90 },
};

/** Divisor of TILE_SIZE so the player can reach exact column/row edges. */
export const PLAYER_MOVE_SPEED = 5;
export const PLAYER_BULLET_SPEED = 8;
export const PLAYER_FIRE_COOLDOWN = 60;
export const MAX_BULLETS_BY_TIER = [1, 1, 2, 2] as const;

export const MAX_ACTIVE_ENEMIES = 4;
export const ENEMIES_PER_STAGE = 20;
export const FLASHING_SPAWN_INDICES = [4, 11, 18];
export const SPAWN_ANIM_FRAMES = 60;
export const SPAWN_INTERVAL_FRAMES = 90;
export const SPAWN_INVINCIBILITY_FRAMES = 180;
export const STUN_FRAMES = 120;
export const COUNTDOWN_FRAMES = 120;
export const STAGE_CLEAR_FRAMES = 180;
export const LARGE_EXPLOSION_FRAMES = 60;
export const SMALL_EXPLOSION_FRAMES = 30;
export const EXTRA_LIFE_SCORE = 20000;
export const STAGE_CLEAR_BONUS = 1000;
export const COOP_KILL_BONUS = 1000;
export const POWER_UP_POINTS = 500;

export const ICE_SLIDE_FRAMES = 16;
export const AI_DIRECTION_BASE_FRAMES = 60;
export const AI_DIRECTION_RANDOM_FRAMES = 60;
export const AI_STUCK_THRESHOLD = 90;
export const AI_BASE_BIAS_CHANCE = 0.6;
export const AI_REVERSE_KEEP_CHANCE = 0.3;
export const ENEMY_FIRE_CHANCE_POWER = 0.04;
export const ENEMY_FIRE_CHANCE_DEFAULT = 0.02;
export const ENEMY_FIRE_RANDOM_CHANCE = 0.01;
export const ENEMY_FIRE_ALIGN_TOLERANCE = 20;
export const BLINK_SLOW_DIVISOR = 8;
export const BLINK_FAST_DIVISOR = 4;
export const INITIAL_ENEMY_FIRE_COOLDOWN = 30;

export const EFFECT_DURATIONS: Record<'helmet' | 'shovel' | 'timer', number> = {
  helmet: 600,
  shovel: 600,
  timer: 600,
};

export const POWER_UP_SPAWN_POSITIONS = [
  { col: 0, row: 9 }, { col: 17, row: 9 }, { col: 34, row: 9 },
  { col: 0, row: 0 }, { col: 17, row: 0 }, { col: 34, row: 0 },
  { col: 0, row: 19 }, { col: 34, row: 19 },
  { col: 5, row: 4 }, { col: 29, row: 4 },
  { col: 5, row: 15 }, { col: 29, row: 15 },
  { col: 17, row: 4 }, { col: 17, row: 15 },
  { col: 9, row: 9 }, { col: 25, row: 9 },
];

export const TILE_COLORS: Record<TileId, number> = {
  empty: 0x000000,
  brick: 0xb85c38,
  steel: 0xaaaaaa,
  water: 0x0066cc,
  ice: 0xcceeff,
  bush: 0x228822,
};

export const DIRECTION_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export const OPPOSITE: Record<Direction, Direction> = {
  up: Dir.down,
  down: Dir.up,
  left: Dir.right,
  right: Dir.left,
};

export const ALL_DIRECTIONS: Direction[] = [Dir.up, Dir.down, Dir.left, Dir.right];

export const TANK_HITBOX = 36;
export const TANK_OFFSET = (TILE_SIZE - TANK_HITBOX) / 2;

export { createDefaultBrick, tileBlocksTank } from '@/utils/brick';

export function isFlashingSpawnIndex(index: number): boolean {
  return FLASHING_SPAWN_INDICES.includes(index);
}
