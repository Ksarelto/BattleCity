import type { GameWorld, TankEntity } from '@/types/game';
import {
  DIRECTION_VECTORS,
  ENEMY_CONFIG,
  MAX_BULLETS_BY_TIER,
  PLAYER_BULLET_SPEED,
  PLAYER_FIRE_COOLDOWN,
  TILE_SIZE,
} from '@/game/core/constants';
import { getTankById, nextId } from '@/game/core/gameWorld';
import { getBaseBounds, getTankBounds, rectsOverlap } from '@/game/systems/collisionSystem';
import { damageEnemy } from '@/game/systems/spawnSystem';
import { damageBrickTile, damageSteelTile } from '@/game/systems/tileDamageSystem';
import { handleFriendlyFire } from '@/game/systems/bulletSystem.helpers';

export interface FireInput {
  playerId: string;
  fire: boolean;
}

export function updateBulletSystem(world: GameWorld, fireInputs: FireInput[]): void {
  if (world.phase !== 'playing') return;

  for (const player of world.players) {
    if (player.fireCooldown > 0) player.fireCooldown -= 1;
    const input = fireInputs.find((f) => f.playerId === player.id);
    const maxBullets = MAX_BULLETS_BY_TIER[player.starLevel];
    if (input?.fire && player.fireCooldown <= 0 && player.activeBullets < maxBullets && player.spawnAnimRemaining <= 0) {
      spawnBullet(world, player, PLAYER_BULLET_SPEED, player.starLevel);
      player.fireCooldown = PLAYER_FIRE_COOLDOWN;
    }
  }

  for (const enemy of world.enemies) {
    if (enemy.frozen || enemy.spawnAnimRemaining > 0) continue;
    if (enemy.fireCooldown > 0) enemy.fireCooldown -= 1;
    if (enemy.activeBullets >= 1) continue;

    const shouldFire = shouldEnemyFire(world, enemy);
    if (shouldFire && enemy.fireCooldown <= 0) {
      const cfg = ENEMY_CONFIG[enemy.enemyType!];
      spawnBullet(world, enemy, cfg.bulletSpeed, 0);
      enemy.fireCooldown = cfg.fireCooldown;
    }
  }

  const toRemove: string[] = [];
  for (const bullet of world.bullets) {
    if (!bullet.active) {
      toRemove.push(bullet.id);
      continue;
    }

    const { dx, dy } = DIRECTION_VECTORS[bullet.direction];
    bullet.position.x += dx * bullet.speed;
    bullet.position.y += dy * bullet.speed;

    if (
      bullet.position.x < 0 ||
      bullet.position.y < 0 ||
      bullet.position.x >= TILE_SIZE * 13 ||
      bullet.position.y >= TILE_SIZE * 13
    ) {
      deactivateBullet(world, bullet.id);
      continue;
    }

    resolveBulletTileCollision(world, bullet);
    if (!bullet.active) continue;

    resolveBulletEntityCollision(world, bullet);
    if (!bullet.active) continue;

    resolveBulletBulletCollision(world, bullet);
  }

  world.bullets = world.bullets.filter((b) => b.active);
}

function spawnBullet(world: GameWorld, tank: TankEntity, speed: number, power: number): void {
  const offset = TILE_SIZE / 2 - 2;
  let bx = tank.position.x + offset;
  let by = tank.position.y + offset;

  const { dx, dy } = DIRECTION_VECTORS[tank.direction];
  bx += dx * (TILE_SIZE / 2);
  by += dy * (TILE_SIZE / 2);

  world.bullets.push({
    id: nextId('bullet'),
    ownerId: tank.id,
    team: tank.team,
    direction: tank.direction,
    position: { x: bx, y: by },
    speed,
    power,
    active: true,
  });
  tank.activeBullets += 1;
}

function deactivateBullet(world: GameWorld, bulletId: string): void {
  const bullet = world.bullets.find((b) => b.id === bulletId);
  if (!bullet) return;
  bullet.active = false;
  const owner = getTankById(world, bullet.ownerId);
  if (owner) owner.activeBullets = Math.max(0, owner.activeBullets - 1);
}

function resolveBulletTileCollision(world: GameWorld, bullet: typeof world.bullets[0]): void {
  const col = Math.floor(bullet.position.x / TILE_SIZE);
  const row = Math.floor(bullet.position.y / TILE_SIZE);
  const cell = world.grid[row]?.[col];
  if (!cell) {
    deactivateBullet(world, bullet.id);
    return;
  }

  if (cell.id === 'brick' && cell.brick) {
    damageBrickTile(cell, bullet.direction, bullet.power >= 3 ? 2 : 1);
    deactivateBullet(world, bullet.id);
    return;
  }

  if (cell.id === 'steel') {
    if (bullet.power >= 3) {
      const destroyed = damageSteelTile(cell);
      if (destroyed) {
        world.grid[row]![col] = { id: 'empty' };
      }
    }
    deactivateBullet(world, bullet.id);
    return;
  }

  if (cell.id === 'water') return;
}

function resolveBulletEntityCollision(world: GameWorld, bullet: typeof world.bullets[0]): void {
  const bulletRect = {
    left: bullet.position.x,
    top: bullet.position.y,
    right: bullet.position.x + 4,
    bottom: bullet.position.y + 4,
  };

  if (world.baseIntact) {
    const base = getBaseBounds(world);
    if (rectsOverlap(bulletRect, base)) {
      world.baseIntact = false;
      world.phase = 'gameOver';
      deactivateBullet(world, bullet.id);
      return;
    }
  }

  for (const player of world.players) {
    if (bullet.team === player.team) continue;
    if (player.invincibleUntil > world.tick) continue;
    if (player.spawnAnimRemaining > 0) continue;
    if (rectsOverlap(bulletRect, getTankBounds(player.position))) {
      killPlayer(world, player);
      deactivateBullet(world, bullet.id);
      return;
    }
  }

  for (const enemy of world.enemies) {
    if (enemy.spawnAnimRemaining > 0) continue;
    if (rectsOverlap(bulletRect, getTankBounds(enemy.position))) {
      damageEnemy(world, enemy, bullet);
      deactivateBullet(world, bullet.id);
      return;
    }
  }

  for (const player of world.players) {
    if (bullet.team === player.team) {
      if (rectsOverlap(bulletRect, getTankBounds(player.position))) {
        handleFriendlyFire(world, bullet.ownerId, player);
        deactivateBullet(world, bullet.id);
      }
      continue;
    }
    if (rectsOverlap(bulletRect, getTankBounds(player.position))) {
      killPlayer(world, player);
      deactivateBullet(world, bullet.id);
      return;
    }
  }
}

function resolveBulletBulletCollision(world: GameWorld, bullet: typeof world.bullets[0]): void {
  for (const other of world.bullets) {
    if (other.id === bullet.id || !other.active) continue;
    const dx = bullet.position.x - other.position.x;
    const dy = bullet.position.y - other.position.y;
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6) {
      deactivateBullet(world, bullet.id);
      deactivateBullet(world, other.id);
      return;
    }
  }
}

function killPlayer(world: GameWorld, player: TankEntity): void {
  if (player.invincibleUntil > world.tick) return;

  world.explosions.push({
    id: nextId('explosion'),
    position: { ...player.position },
    large: true,
    remaining: 60,
  });

  world.lives -= 1;
  player.starLevel = 0;
  player.activeBullets = 0;
  player.position = {
    x: world.level.playerSpawns.find((s) => s.player === (player.team === 'player1' ? 1 : 2))!.col * TILE_SIZE,
    y: world.level.playerSpawns.find((s) => s.player === (player.team === 'player1' ? 1 : 2))!.row * TILE_SIZE,
  };
  player.invincibleUntil = world.tick + 180;

  if (world.lives <= 0) {
    world.phase = 'gameOver';
  }
}

function shouldEnemyFire(world: GameWorld, enemy: TankEntity): boolean {
  const fireChance = enemy.enemyType === 'power' ? 0.04 : 0.02;
  if (world.rng() > fireChance) return false;

  const base = getBaseBounds(world);
  const tankCenter = {
    x: enemy.position.x + TILE_SIZE / 2,
    y: enemy.position.y + TILE_SIZE / 2,
  };

  if (enemy.direction === 'down' && Math.abs(tankCenter.x - (base.left + base.right) / 2) < 8) return true;
  if (enemy.direction === 'up' && Math.abs(tankCenter.x - (base.left + base.right) / 2) < 8) return true;

  for (const player of world.players) {
    const pc = { x: player.position.x + TILE_SIZE / 2, y: player.position.y + TILE_SIZE / 2 };
    if (enemy.direction === 'left' && Math.abs(tankCenter.y - pc.y) < 8 && pc.x < tankCenter.x) return true;
    if (enemy.direction === 'right' && Math.abs(tankCenter.y - pc.y) < 8 && pc.x > tankCenter.x) return true;
  }

  return world.rng() < 0.01;
}
