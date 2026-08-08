import type { GameWorld, TankEntity } from '@/models';
import { Team } from '@/enums';
import { STUN_FRAMES } from '@/utils/constants';
import { getTankById } from '@/services/engine/createWorld';

export function handleFriendlyFire(world: GameWorld, shooterId: string, target: TankEntity): void {
  const shooter = getTankById(world, shooterId);
  if (!shooter) return;
  if (
    (shooter.team === Team.player1 && target.team === Team.player2) ||
    (shooter.team === Team.player2 && target.team === Team.player1)
  ) {
    target.stunnedUntil = world.tick + STUN_FRAMES;
  }
}
