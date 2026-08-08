import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createGameWorld } from '@/services/engine/createWorld';
import { createLevel } from '@/services/level/LevelService';
import { RenderService } from '@/services/render/RenderService';
import { FIELD_HEIGHT, FIELD_WIDTH } from '@/utils/constants';

vi.mock('@/services/render/spriteAtlas', () => ({
  spriteAtlas: {
    load: vi.fn().mockResolvedValue(undefined),
    drawTile: vi.fn(),
    drawBrickQuadrant: vi.fn(),
    drawBase: vi.fn(),
    drawTank: vi.fn(),
    drawBullet: vi.fn(),
    drawPowerUp: vi.fn(),
    drawExplosion: vi.fn(),
  },
  tankVariantFor: vi.fn(() => 'player1'),
}));

function mockCanvasContext(): CanvasRenderingContext2D {
  return {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    strokeRect: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    globalAlpha: 1,
  } as unknown as CanvasRenderingContext2D;
}

describe('RenderService', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mounts canvas and completes init without aborting', async () => {
    const renderer = new RenderService();
    await renderer.init(container);

    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas?.width).toBe(FIELD_WIDTH);
    expect(canvas?.height).toBe(FIELD_HEIGHT);
    expect(renderer.getCanvas()).toBe(canvas);
  });

  it('renders without throwing when world is provided', async () => {
    const renderer = new RenderService();
    const world = createGameWorld(createLevel(1));
    await renderer.init(container);

    expect(() => renderer.render(world)).not.toThrow();
  });
});
