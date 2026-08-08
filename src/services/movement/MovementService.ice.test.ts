import { describe, expect, it } from 'vitest';
import { Direction, TileId } from '@/enums';
import { updateMovementSystem } from '@/services/movement/MovementService';
import { emptyGridWorld } from '@/utils/test/fixtures';
import { createTileCell } from '@/services/engine/createWorld';
import { ICE_SLIDE_FRAMES, TILE_SIZE } from '@/utils/constants';

describe('MovementService ice slide', () => {
  it('starts sliding when player stops on ice', () => {
    const world = emptyGridWorld();
    const player = world.players[0]!;
    player.position = { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE };
    player.direction = Direction.right;
    player.speed = 2.5;
    world.grid[2]![2] = createTileCell(TileId.ice);
    world.grid[2]![3] = createTileCell(TileId.ice);
    world.grid[2]![4] = createTileCell(TileId.ice);

    const startX = player.position.x;
    updateMovementSystem(world, [{ playerId: player.id, direction: null }]);
    // First tick arms slide; subsequent ticks move
    for (let i = 0; i < ICE_SLIDE_FRAMES; i++) {
      updateMovementSystem(world, [{ playerId: player.id, direction: null }]);
    }
    expect(player.position.x).toBeGreaterThan(startX);
  });
});
