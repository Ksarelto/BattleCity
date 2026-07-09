import type { EnemyType, GameWorld, TankEntity } from '@/types/game';
import {
  ENEMIES_PER_STAGE,
  ENEMY_CONFIG,
  ENEMY_POINTS,
  MAX_ACTIVE_ENEMIES,
  SPAWN_ANIM_FRAMES,
  STAGE_CLEAR_BONUS,
  TILE_SIZE,
  isFlashingSpawnIndex,
} from '@/game/core/constants';
import { nextId } from '@/game/core/gameWorld';
import { spawnPowerUp } from '@/game/systems/powerUpSystem';

export function updateSpawnSystem(world: GameWorld): void {
  if (world.phase !== 'playing') return;

  for (const enemy of world.enemies) {
    if (enemy.spawnAnimRemaining > 0) {
      enemy.spawnAnimRemaining -= 1;
    }
  }

  while (world.enemies.length < MAX_ACTIVE_ENEMIES && world.enemyQueue.length > 0) {
    const spawnPoint = pickSpawnPoint(world);
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
      team: 'enemy',
      enemyType: type,
      hp: cfg.hp,
      maxHp: cfg.hp,
      starLevel: 0,
      direction: 'down',
      position: { x: spawnPoint.col * TILE_SIZE, y: spawnPoint.row * TILE_SIZE },
      speed: cfg.moveSpeed,
      moving: true,
      invincibleUntil: 0,
      frozen: false,
      stunnedUntil: 0,
      fireCooldown: 30,
      activeBullets: 0,
      isFlashing,
      spawnAnimRemaining: SPAWN_ANIM_FRAMES,
      aiDirectionTimer: 30,
      aiStuckTimer: 0,
    };
    world.enemies.push(enemy);
  }

  world.enemiesRemaining = world.enemyQueue.length + world.enemies.length;
}

function pickSpawnPoint(world: GameWorld) {
  return world.spawnPoints[Math.floor(world.rng() * world.spawnPoints.length)]!;
}

export function damageEnemy(
  world: GameWorld,
  enemy: TankEntity,
  bullet: { ownerId: string },
): void {
  const ownerIdx = world.players.findIndex((p) => p.id === bullet.ownerId);
  enemy.hp -= 1;

  if (enemy.hp <= 0) {
    world.explosions.push({
      id: nextId('explosion'),
      position: { ...enemy.position },
      large: enemy.enemyType === 'armor',
      remaining: enemy.enemyType === 'armor' ? 60 : 30,
    });

    if (enemy.isFlashing) {
      spawnPowerUp(world);
    }

    world.enemies = world.enemies.filter((e) => e.id !== enemy.id);
    world.enemiesKilled += 1;
    world.enemiesRemaining = world.enemyQueue.length + world.enemies.length;

    const points = ENEMY_POINTS[enemy.enemyType!];
    world.score += points;
    if (ownerIdx >= 0) {
      world.playerKills[ownerIdx] = (world.playerKills[ownerIdx] ?? 0) + 1;
    }

    checkStageClear(world);
  }
}

export function checkStageClear(world: GameWorld): void {
  if (world.enemyQueue.length === 0 && world.enemies.length === 0) {
    world.phase = 'stageClear';
    world.stageClearTimer = 180;
    world.score += STAGE_CLEAR_BONUS;

    if (world.twoPlayer) {
      const [k1, k2] = world.playerKills;
      if (k1 > k2) world.score += 1000;
      else if (k2 > k1) world.score += 1000;
    }
  }
}

export function buildEnemyRoster(counts: {
  basic: number;
  fast: number;
  power: number;
  armor: number;
}): EnemyType[] {
  const roster: EnemyType[] = [];
  for (let i = 0; i < counts.basic; i++) roster.push('basic');
  for (let i = 0; i < counts.fast; i++) roster.push('fast');
  for (let i = 0; i < counts.power; i++) roster.push('power');
  for (let i = 0; i < counts.armor; i++) roster.push('armor');
  while (roster.length < ENEMIES_PER_STAGE) roster.push('basic');
  for (let i = roster.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roster[i], roster[j]] = [roster[j]!, roster[i]!];
  }
  return roster.slice(0, ENEMIES_PER_STAGE);
}
