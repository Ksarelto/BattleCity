import type { Direction, EnemyType, PowerUpType, TileId } from '@/types/game';

export const TILE_SIZE = 16;
export const GRID_SIZE = 13;
export const FIELD_SIZE = TILE_SIZE * GRID_SIZE;
export const FIXED_DT = 1 / 60;
export const LOGIC_FPS = 60;

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
  basic: { hp: 1, moveSpeed: 1.5, bulletSpeed: 3, fireCooldown: 90 },
  fast: { hp: 1, moveSpeed: 3, bulletSpeed: 4, fireCooldown: 75 },
  power: { hp: 1, moveSpeed: 2, bulletSpeed: 5, fireCooldown: 45 },
  armor: { hp: 4, moveSpeed: 2, bulletSpeed: 4, fireCooldown: 90 },
};

export const PLAYER_MOVE_SPEED = 2.5;
export const PLAYER_BULLET_SPEED = 4;
export const PLAYER_FIRE_COOLDOWN = 60;
export const MAX_BULLETS_BY_TIER = [1, 1, 2, 2] as const;

export const MAX_ACTIVE_ENEMIES = 4;
export const ENEMIES_PER_STAGE = 20;
export const FLASHING_SPAWN_INDICES = [4, 11, 18];
export const SPAWN_ANIM_FRAMES = 60;
export const SPAWN_INVINCIBILITY_FRAMES = 180;
export const STUN_FRAMES = 120;
export const EXTRA_LIFE_SCORE = 20000;
export const STAGE_CLEAR_BONUS = 1000;
export const COOP_KILL_BONUS = 1000;
export const POWER_UP_POINTS = 500;

export const EFFECT_DURATIONS: Partial<Record<PowerUpType, number>> = {
  helmet: 600,
  shovel: 600,
  timer: 600,
};

export const POWER_UP_SPAWN_POSITIONS = [
  { col: 0, row: 6 }, { col: 6, row: 6 }, { col: 12, row: 6 },
  { col: 0, row: 0 }, { col: 6, row: 0 }, { col: 12, row: 0 },
  { col: 0, row: 12 }, { col: 12, row: 12 },
  { col: 3, row: 3 }, { col: 9, row: 3 },
  { col: 3, row: 9 }, { col: 9, row: 9 },
  { col: 6, row: 3 }, { col: 6, row: 9 },
  { col: 3, row: 6 }, { col: 9, row: 6 },
];

export const TILE_COLORS: Record<TileId, number> = {
  empty: 0x000000,
  brick: 0xb85c38,
  steel: 0xaaaaaa,
  water: 0x0066cc,
  ice: 0xcceeff,
  bush: 0x228822,
};

export const TANK_COLORS = {
  player1: 0xffcc00,
  player2: 0x00cc44,
  basic: 0x808080,
  fast: 0x606060,
  power: 0xa05050,
  armor: [0x4a8a4a, 0x6aaa6a, 0x888888, 0x555555] as const,
};

export const POWER_UP_COLORS: Record<PowerUpType, number> = {
  grenade: 0xff4400,
  helmet: 0x00ccff,
  shovel: 0xcc8844,
  star: 0xffcc00,
  tank: 0xff00ff,
  timer: 0x44ff44,
};

export const DIRECTION_VECTORS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export const ALL_DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right'];

export const TANK_HITBOX = 14;
export const TANK_OFFSET = (TILE_SIZE - TANK_HITBOX) / 2;

export function createDefaultBrick(): { tl: boolean; tr: boolean; bl: boolean; br: boolean } {
  return { tl: true, tr: true, bl: true, br: true };
}

export function tileBlocksTank(id: TileId): boolean {
  return id === 'brick' || id === 'steel' || id === 'water';
}

export function tileBlocksBullet(id: TileId): boolean {
  return id === 'steel';
}

export function isFlashingSpawnIndex(index: number): boolean {
  return FLASHING_SPAWN_INDICES.includes(index);
}
