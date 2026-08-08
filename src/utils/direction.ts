import type { Direction, Position } from '@/models';
import { Direction as Dir } from '@/enums';
import { ALL_DIRECTIONS, OPPOSITE } from '@/utils/constants';

export function directionToward(from: Position, to: Position): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Dir.right : Dir.left;
  }
  return dy > 0 ? Dir.down : Dir.up;
}

export function reverseDirection(d: Direction): Direction {
  return OPPOSITE[d];
}

export function randomDirection(rng: () => number, avoid?: Direction): Direction {
  const filtered = avoid ? ALL_DIRECTIONS.filter((d) => d !== avoid) : [...ALL_DIRECTIONS];
  return filtered[Math.floor(rng() * filtered.length)]!;
}
