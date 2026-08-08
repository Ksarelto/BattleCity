import type { TileId } from '@/enums/tile';
import type { BrickQuadrants } from '@/models/vec';

export interface TileCell {
  id: TileId;
  brick?: BrickQuadrants;
  steelHits?: number;
}
