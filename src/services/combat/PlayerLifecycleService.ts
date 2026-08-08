import type { GameWorld, TankEntity } from '@/models';
import { GamePhase, Team } from '@/enums';
import { SPAWN_INVINCIBILITY_FRAMES, TILE_SIZE } from '@/utils/constants';
import { createExplosion } from '@/utils/explosion';
import { queueSfx } from '@/services/audio/sfxQueue';

export function killPlayer(world: GameWorld, player: TankEntity): void {
  if (player.invincibleUntil > world.tick) return;

  world.explosions.push(createExplosion(player.position, true));
  queueSfx('explosion');

  world.lives -= 1;
  player.starLevel = 0;
  player.activeBullets = 0;
  const spawn = world.level.playerSpawns.find(
    (s) => s.player === (player.team === Team.player1 ? 1 : 2),
  )!;
  player.position = {
    x: spawn.col * TILE_SIZE,
    y: spawn.row * TILE_SIZE,
  };
  player.invincibleUntil = world.tick + SPAWN_INVINCIBILITY_FRAMES;

  if (world.lives <= 0) {
    world.phase = GamePhase.gameOver;
    queueSfx('gameOver');
  }
}
