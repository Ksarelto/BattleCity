import type { ExplosionEntity, Position } from '@/models';
import { LARGE_EXPLOSION_FRAMES, SMALL_EXPLOSION_FRAMES } from '@/utils/constants';
import { nextId } from '@/utils/ids';

export function createExplosion(
  position: Position,
  large: boolean,
): ExplosionEntity {
  return {
    id: nextId('explosion'),
    position: { ...position },
    large,
    remaining: large ? LARGE_EXPLOSION_FRAMES : SMALL_EXPLOSION_FRAMES,
  };
}
