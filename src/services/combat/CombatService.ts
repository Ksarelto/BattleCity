import type { GameWorld, TankEntity } from '@/models';
import { EnemyType } from '@/enums';
import { ENEMY_POINTS } from '@/utils/constants';
import { spawnPowerUp } from '@/services/powerUp/PowerUpService';
import { createExplosion } from '@/utils/explosion';
import { queueSfx } from '@/services/audio/sfxQueue';
import { checkStageClear } from '@/services/combat/stageClear';

export { checkStageClear } from '@/services/combat/stageClear';

export function damageEnemy(
  world: GameWorld,
  enemy: TankEntity,
  bullet: { ownerId: string },
): void {
  const ownerIdx = world.players.findIndex((p) => p.id === bullet.ownerId);
  enemy.hp -= 1;

  if (enemy.hp <= 0) {
    world.explosions.push(createExplosion(enemy.position, enemy.enemyType === EnemyType.armor));
    queueSfx('explosion');

    if (enemy.isFlashing) {
      spawnPowerUp(world);
      queueSfx('powerup');
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
