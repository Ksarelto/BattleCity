import type { GameWorld, TankEntity } from '@/models';
import {
  Direction,
  EnemyType,
  GamePhase,
  Team,
  TileId,
} from '@/enums';
import { createGameWorld, createTileCell } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';
import {
  ENEMY_CONFIG,
  GRID_COLS,
  GRID_ROWS,
  INITIAL_AI_DIRECTION_TIMER,
} from '@/utils/constants';

export function emptyGridWorld(overrides?: Partial<Parameters<typeof createGameWorld>[1]>): GameWorld {
  const level = createLevel(1);
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      level.grid[r]![c] = TileId.empty;
    }
  }
  const world = createGameWorld(level, overrides);
  world.phase = GamePhase.playing;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      world.grid[r]![c] = createTileCell(TileId.empty);
    }
  }
  return world;
}

export function makeEnemy(
  partial: Partial<TankEntity> & Pick<TankEntity, 'id' | 'position'>,
): TankEntity {
  const type = partial.enemyType ?? EnemyType.basic;
  const cfg = ENEMY_CONFIG[type];
  return {
    team: Team.enemy,
    enemyType: type,
    hp: cfg.hp,
    maxHp: cfg.hp,
    starLevel: 0,
    direction: Direction.down,
    speed: cfg.moveSpeed,
    moving: true,
    invincibleUntil: 0,
    frozen: false,
    stunnedUntil: 0,
    fireCooldown: 0,
    activeBullets: 0,
    isFlashing: false,
    spawnAnimRemaining: 0,
    aiDirectionTimer: INITIAL_AI_DIRECTION_TIMER,
    aiStuckTimer: 0,
    ...partial,
  };
}
