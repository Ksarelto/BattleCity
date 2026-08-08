export const TileId = {
  empty: 'empty',
  brick: 'brick',
  steel: 'steel',
  water: 'water',
  ice: 'ice',
  bush: 'bush',
} as const;

export type TileId = (typeof TileId)[keyof typeof TileId];
