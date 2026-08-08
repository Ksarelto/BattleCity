import type { GameWorld, PowerUpType, TankEntity } from '@/models';
import { GamePhase, PowerUpType as PowerUp, TileId } from '@/enums';
import {
  EFFECT_DURATIONS,
  EXTRA_LIFE_SCORE,
  GRID_COLS,
  GRID_ROWS,
  MAX_STAR_LEVEL,
  POWER_UP_POINTS,
  POWER_UP_SPAWN_POSITIONS,
  TILE_SIZE,
  createDefaultBrick,
} from '@/utils/constants';
import { cloneTileCell } from '@/services/engine/createWorld';
import { nextId } from '@/utils/ids';
import { getTankBounds, rectsOverlap } from '@/utils/collision';
import { checkStageClear } from '@/services/combat/stageClear';
import { queueSfx } from '@/services/audio/sfxQueue';

const ALL_POWER_UPS = Object.values(PowerUp) as PowerUpType[];

export function spawnPowerUp(world: GameWorld): void {
  const pos = POWER_UP_SPAWN_POSITIONS[Math.floor(world.rng() * POWER_UP_SPAWN_POSITIONS.length)]!;
  const type = ALL_POWER_UPS[Math.floor(world.rng() * ALL_POWER_UPS.length)]!;

  const powerUp = {
    id: nextId('powerup'),
    type,
    position: { x: pos.col * TILE_SIZE, y: pos.row * TILE_SIZE },
    active: true,
  };

  world.powerUps.push(powerUp);
  world.activePowerUp = powerUp;
}

export function updatePowerUpSystem(world: GameWorld): void {
  if (world.phase !== GamePhase.playing) return;

  for (const effect of world.effects) {
    effect.remaining -= 1;
  }
  world.effects = world.effects.filter((e) => e.remaining > 0);

  if (world.fortifiedUntil > 0 && world.tick >= world.fortifiedUntil) {
    restoreBaseWalls(world);
    world.fortifiedUntil = 0;
  }

  for (const player of world.players) {
    if (player.invincibleUntil > 0 && world.tick >= player.invincibleUntil) {
      const helmet = world.effects.find((e) => e.type === PowerUp.helmet);
      if (!helmet) player.invincibleUntil = 0;
    }
  }

  for (const pu of world.powerUps) {
    if (!pu.active) continue;
    for (const player of world.players) {
      const bounds = getTankBounds(player.position);
      const puRect = {
        left: pu.position.x,
        top: pu.position.y,
        right: pu.position.x + TILE_SIZE,
        bottom: pu.position.y + TILE_SIZE,
      };
      if (rectsOverlap(bounds, puRect)) {
        collectPowerUp(world, player, pu.type);
        pu.active = false;
        world.activePowerUp = null;
      }
    }
  }
  world.powerUps = world.powerUps.filter((p) => p.active);
}

export function collectPowerUp(world: GameWorld, player: TankEntity, type: PowerUpType): void {
  world.score += POWER_UP_POINTS;
  queueSfx('powerup');

  switch (type) {
    case PowerUp.grenade:
      clearEnemiesWithGrenade(world);
      break;
    case PowerUp.helmet:
      player.invincibleUntil = world.tick + EFFECT_DURATIONS.helmet;
      world.effects.push({ type: PowerUp.helmet, remaining: EFFECT_DURATIONS.helmet });
      break;
    case PowerUp.shovel:
      fortifyBase(world);
      world.fortifiedUntil = world.tick + EFFECT_DURATIONS.shovel;
      world.effects.push({ type: PowerUp.shovel, remaining: EFFECT_DURATIONS.shovel });
      break;
    case PowerUp.star:
      if (player.starLevel < MAX_STAR_LEVEL) {
        player.starLevel = (player.starLevel + 1) as 0 | 1 | 2 | 3;
      }
      break;
    case PowerUp.tank:
      world.lives += 1;
      break;
    case PowerUp.timer:
      for (const enemy of world.enemies) {
        enemy.frozen = true;
      }
      world.effects.push({ type: PowerUp.timer, remaining: EFFECT_DURATIONS.timer });
      break;
  }

  checkExtraLife(world);
}

function clearEnemiesWithGrenade(world: GameWorld): void {
  const count = world.enemies.length;
  world.grenadeKills += count;
  world.enemies = [];
  world.enemiesKilled += count;
  checkStageClear(world);
}

function checkExtraLife(world: GameWorld): void {
  if (!world.extraLifeAwarded && world.score >= EXTRA_LIFE_SCORE) {
    world.lives += 1;
    world.extraLifeAwarded = true;
  }
}

function fortifyBase(world: GameWorld): void {
  const { col, row } = world.basePosition;
  world.originalBaseWalls = [];
  for (let r = row - 1; r <= row + 2; r++) {
    for (let c = col - 1; c <= col + 2; c++) {
      if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS) {
        const cell = world.grid[r]![c]!;
        if (cell.id === TileId.brick || cell.id === TileId.steel) {
          world.originalBaseWalls.push({ col: c, row: r, cell: cloneTileCell(cell) });
          world.grid[r]![c] = { id: TileId.steel, steelHits: 0 };
        }
      }
    }
  }
}

function restoreBaseWalls(world: GameWorld): void {
  for (const wall of world.originalBaseWalls) {
    world.grid[wall.row]![wall.col] = cloneTileCell(wall.cell);
    if (world.grid[wall.row]![wall.col]!.id === TileId.brick) {
      world.grid[wall.row]![wall.col]!.brick = createDefaultBrick();
    }
  }
  world.originalBaseWalls = [];
}

export function updateTimerEffect(world: GameWorld): void {
  const timer = world.effects.find((e) => e.type === PowerUp.timer);
  if (!timer) {
    for (const enemy of world.enemies) {
      enemy.frozen = false;
    }
  }
}
