import type { TileId } from '@/models';
import { TileId as Tile } from '@/enums';
import { STORAGE_KEYS } from '@/utils/constants';

export const EDITOR_TILES: TileId[] = [
  Tile.empty,
  Tile.brick,
  Tile.steel,
  Tile.water,
  Tile.ice,
  Tile.bush,
];

export const EDITOR_STORAGE_KEY = STORAGE_KEYS.customLevels;
