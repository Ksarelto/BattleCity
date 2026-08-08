import type { BrickQuadrants, Direction, TileCell } from '@/types/game';

function removeQuadrants(q: BrickQuadrants, direction: Direction, count: number): void {
  const sides: Record<Direction, (keyof BrickQuadrants)[]> = {
    up: ['bl', 'br'],
    down: ['tl', 'tr'],
    left: ['tr', 'br'],
    right: ['tl', 'bl'],
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
  if (cell.id !== 'brick' || !cell.brick) return;
  removeQuadrants(cell.brick, direction, amount);
  const intact = cell.brick.tl || cell.brick.tr || cell.brick.bl || cell.brick.br;
  if (!intact) {
    cell.id = 'empty';
    delete cell.brick;
  }
}

export function damageSteelTile(cell: TileCell): boolean {
  if (cell.id !== 'steel') return false;
  cell.steelHits = (cell.steelHits ?? 0) + 1;
  if (cell.steelHits >= 2) {
    cell.id = 'empty';
    delete cell.steelHits;
    return true;
  }
  return false;
}

export function restoreBrickQuadrants(cell: TileCell): void {
  if (cell.id === 'brick' && cell.brick) {
    cell.brick = { tl: true, tr: true, bl: true, br: true };
  }
}
