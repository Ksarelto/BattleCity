import type { GameWorld, TankEntity } from '@/models';
import { Direction, EnemyType } from '@/enums';
import {
  ENEMY_FIRE_ALIGN_TOLERANCE,
  ENEMY_FIRE_CHANCE_DEFAULT,
  ENEMY_FIRE_CHANCE_POWER,
  ENEMY_FIRE_RANDOM_CHANCE,
  TILE_SIZE,
} from '@/utils/constants';
import { getBaseBounds } from '@/utils/collision';

export function shouldEnemyFire(world: GameWorld, enemy: TankEntity): boolean {
  const fireChance =
    enemy.enemyType === EnemyType.power ? ENEMY_FIRE_CHANCE_POWER : ENEMY_FIRE_CHANCE_DEFAULT;
  if (world.rng() > fireChance) return false;

  const base = getBaseBounds(world);
  const tankCenter = {
    x: enemy.position.x + TILE_SIZE / 2,
    y: enemy.position.y + TILE_SIZE / 2,
  };

  if (
    enemy.direction === Direction.down &&
    Math.abs(tankCenter.x - (base.left + base.right) / 2) < ENEMY_FIRE_ALIGN_TOLERANCE
  ) {
    return true;
  }
  if (
    enemy.direction === Direction.up &&
    Math.abs(tankCenter.x - (base.left + base.right) / 2) < ENEMY_FIRE_ALIGN_TOLERANCE
  ) {
    return true;
  }

  for (const player of world.players) {
    const pc = { x: player.position.x + TILE_SIZE / 2, y: player.position.y + TILE_SIZE / 2 };
    if (
      enemy.direction === Direction.left &&
      Math.abs(tankCenter.y - pc.y) < ENEMY_FIRE_ALIGN_TOLERANCE &&
      pc.x < tankCenter.x
    ) {
      return true;
    }
    if (
      enemy.direction === Direction.right &&
      Math.abs(tankCenter.y - pc.y) < ENEMY_FIRE_ALIGN_TOLERANCE &&
      pc.x > tankCenter.x
    ) {
      return true;
    }
  }

  return world.rng() < ENEMY_FIRE_RANDOM_CHANCE;
}
