import type { Direction, PowerUpType } from '@/models';

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

/** Player frames live on game-sprites; enemies/power-ups/bush on bush.webp atlas. */
const GAME_SPRITES = {
  player1: [
    { x: 26, y: 1, w: 36, h: 36 },
    { x: 66, y: 1, w: 36, h: 36 },
  ] as SpriteRect[],
  player2: [
    { x: 26, y: 1, w: 36, h: 36 },
    { x: 66, y: 1, w: 36, h: 36 },
  ] as SpriteRect[],
  eagle: { x: 24, y: 40, w: 40, h: 40 },
  eagleDestroyed: { x: 64, y: 40, w: 40, h: 40 },
  bullet: { x: 808, y: 252, w: 8, h: 8 },
} as const;

/** Terrain bush tile from bush.webp (green foliage block). */
const BUSH_RECT: SpriteRect = { x: 688, y: 84, w: 32, h: 32 };

/**
 * Gray enemy tanks in bush.webp — per-type content bounds (rows are uneven;
 * a flat 40×40 grid either pads empty top or clips the next tank).
 */
const ENEMY_SPRITES = {
  enemyBasic: [
    { x: 320, y: 8, w: 40, h: 32 },
    { x: 360, y: 8, w: 40, h: 32 },
  ],
  enemyFast: [
    { x: 320, y: 48, w: 40, h: 34 },
    { x: 360, y: 48, w: 40, h: 34 },
  ],
  enemyPower: [
    { x: 320, y: 84, w: 40, h: 36 },
    { x: 360, y: 84, w: 40, h: 36 },
  ],
  enemyArmor: [
    { x: 320, y: 120, w: 40, h: 38 },
    { x: 360, y: 120, w: 40, h: 38 },
  ],
} as const;

type TankVariant = keyof typeof GAME_SPRITES | keyof typeof ENEMY_SPRITES;

/** Power-up icons in bush.webp — solid 40×40 framed tiles at y=279. */
const POWER_UP_RECTS: Record<PowerUpType, SpriteRect> = {
  helmet: { x: 642, y: 279, w: 40, h: 40 },
  timer: { x: 682, y: 279, w: 40, h: 40 },
  shovel: { x: 722, y: 279, w: 40, h: 40 },
  star: { x: 762, y: 279, w: 40, h: 40 },
  grenade: { x: 802, y: 279, w: 40, h: 40 },
  tank: { x: 842, y: 279, w: 40, h: 40 },
};

/** Player frames on game-sprites face down. */
const PLAYER_DIRECTION_ROTATION: Record<Direction, number> = {
  up: Math.PI,
  down: 0,
  left: Math.PI / 2,
  right: -Math.PI / 2,
};

/** Enemy frames on bush.webp face up. */
const ENEMY_DIRECTION_ROTATION: Record<Direction, number> = {
  up: 0,
  down: Math.PI,
  left: -Math.PI / 2,
  right: Math.PI / 2,
};

function isEnemyVariant(variant: TankVariant): variant is keyof typeof ENEMY_SPRITES {
  return variant in ENEMY_SPRITES;
}

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
        this.draw(ctx, 'map', BUSH_RECT, dx, dy, size, size);
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
    variant: TankVariant,
    direction: Direction,
    frame: 0 | 1,
    dx: number,
    dy: number,
    size: number,
    _tick: number,
  ): void {
    const fit = (rect: SpriteRect): { x: number; y: number; w: number; h: number } => {
      const scale = Math.min(size / rect.w, size / rect.h);
      const w = rect.w * scale;
      const h = rect.h * scale;
      return { x: dx + (size - w) / 2, y: dy + (size - h) / 2, w, h };
    };

    if (isEnemyVariant(variant)) {
      const rect = ENEMY_SPRITES[variant][frame]!;
      const dest = fit(rect);
      this.draw(ctx, 'map', rect, dest.x, dest.y, dest.w, dest.h, {
        rotation: ENEMY_DIRECTION_ROTATION[direction],
      });
      return;
    }

    const frames = GAME_SPRITES[variant];
    if (!Array.isArray(frames)) return;

    const rect = frames[frame]!;
    const dest = fit(rect);
    const tint = variant === 'player2' ? 'hue-rotate(85deg) saturate(1.4)' : undefined;
    this.draw(ctx, 'game', rect, dest.x, dest.y, dest.w, dest.h, {
      rotation: PLAYER_DIRECTION_ROTATION[direction],
      tint,
    });
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
): TankVariant {
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
