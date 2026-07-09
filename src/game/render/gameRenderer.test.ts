import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createGameWorld } from '@/game/core/gameWorld';
import { createLevel } from '@/game/levels/levelLoader';
import { GameRenderer } from '@/game/render/gameRenderer';
import { FIELD_SIZE } from '@/game/core/constants';

function mockCanvasContext(): CanvasRenderingContext2D {
  return {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    strokeRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    globalAlpha: 1,
  } as unknown as CanvasRenderingContext2D;
}

describe('GameRenderer', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mounts canvas and completes init without aborting', async () => {
    const renderer = new GameRenderer();
    await renderer.init(container);

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas?.width).toBe(FIELD_SIZE);
    expect(canvas?.height).toBe(FIELD_SIZE);
    expect(renderer.getCanvas()).toBe(canvas);
  });

  it('renders without throwing when world is provided', async () => {
    const renderer = new GameRenderer();
    const world = createGameWorld(createLevel(1));
    await renderer.init(container);

    expect(() => renderer.render(world)).not.toThrow();
  });
});
