import type { GameWorld, TankEntity, Vec2 } from '@/models';
import { Direction, GamePhase, Team } from '@/enums';
import {
  ENEMY_CONFIG,
  INITIAL_AI_DIRECTION_TIMER,
  INITIAL_ENEMY_FIRE_COOLDOWN,
  MAX_ACTIVE_ENEMIES,
  SPAWN_ANIM_FRAMES,
  SPAWN_INTERVAL_FRAMES,
  TILE_SIZE,
  isFlashingSpawnIndex,
} from '@/utils/constants';
import { nextId } from '@/utils/ids';
import { getTankBounds, rectsOverlap } from '@/utils/collision';

export { buildEnemyRoster } from '@/services/level/enemyRoster';

export function updateSpawnSystem(world: GameWorld): void {
  if (world.phase !== GamePhase.playing) return;

  for (const enemy of world.enemies) {
    if (enemy.spawnAnimRemaining > 0) {
      enemy.spawnAnimRemaining -= 1;
    }
  }

  if (world.spawnCooldown > 0) {
    world.spawnCooldown -= 1;
  }

  if (
    world.spawnCooldown <= 0 &&
    world.enemies.length < MAX_ACTIVE_ENEMIES &&
    world.enemyQueue.length > 0
  ) {
    const spawnPoint = pickSpawnPoint(world);
    if (spawnPoint) {
      const type = world.enemyQueue.shift()!;
      world.enemySpawnIndex += 1;
      const isFlashing = isFlashingSpawnIndex(world.enemySpawnIndex);

      if (isFlashing && world.activePowerUp) {
        world.activePowerUp.active = false;
        world.activePowerUp = null;
        world.powerUps = world.powerUps.filter((p) => p.active);
      }

      const cfg = ENEMY_CONFIG[type];
      const enemy: TankEntity = {
        id: nextId('enemy'),
        team: Team.enemy,
        enemyType: type,
        hp: cfg.hp,
        maxHp: cfg.hp,
        starLevel: 0,
        direction: Direction.down,
        position: { x: spawnPoint.col * TILE_SIZE, y: spawnPoint.row * TILE_SIZE },
        speed: cfg.moveSpeed,
        moving: true,
        invincibleUntil: 0,
        frozen: false,
        stunnedUntil: 0,
        fireCooldown: INITIAL_ENEMY_FIRE_COOLDOWN,
        activeBullets: 0,
        isFlashing,
        spawnAnimRemaining: SPAWN_ANIM_FRAMES,
        aiDirectionTimer: INITIAL_AI_DIRECTION_TIMER,
        aiStuckTimer: 0,
      };
      world.enemies.push(enemy);
      world.spawnCooldown = SPAWN_INTERVAL_FRAMES;
    }
  }

  world.enemiesRemaining = world.enemyQueue.length + world.enemies.length;
}

function isSpawnOccupied(world: GameWorld, point: Vec2): boolean {
  const bounds = getTankBounds({ x: point.col * TILE_SIZE, y: point.row * TILE_SIZE });
  for (const tank of [...world.players, ...world.enemies]) {
    if (rectsOverlap(bounds, getTankBounds(tank.position))) return true;
  }
  return false;
}

function pickSpawnPoint(world: GameWorld): Vec2 | null {
  const free = world.spawnPoints.filter((p) => !isSpawnOccupied(world, p));
  if (free.length === 0) return null;
  return free[Math.floor(world.rng() * free.length)]!;
}
