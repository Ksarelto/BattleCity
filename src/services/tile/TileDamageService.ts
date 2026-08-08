import type { BrickQuadrants, Direction, TileCell } from '@/models';
import { Direction as Dir, TileId } from '@/enums';
import { STEEL_HITS_TO_DESTROY } from '@/utils/constants';

function removeQuadrants(q: BrickQuadrants, direction: Direction, count: number): void {
  const sides: Record<Direction, (keyof BrickQuadrants)[]> = {
    [Dir.up]: ['bl', 'br'],
    [Dir.down]: ['tl', 'tr'],
    [Dir.left]: ['tr', 'br'],
    [Dir.right]: ['tl', 'bl'],
  };
  const keys = sides[direction];
  let removed = 0;
  for (const k of keys) {
    if (q[k] && removed < count) {
      q[k] = false;
      removed += 1;
    }
  }
  if (removed < count) {
    for (const k of ['tl', 'tr', 'bl', 'br'] as const) {
      if (q[k] && removed < count) {
        q[k] = false;
        removed += 1;
      }
    }
  }
}

export function damageBrickTile(cell: TileCell, direction: Direction, amount: number): void {
  if (cell.id !== TileId.brick || !cell.brick) return;
  removeQuadrants(cell.brick, direction, amount);
  const intact = cell.brick.tl || cell.brick.tr || cell.brick.bl || cell.brick.br;
  if (!intact) {
    cell.id = TileId.empty;
    delete cell.brick;
  }
}

export function damageSteelTile(cell: TileCell): boolean {
  if (cell.id !== TileId.steel) return false;
  cell.steelHits = (cell.steelHits ?? 0) + 1;
  if (cell.steelHits >= STEEL_HITS_TO_DESTROY) {
    cell.id = TileId.empty;
    delete cell.steelHits;
    return true;
  }
  return false;
}
