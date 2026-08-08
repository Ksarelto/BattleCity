import type { Direction, GameWorld, Position, TankEntity, TileCell } from '@/models';
import { TileId } from '@/enums';
import {
  BASE_SIZE_TILES,
  DIRECTION_VECTORS,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  GRID_COLS,
  GRID_ROWS,
  TANK_HITBOX,
  TANK_OFFSET,
  TILE_SIZE,
  tileBlocksTank,
} from '@/utils/constants';
import { brickIntact } from '@/utils/brick';

export function posToTile(pos: Position): { col: number; row: number } {
  return {
    col: Math.floor((pos.x + TANK_OFFSET + TANK_HITBOX / 2) / TILE_SIZE),
    row: Math.floor((pos.y + TANK_OFFSET + TANK_HITBOX / 2) / TILE_SIZE),
  };
}

export function tileAt(world: GameWorld, col: number, row: number): TileCell | null {
  if (col < 0 || row < 0 || col >= GRID_COLS || row >= GRID_ROWS) {
    return { id: TileId.steel };
  }
  return world.grid[row]![col]!;
}

export function cellBlocksTank(cell: TileCell): boolean {
  if (cell.id === TileId.brick && cell.brick) {
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

  const allTanks = [...world.players, ...world.enemies].filter(
    (t) => t.id !== ignoreId && t.id !== tank.id,
  );
  for (const other of allTanks) {
    if (other.spawnAnimRemaining > 0 && other.id !== tank.id) continue;
    if (rectsOverlap(bounds, getTankBounds(other.position))) return false;
  }

  return true;
}

const MAX_TANK_X = FIELD_WIDTH - TILE_SIZE;
const MAX_TANK_Y = FIELD_HEIGHT - TILE_SIZE;

function clampTankPos(pos: Position): Position {
  return {
    x: Math.max(0, Math.min(MAX_TANK_X, pos.x)),
    y: Math.max(0, Math.min(MAX_TANK_Y, pos.y)),
  };
}

/** Snap the axis perpendicular to movement onto the tile grid (NES-style corridor entry). */
function snapPerpendicular(pos: Position, direction: Direction): Position {
  if (direction === 'up' || direction === 'down') {
    return { x: Math.round(pos.x / TILE_SIZE) * TILE_SIZE, y: pos.y };
  }
  return { x: pos.x, y: Math.round(pos.y / TILE_SIZE) * TILE_SIZE };
}

function stepPosition(pos: Position, direction: Direction, speed: number): Position {
  const { dx, dy } = DIRECTION_VECTORS[direction];
  return clampTankPos({
    x: pos.x + dx * speed,
    y: pos.y + dy * speed,
  });
}

export function canTankStep(
  world: GameWorld,
  tank: TankEntity,
  direction: Direction,
  speed: number,
): boolean {
  const newPos = stepPosition(tank.position, direction, speed);
  if (canTankMoveTo(world, tank, newPos)) return true;

  // If blocked only because we're between tile columns/rows, try after grid snap
  const snapped = snapPerpendicular(tank.position, direction);
  if (snapped.x === tank.position.x && snapped.y === tank.position.y) return false;
  return canTankMoveTo(world, tank, stepPosition(snapped, direction, speed));
}

export function tryMoveTank(
  world: GameWorld,
  tank: TankEntity,
  direction: Direction,
  speed: number,
): boolean {
  const direct = stepPosition(tank.position, direction, speed);
  if (canTankMoveTo(world, tank, direct)) {
    tank.position = direct;
    tank.direction = direction;
    return true;
  }

  // Align into 1-tile corridors (e.g. right edge lane) then step
  const snapped = snapPerpendicular(tank.position, direction);
  if (snapped.x !== tank.position.x || snapped.y !== tank.position.y) {
    const aligned = clampTankPos(snapped);
    if (canTankMoveTo(world, tank, aligned)) {
      const after = stepPosition(aligned, direction, speed);
      if (canTankMoveTo(world, tank, after)) {
        tank.position = after;
        tank.direction = direction;
        return true;
      }
      // At least finish the snap so the next frame can move
      tank.position = aligned;
      tank.direction = direction;
      return true;
    }
  }

  return false;
}

export function isOnIce(world: GameWorld, tank: TankEntity): boolean {
  const center = posToTile(tank.position);
  return tileAt(world, center.col, center.row)?.id === TileId.ice;
}

export function getBaseBounds(world: GameWorld) {
  const { col, row } = world.basePosition;
  return {
    left: col * TILE_SIZE,
    top: row * TILE_SIZE,
    right: (col + BASE_SIZE_TILES) * TILE_SIZE,
    bottom: (row + BASE_SIZE_TILES) * TILE_SIZE,
  };
}

export { directionToward, randomDirection } from '@/utils/direction';
