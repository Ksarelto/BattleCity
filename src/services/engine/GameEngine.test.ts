import { describe, expect, it, afterEach } from 'vitest';
import { GameEngine } from '@/services/engine/GameEngine';

describe('GameEngine.loadStage', () => {
  let engine: GameEngine | null = null;
  let container: HTMLDivElement;

  afterEach(() => {
    engine?.destroy();
    engine = null;
    container?.remove();
  });

  it('preserves score, lives, and extraLifeAwarded across stages', () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    engine = new GameEngine({
      container,
      stageNumber: 1,
      twoPlayer: false,
      difficulty: 'normal',
    });

    const world = engine.getWorld();
    world.score = 4200;
    world.lives = 2;
    world.extraLifeAwarded = true;

    engine.loadStage(2, {
      score: world.score,
      lives: world.lives,
      extraLifeAwarded: world.extraLifeAwarded,
    });

    const next = engine.getWorld();
    expect(next.stageNumber).toBe(2);
    expect(next.score).toBe(4200);
    expect(next.lives).toBe(2);
    expect(next.extraLifeAwarded).toBe(true);
  });

  it('advances stage without resetting score when carryOver omitted uses current world', () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    engine = new GameEngine({
      container,
      stageNumber: 1,
    });

    engine.getWorld().score = 1500;
    engine.getWorld().lives = 5;
    engine.loadStage(3);

    const next = engine.getWorld();
    expect(next.stageNumber).toBe(3);
    expect(next.score).toBe(1500);
    expect(next.lives).toBe(5);
  });
});
