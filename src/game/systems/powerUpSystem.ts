import type { GameWorld, PowerUpType, TankEntity } from '@/types/game';
import {
  EFFECT_DURATIONS,
  EXTRA_LIFE_SCORE,
  POWER_UP_POINTS,
  POWER_UP_SPAWN_POSITIONS,
  TILE_SIZE,
} from '@/game/core/constants';
import { cloneTileCell, nextId } from '@/game/core/gameWorld';
import { getTankBounds, rectsOverlap } from '@/game/systems/collisionSystem';
import { checkStageClear } from '@/game/systems/spawnSystem';

const ALL_POWER_UPS: PowerUpType[] = ['grenade', 'helmet', 'shovel', 'star', 'tank', 'timer'];

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
  if (world.phase !== 'playing') return;

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
      const helmet = world.effects.find((e) => e.type === 'helmet');
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

  switch (type) {
    case 'grenade':
      clearEnemiesWithGrenade(world);
      break;
    case 'helmet':
      player.invincibleUntil = world.tick + (EFFECT_DURATIONS.helmet ?? 600);
      world.effects.push({ type: 'helmet', remaining: EFFECT_DURATIONS.helmet ?? 600 });
      break;
    case 'shovel':
      fortifyBase(world);
      world.fortifiedUntil = world.tick + (EFFECT_DURATIONS.shovel ?? 600);
      world.effects.push({ type: 'shovel', remaining: EFFECT_DURATIONS.shovel ?? 600 });
      break;
    case 'star':
      if (player.starLevel < 3) {
        player.starLevel = (player.starLevel + 1) as 0 | 1 | 2 | 3;
      }
      break;
    case 'tank':
      world.lives += 1;
      break;
    case 'timer':
      for (const enemy of world.enemies) {
        enemy.frozen = true;
      }
      world.effects.push({ type: 'timer', remaining: EFFECT_DURATIONS.timer ?? 600 });
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
      if (r >= 0 && r < 13 && c >= 0 && c < 13) {
        const cell = world.grid[r]![c]!;
        if (cell.id === 'brick' || cell.id === 'steel') {
          world.originalBaseWalls.push({ col: c, row: r, cell: cloneTileCell(cell) });
          world.grid[r]![c] = { id: 'steel', steelHits: 0 };
        }
      }
    }
  }
}

function restoreBaseWalls(world: GameWorld): void {
  for (const wall of world.originalBaseWalls) {
    world.grid[wall.row]![wall.col] = cloneTileCell(wall.cell);
    if (world.grid[wall.row]![wall.col]!.id === 'brick') {
      world.grid[wall.row]![wall.col]!.brick = { tl: true, tr: true, bl: true, br: true };
    }
  }
  world.originalBaseWalls = [];
}

export function updateTimerEffect(world: GameWorld): void {
  const timer = world.effects.find((e) => e.type === 'timer');
  if (!timer) {
    for (const enemy of world.enemies) {
      enemy.frozen = false;
    }
  }
}
