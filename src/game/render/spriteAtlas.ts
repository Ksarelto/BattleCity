import type { Direction, PowerUpType } from '@/types/game';

export interface SpriteRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DrawSpriteOptions {
  rotation?: number;
  alpha?: number;
  tint?: string;
}

const SHEET_PATHS = {
  game: '/sprites/game-sprites.webp',
  map: '/sprites/bush.webp',
  brick: '/sprites/brick.webp',
  steel: '/sprites/steel.webp',
  water: '/sprites/water.webp',
  explosionSmall: '/sprites/explosion-small.webp',
  explosionLarge: '/sprites/explosion-large.webp',
} as const;

type SheetKey = keyof typeof SHEET_PATHS;

const TANK_FRAME_W = 40;
const TANK_FRAME_H = 40;

const GAME_SPRITES = {
  player1: [{ x: 24, y: 0 }, { x: 64, y: 0 }] as SpriteRect[],
  player2: [{ x: 24, y: 0 }, { x: 64, y: 0 }] as SpriteRect[],
  enemyBasic: [{ x: 24, y: 120 }, { x: 64, y: 120 }] as SpriteRect[],
  enemyFast: [{ x: 24, y: 80 }, { x: 64, y: 80 }] as SpriteRect[],
  enemyPower: [{ x: 24, y: 120 }, { x: 64, y: 120 }] as SpriteRect[],
  enemyArmor: [{ x: 24, y: 160 }, { x: 64, y: 160 }] as SpriteRect[],
  eagle: { x: 24, y: 40, w: 40, h: 40 },
  eagleDestroyed: { x: 64, y: 40, w: 40, h: 40 },
  bush: { x: 0, y: 100, w: 20, h: 20 },
  bullet: { x: 808, y: 252, w: 8, h: 8 },
} as const;

const POWER_UP_RECTS: Record<PowerUpType, SpriteRect> = {
  grenade: { x: 544, y: 256, w: 32, h: 32 },
  helmet: { x: 576, y: 256, w: 32, h: 32 },
  timer: { x: 608, y: 256, w: 32, h: 32 },
  shovel: { x: 640, y: 256, w: 32, h: 32 },
  star: { x: 672, y: 256, w: 32, h: 32 },
  tank: { x: 704, y: 256, w: 32, h: 32 },
};

const DIRECTION_ROTATION: Record<Direction, number> = {
  up: Math.PI,
  down: 0,
  left: -Math.PI / 2,
  right: Math.PI / 2,
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load sprite: ${src}`));
    img.src = src;
  });
}

export class SpriteAtlas {
  private images = new Map<SheetKey, HTMLImageElement>();
  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = Promise.all(
        (Object.entries(SHEET_PATHS) as Array<[SheetKey, string]>).map(async ([key, path]) => {
          this.images.set(key, await loadImage(path));
        }),
      ).then(() => undefined);
    }
    return this.loadPromise;
  }

  isReady(): boolean {
    return this.images.size === Object.keys(SHEET_PATHS).length;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    sheet: SheetKey,
    rect: SpriteRect,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    options: DrawSpriteOptions = {},
  ): void {
    const image = this.images.get(sheet);
    if (!image) return;

    const { rotation = 0, alpha = 1, tint } = options;
    ctx.save();
    ctx.globalAlpha = alpha;

    if (rotation !== 0) {
      ctx.translate(dx + dw / 2, dy + dh / 2);
      ctx.rotate(rotation);
      if (tint) {
        ctx.filter = tint;
      }
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, -dw / 2, -dh / 2, dw, dh);
    } else {
      if (tint) {
        ctx.filter = tint;
      }
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, dw, dh);
    }

    ctx.restore();
  }

  drawTile(
    ctx: CanvasRenderingContext2D,
    tile: 'brick' | 'steel' | 'water' | 'bush' | 'ice',
    dx: number,
    dy: number,
    size: number,
  ): void {
    switch (tile) {
      case 'brick':
        this.draw(ctx, 'brick', { x: 0, y: 0, w: 20, h: 20 }, dx, dy, size, size);
        break;
      case 'steel':
        this.draw(ctx, 'steel', { x: 0, y: 0, w: 20, h: 20 }, dx, dy, size, size);
        break;
      case 'water':
        this.draw(ctx, 'water', { x: 0, y: 0, w: 20, h: 20 }, dx, dy, size, size);
        break;
      case 'bush':
        this.draw(ctx, 'game', GAME_SPRITES.bush, dx, dy, size, size);
        break;
      case 'ice':
        this.draw(ctx, 'water', { x: 0, y: 0, w: 20, h: 20 }, dx, dy, size, size, {
          tint: 'brightness(1.35) saturate(0.35)',
        });
        break;
    }
  }

  drawBrickQuadrant(
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
    qx: 0 | 1,
    qy: 0 | 1,
    size: number,
  ): void {
    const half = size / 2;
    const srcHalf = 10;
    this.draw(
      ctx,
      'brick',
      { x: qx * srcHalf, y: qy * srcHalf, w: srcHalf, h: srcHalf },
      dx + qx * half,
      dy + qy * half,
      half,
      half,
    );
  }

  drawTank(
    ctx: CanvasRenderingContext2D,
    variant: keyof typeof GAME_SPRITES,
    direction: Direction,
    frame: 0 | 1,
    dx: number,
    dy: number,
    size: number,
    _tick: number,
  ): void {
    const frames = GAME_SPRITES[variant];
    if (!Array.isArray(frames)) return;

    const rect = { ...frames[frame]!, w: TANK_FRAME_W, h: TANK_FRAME_H };
    const rotation = DIRECTION_ROTATION[direction];

    let tint: string | undefined;
    if (variant === 'player2') {
      tint = 'hue-rotate(85deg) saturate(1.4)';
    } else if (variant === 'enemyPower') {
      tint = 'hue-rotate(-35deg) saturate(1.5)';
    }

    this.draw(ctx, 'game', rect, dx, dy, size, size, { rotation, tint });
  }

  drawBase(ctx: CanvasRenderingContext2D, dx: number, dy: number, size: number, intact: boolean): void {
    const rect = intact ? GAME_SPRITES.eagle : GAME_SPRITES.eagleDestroyed;
    this.draw(ctx, 'game', rect, dx, dy, size, size);
  }

  drawBullet(ctx: CanvasRenderingContext2D, dx: number, dy: number, size: number): void {
    this.draw(ctx, 'map', GAME_SPRITES.bullet, dx, dy, size, size);
  }

  drawPowerUp(ctx: CanvasRenderingContext2D, type: PowerUpType, dx: number, dy: number, size: number): void {
    const rect = POWER_UP_RECTS[type];
    this.draw(ctx, 'map', rect, dx, dy, size, size);
  }

  drawExplosion(
    ctx: CanvasRenderingContext2D,
    dx: number,
    dy: number,
    size: number,
    large: boolean,
    progress: number,
    alpha = 1,
  ): void {
    const sheet = large ? 'explosionLarge' : 'explosionSmall';
    const image = this.images.get(sheet);
    if (!image) return;

    const frameCount = large ? 2 : 3;
    const frameWidth = Math.floor(image.width / frameCount);
    const frameHeight = image.height;
    const frame = Math.min(frameCount - 1, Math.floor(progress * frameCount));

    this.draw(
      ctx,
      sheet,
      { x: frame * frameWidth, y: 0, w: frameWidth, h: frameHeight },
      dx,
      dy,
      size,
      size,
      { alpha },
    );
  }
}

export const spriteAtlas = new SpriteAtlas();

export function tankVariantFor(
  team: 'player1' | 'player2' | 'enemy',
  enemyType?: 'basic' | 'fast' | 'power' | 'armor',
): keyof typeof GAME_SPRITES {
  if (team === 'player1') return 'player1';
  if (team === 'player2') return 'player2';
  switch (enemyType) {
    case 'fast':
      return 'enemyFast';
    case 'power':
      return 'enemyPower';
    case 'armor':
      return 'enemyArmor';
    default:
      return 'enemyBasic';
  }
}
