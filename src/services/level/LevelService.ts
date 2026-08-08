import type { EnemyType, LevelData, TileId } from '@/models';
import { TileId as Tile } from '@/enums';
import {
  ARMOR_BONUS_PER_LOOP,
  ENEMIES_PER_STAGE,
  ENEMY_SPAWN_POINT_COUNT,
  GRID_COLS,
  GRID_ROWS,
  LEVEL_LAYOUT_SEED_PRIME,
  STAGE_COUNT,
} from '@/utils/constants';
import { buildEnemyRoster } from '@/services/level/enemyRoster';
import { Rng } from '@/utils/rng';
import stageRosterData from '../../../.spec/data/stage-roster.json';

/** Left / center / right enemy spawns across the top edge. */
const DEFAULT_SPAWN_POINTS = [
  { col: 0, row: 0 },
  { col: 17, row: 0 },
  { col: 34, row: 0 },
] as const;

/** Eagle top-left; occupies a 2×2 block on the bottom edge (rows 18–19). */
const DEFAULT_BASE_POSITION = { col: 16, row: 18 } as const;

/** Outside base walls (walls occupy cols 15 and 18 on the bottom row). */
const DEFAULT_PLAYER_SPAWNS = [
  { col: 13, row: 19, player: 1 as const },
  { col: 20, row: 19, player: 2 as const },
];

type RosterCounts = { basic: number; fast: number; power: number; armor: number };

const STAGE_ROSTERS: RosterCounts[] = stageRosterData.stages.map(({ basic, fast, power, armor }) => ({
  basic,
  fast,
  power,
  armor,
}));

function emptyGrid(): TileId[][] {
  return Array.from({ length: GRID_ROWS }, () =>
    Array.from({ length: GRID_COLS }, () => Tile.empty as TileId),
  );
}

function addBaseWalls(grid: TileId[][]): void {
  const { col: bc, row: br } = DEFAULT_BASE_POSITION;
  for (let r = br - 1; r <= br + 1; r++) {
    for (let c = bc - 1; c <= bc + 2; c++) {
      if (r === br && c >= bc && c <= bc + 1) continue;
      if (r === br + 1 && c >= bc && c <= bc + 1) continue;
      if (r < 0 || r >= GRID_ROWS || c < 0 || c >= GRID_COLS) continue;
      grid[r]![c] = Tile.brick;
    }
  }
}

function clearPlayerSpawnTiles(grid: TileId[][]): void {
  for (const spawn of DEFAULT_PLAYER_SPAWNS) {
    grid[spawn.row]![spawn.col] = Tile.empty;
  }
}

/** Keep enemy spawn cells and the tile below them free so tanks can leave. */
function clearEnemySpawnApproaches(grid: TileId[][]): void {
  for (const spawn of DEFAULT_SPAWN_POINTS) {
    grid[spawn.row]![spawn.col] = Tile.empty;
    if (spawn.row + 1 < GRID_ROWS) {
      grid[spawn.row + 1]![spawn.col] = Tile.empty;
    }
  }
}

/** Columns kept clear so tanks can leave the three top spawns and reach the base. */
function isOpenLane(col: number): boolean {
  return col === 0 || col === 17 || col === 34;
}

function isProtectedCell(col: number, row: number): boolean {
  if (isOpenLane(col)) return true;
  // Fortress pocket + approach above the eagle
  if (row >= 17 && col >= 15 && col <= 18) return true;
  return false;
}

function fillRect(
  grid: TileId[][],
  col: number,
  row: number,
  w: number,
  h: number,
  tile: TileId,
): void {
  for (let r = row; r < Math.min(row + h, GRID_ROWS); r++) {
    for (let c = col; c < Math.min(col + w, GRID_COLS); c++) {
      if (isProtectedCell(c, r)) continue;
      grid[r]![c] = tile;
    }
  }
}

/**
 * Corridor map for the 35×20 field: open vertical lanes under spawns,
 * brick/steel bands with gaps, sparse water/ice/bush.
 */
function generateStageLayout(stageId: number): TileId[][] {
  const grid = emptyGrid();
  const seed = stageId * LEVEL_LAYOUT_SEED_PRIME;
  const fortressTop = 17;

  // Horizontal brick bands with staggered gaps
  const bandRows = [2, 4, 6, 8, 10, 12, 14];
  for (let i = 0; i < bandRows.length; i++) {
    const row = bandRows[i]!;
    const gapShift = (seed + i * 3) % 3;
    for (let col = 1; col < GRID_COLS - 1; col++) {
      if (isProtectedCell(col, row)) continue;
      if ((col + gapShift) % 3 === 0) continue;
      grid[row]![col] = Tile.brick;
    }
    if ((seed + i) % 2 === 0 && row + 1 < fortressTop) {
      for (let col = 1; col < GRID_COLS - 1; col++) {
        if (isProtectedCell(col, row + 1)) continue;
        if ((col + gapShift + 1) % 3 === 0) continue;
        if (grid[row]![col] === Tile.brick) grid[row + 1]![col] = Tile.brick;
      }
    }
  }

  // Steel pillars between lanes
  const steelCols = [2, 4, 6, 8, 10, 12, 14, 19, 21, 23, 25, 27, 29, 31];
  for (let i = 0; i < steelCols.length; i++) {
    const col = steelCols[i]!;
    const row = 3 + ((seed + i * 5) % 10);
    if (row < fortressTop && !isProtectedCell(col, row)) grid[row]![col] = Tile.steel;
    if (row + 1 < fortressTop && !isProtectedCell(col, row + 1)) grid[row + 1]![col] = Tile.steel;
  }

  // Water / ice pockets away from lanes
  const hazardCount = 3 + (stageId % 4);
  for (let i = 0; i < hazardCount; i++) {
    const col = 1 + ((seed + i * 11) % 16) * 2;
    const row = 3 + ((seed + i * 7) % 11);
    const tile: TileId = i % 2 === 0 ? Tile.water : Tile.ice;
    fillRect(grid, col, row, 2, 1, tile);
  }

  // Bushes for concealment
  for (let i = 0; i < 3 + (stageId % 5); i++) {
    const col = 1 + ((seed + i * 31) % (GRID_COLS - 2));
    const row = 2 + ((seed + i * 37) % (fortressTop - 3));
    if (!isProtectedCell(col, row)) grid[row]![col] = Tile.bush;
  }

  addBaseWalls(grid);
  clearPlayerSpawnTiles(grid);
  clearEnemySpawnApproaches(grid);
  return grid;
}

export function createLevel(stageId: number, loopCount = 0): LevelData {
  const idx = ((stageId - 1) % STAGE_COUNT);
  let rosterCounts = { ...STAGE_ROSTERS[idx]! };
  if (loopCount > 0) {
    rosterCounts.armor = Math.min(
      ENEMIES_PER_STAGE,
      rosterCounts.armor + loopCount * ARMOR_BONUS_PER_LOOP,
    );
    rosterCounts.basic = Math.max(0, rosterCounts.basic - loopCount);
  }

  const rng = new Rng(stageId * LEVEL_LAYOUT_SEED_PRIME + loopCount);
  const enemyRoster = buildEnemyRoster(rosterCounts, () => rng.next());

  return {
    id: stageId,
    name: `Stage ${stageId}`,
    grid: generateStageLayout(stageId),
    enemyRoster,
    spawnPoints: DEFAULT_SPAWN_POINTS.map((p) => ({ ...p })),
    basePosition: { ...DEFAULT_BASE_POSITION },
    playerSpawns: DEFAULT_PLAYER_SPAWNS.map((p) => ({ ...p })),
  };
}

export function loadLevel(stageId: number, loopCount = 0): LevelData {
  return createLevel(stageId, loopCount);
}

export function validateLevel(level: LevelData): string[] {
  const errors: string[] = [];
  if (level.grid.length !== GRID_ROWS) errors.push(`Grid must have ${GRID_ROWS} rows`);
  else if (level.grid.some((row) => row.length !== GRID_COLS)) {
    errors.push(`Grid must have ${GRID_COLS} columns`);
  }
  if (level.enemyRoster.length !== ENEMIES_PER_STAGE) {
    errors.push(`Enemy roster must have ${ENEMIES_PER_STAGE} entries`);
  }
  if (level.spawnPoints.length !== ENEMY_SPAWN_POINT_COUNT) {
    errors.push(`Must have ${ENEMY_SPAWN_POINT_COUNT} spawn points`);
  }
  return errors;
}

export function createBlankLevel(): LevelData {
  const grid = emptyGrid();
  addBaseWalls(grid);
  clearPlayerSpawnTiles(grid);
  clearEnemySpawnApproaches(grid);
  return {
    id: 0,
    name: 'Custom Level',
    custom: true,
    grid,
    enemyRoster: buildEnemyRoster(
      { basic: ENEMIES_PER_STAGE, fast: 0, power: 0, armor: 0 },
      () => 0.5,
    ),
    spawnPoints: DEFAULT_SPAWN_POINTS.map((p) => ({ ...p })),
    basePosition: { ...DEFAULT_BASE_POSITION },
    playerSpawns: [{ col: 13, row: 19, player: 1 as const }],
  };
}

export function parseCustomLevel(json: string): LevelData {
  const data = JSON.parse(json) as LevelData;
  const errors = validateLevel(data);
  if (errors.length) throw new Error(errors.join(', '));
  return data;
}

export type { EnemyType };
