import type { Direction, GameWorld, Position, TankEntity, TileCell } from '@/types/game';
import {
  DIRECTION_VECTORS,
  GRID_SIZE,
  TANK_HITBOX,
  TANK_OFFSET,
  TILE_SIZE,
  tileBlocksTank,
} from '@/game/core/constants';
import { brickIntact } from '@/game/core/gameWorld';

export function posToTile(pos: Position): { col: number; row: number } {
  return {
    col: Math.floor((pos.x + TANK_OFFSET + TANK_HITBOX / 2) / TILE_SIZE),
    row: Math.floor((pos.y + TANK_OFFSET + TANK_HITBOX / 2) / TILE_SIZE),
  };
}

export function tileAt(world: GameWorld, col: number, row: number): TileCell | null {
  if (col < 0 || row < 0 || col >= GRID_SIZE || row >= GRID_SIZE) {
    return { id: 'steel' };
  }
  return world.grid[row]![col]!;
}

export function cellBlocksTank(cell: TileCell): boolean {
  if (cell.id === 'brick' && cell.brick) {
    return brickIntact(cell.brick);
  }
  return tileBlocksTank(cell.id);
}

export function getTankBounds(pos: Position) {
  return {
    left: pos.x + TANK_OFFSET,
    top: pos.y + TANK_OFFSET,
    right: pos.x + TANK_OFFSET + TANK_HITBOX,
    bottom: pos.y + TANK_OFFSET + TANK_HITBOX,
  };
}

export function rectsOverlap(
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function canTankMoveTo(
  world: GameWorld,
  tank: TankEntity,
  newPos: Position,
  ignoreId?: string,
): boolean {
  const bounds = getTankBounds(newPos);
  const corners = [
    { x: bounds.left, y: bounds.top },
    { x: bounds.right - 1, y: bounds.top },
    { x: bounds.left, y: bounds.bottom - 1 },
    { x: bounds.right - 1, y: bounds.bottom - 1 },
  ];

  for (const c of corners) {
    const col = Math.floor(c.x / TILE_SIZE);
    const row = Math.floor(c.y / TILE_SIZE);
    const cell = tileAt(world, col, row);
    if (cell && cellBlocksTank(cell)) return false;
  }

  const allTanks = [...world.players, ...world.enemies].filter((t) => t.id !== ignoreId);
  for (const other of allTanks) {
    if (other.spawnAnimRemaining > 0 && other.id !== tank.id) continue;
    if (rectsOverlap(bounds, getTankBounds(other.position))) return false;
  }

  return true;
}

export function tryMoveTank(
  world: GameWorld,
  tank: TankEntity,
  direction: Direction,
  speed: number,
): boolean {
  const { dx, dy } = DIRECTION_VECTORS[direction];
  const newPos = {
    x: tank.position.x + dx * speed,
    y: tank.position.y + dy * speed,
  };

  if (newPos.x < 0 || newPos.y < 0 || newPos.x > GRID_SIZE * TILE_SIZE - TILE_SIZE || newPos.y > GRID_SIZE * TILE_SIZE - TILE_SIZE) {
    return false;
  }

  if (canTankMoveTo(world, tank, newPos)) {
    tank.position = newPos;
    tank.direction = direction;
    return true;
  }
  return false;
}

export function isOnIce(world: GameWorld, tank: TankEntity): boolean {
  const center = posToTile(tank.position);
  return tileAt(world, center.col, center.row)?.id === 'ice';
}

export function getBaseBounds(world: GameWorld) {
  const { col, row } = world.basePosition;
  return {
    left: col * TILE_SIZE,
    top: row * TILE_SIZE,
    right: (col + 2) * TILE_SIZE,
    bottom: (row + 2) * TILE_SIZE,
  };
}

export function isAlignedWithBase(tank: TankEntity, world: GameWorld): boolean {
  const base = getBaseBounds(world);
  const center = {
    x: tank.position.x + TILE_SIZE / 2,
    y: tank.position.y + TILE_SIZE / 2,
  };
  const tolerance = 4;
  if (tank.direction === 'down') {
    return Math.abs(center.x - (base.left + base.right) / 2) < tolerance;
  }
  if (tank.direction === 'up') {
    return Math.abs(center.x - (base.left + base.right) / 2) < tolerance;
  }
  if (tank.direction === 'left') {
    return Math.abs(center.y - (base.top + base.bottom) / 2) < tolerance;
  }
  return Math.abs(center.y - (base.top + base.bottom) / 2) < tolerance;
}

export function directionToward(from: Position, to: Position): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

export function randomDirection(rng: () => number, avoid?: Direction): Direction {
  const dirs: Direction[] = ['up', 'down', 'left', 'right'];
  const filtered = avoid ? dirs.filter((d) => d !== avoid) : dirs;
  return filtered[Math.floor(rng() * filtered.length)]!;
}
