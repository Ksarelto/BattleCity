import type { GameWorld, TankEntity } from '@/types/game';
import { getTankById } from '@/game/core/gameWorld';

export function handleFriendlyFire(world: GameWorld, shooterId: string, target: TankEntity): void {
  const shooter = getTankById(world, shooterId);
  if (!shooter) return;
  if (
    (shooter.team === 'player1' && target.team === 'player2') ||
    (shooter.team === 'player2' && target.team === 'player1')
  ) {
    target.stunnedUntil = world.tick + 120;
  }
}
