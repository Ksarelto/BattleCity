import { describe, it, expect } from 'vitest';
import { handleFriendlyFire } from '@/services/bullet/bulletHelpers';
import { createGameWorld } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';

describe('handleFriendlyFire', () => {
  it('stuns player 2 when hit by player 1 bullet', () => {
    const world = createGameWorld(createLevel(1), { twoPlayer: true });
    world.tick = 100;
    const p1 = world.players[0]!;
    const p2 = world.players[1]!;
    handleFriendlyFire(world, p1.id, p2);
    expect(p2.stunnedUntil).toBe(220);
  });

  it('does not stun same team non-players', () => {
    const world = createGameWorld(createLevel(1));
    world.tick = 50;
    const p1 = world.players[0]!;
    handleFriendlyFire(world, p1.id, p1);
    expect(p1.stunnedUntil).toBe(0);
  });

  it('stuns player 1 when hit by player 2', () => {
    const world = createGameWorld(createLevel(1), { twoPlayer: true });
    world.tick = 0;
    const p1 = world.players[0]!;
    const p2 = world.players[1]!;
    handleFriendlyFire(world, p2.id, p1);
    expect(p1.stunnedUntil).toBe(120);
  });
});
