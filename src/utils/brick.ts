import type { BrickQuadrants, TileId } from '@/models';
import { TileId as Tile } from '@/enums';

export function createDefaultBrick(): BrickQuadrants {
  return { tl: true, tr: true, bl: true, br: true };
}

export function tileBlocksTank(id: TileId): boolean {
  return id === Tile.brick || id === Tile.steel || id === Tile.water;
}

export function brickIntact(q: BrickQuadrants): boolean {
  return q.tl || q.tr || q.bl || q.br;
}

export function countBrickQuadrants(q: BrickQuadrants): number {
  return (q.tl ? 1 : 0) + (q.tr ? 1 : 0) + (q.bl ? 1 : 0) + (q.br ? 1 : 0);
}
