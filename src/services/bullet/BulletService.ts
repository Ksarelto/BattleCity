import type { GameWorld, TankEntity } from '@/models';
import { GamePhase, TileId } from '@/enums';
import {
  BULLET_CENTER_NUDGE,
  BULLET_COLLIDE_DIST,
  BULLET_HITBOX_SIZE,
  DIRECTION_VECTORS,
  ENEMY_CONFIG,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  HEAVY_BULLET_DAMAGE,
  MAX_BULLETS_BY_TIER,
  PLAYER_BULLET_SPEED,
  PLAYER_FIRE_COOLDOWN,
  STEEL_MIN_TIER,
  TILE_SIZE,
} from '@/utils/constants';
import { getTankById } from '@/services/engine/createWorld';
import { nextId } from '@/utils/ids';
import { getBaseBounds, getTankBounds, rectsOverlap } from '@/utils/collision';
import { damageEnemy } from '@/services/combat/CombatService';
import { shouldEnemyFire } from '@/services/combat/EnemyFireService';
import { killPlayer } from '@/services/combat/PlayerLifecycleService';
import { damageBrickTile, damageSteelTile } from '@/services/tile/TileDamageService';
import { handleFriendlyFire } from '@/services/bullet/bulletHelpers';
import { queueSfx } from '@/services/audio/sfxQueue';

export interface FireInput {
  playerId: string;
  fire: boolean;
}

export function updateBulletSystem(world: GameWorld, fireInputs: FireInput[]): void {
  if (world.phase !== GamePhase.playing) return;

  for (const player of world.players) {
    if (player.fireCooldown > 0) player.fireCooldown -= 1;
    const input = fireInputs.find((f) => f.playerId === player.id);
    const maxBullets = MAX_BULLETS_BY_TIER[player.starLevel];
    if (input?.fire && player.fireCooldown <= 0 && player.activeBullets < maxBullets && player.spawnAnimRemaining <= 0) {
      spawnBullet(world, player, PLAYER_BULLET_SPEED, player.starLevel);
      player.fireCooldown = PLAYER_FIRE_COOLDOWN;
      queueSfx('shoot');
    }
  }

  for (const enemy of world.enemies) {
    if (enemy.frozen || enemy.spawnAnimRemaining > 0) continue;
    if (enemy.fireCooldown > 0) enemy.fireCooldown -= 1;
    if (enemy.activeBullets >= 1) continue;

    if (shouldEnemyFire(world, enemy) && enemy.fireCooldown <= 0) {
      const cfg = ENEMY_CONFIG[enemy.enemyType!];
      spawnBullet(world, enemy, cfg.bulletSpeed, 0);
      enemy.fireCooldown = cfg.fireCooldown;
      queueSfx('shoot');
    }
  }

  for (const bullet of world.bullets) {
    if (!bullet.active) continue;

    const { dx, dy } = DIRECTION_VECTORS[bullet.direction];
    bullet.position.x += dx * bullet.speed;
    bullet.position.y += dy * bullet.speed;

    if (
      bullet.position.x < 0 ||
      bullet.position.y < 0 ||
      bullet.position.x >= FIELD_WIDTH ||
      bullet.position.y >= FIELD_HEIGHT
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
  const offset = TILE_SIZE / 2 - BULLET_CENTER_NUDGE;
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

  if (cell.id === TileId.brick && cell.brick) {
    damageBrickTile(cell, bullet.direction, bullet.power >= STEEL_MIN_TIER ? HEAVY_BULLET_DAMAGE : 1);
    deactivateBullet(world, bullet.id);
    queueSfx('hit');
    return;
  }

  if (cell.id === TileId.steel) {
    if (bullet.power >= STEEL_MIN_TIER) {
      const destroyed = damageSteelTile(cell);
      if (destroyed) {
        world.grid[row]![col] = { id: TileId.empty };
      }
    }
    deactivateBullet(world, bullet.id);
    queueSfx('hit');
    return;
  }

  if (cell.id === TileId.water) return;
}

function resolveBulletEntityCollision(world: GameWorld, bullet: typeof world.bullets[0]): void {
  const bulletRect = {
    left: bullet.position.x,
    top: bullet.position.y,
    right: bullet.position.x + BULLET_HITBOX_SIZE,
    bottom: bullet.position.y + BULLET_HITBOX_SIZE,
  };

  if (world.baseIntact) {
    const base = getBaseBounds(world);
    if (rectsOverlap(bulletRect, base)) {
      world.baseIntact = false;
      world.phase = GamePhase.gameOver;
      deactivateBullet(world, bullet.id);
      queueSfx('explosion');
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
    if (player.spawnAnimRemaining > 0) continue;
    if (!rectsOverlap(bulletRect, getTankBounds(player.position))) continue;

    if (bullet.team === player.team) {
      handleFriendlyFire(world, bullet.ownerId, player);
      deactivateBullet(world, bullet.id);
      return;
    }

    if (player.invincibleUntil > world.tick) continue;
    killPlayer(world, player);
    deactivateBullet(world, bullet.id);
    return;
  }
}

function resolveBulletBulletCollision(world: GameWorld, bullet: typeof world.bullets[0]): void {
  for (const other of world.bullets) {
    if (other.id === bullet.id || !other.active) continue;
    const dx = bullet.position.x - other.position.x;
    const dy = bullet.position.y - other.position.y;
    if (Math.abs(dx) < BULLET_COLLIDE_DIST && Math.abs(dy) < BULLET_COLLIDE_DIST) {
      deactivateBullet(world, bullet.id);
      deactivateBullet(world, other.id);
      return;
    }
  }
}
