import type { GameWorld } from '@/models';
import { GamePhase, Team, TileId } from '@/enums';
import {
  BASE_SIZE_TILES,
  BLINK_FAST_DIVISOR,
  BLINK_SLOW_DIVISOR,
  BULLET_DRAW_SIZE,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  GRID_COLS,
  GRID_ROWS,
  LARGE_EXPLOSION_FRAMES,
  SMALL_EXPLOSION_FRAMES,
  TILE_SIZE,
} from '@/utils/constants';
import { spriteAtlas, tankVariantFor } from '@/services/render/spriteAtlas';

export class RenderService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private host: HTMLElement | null = null;

  async init(container: HTMLElement): Promise<void> {
    this.destroy();
    await spriteAtlas.load();

    const canvas = document.createElement('canvas');
    canvas.width = FIELD_WIDTH;
    canvas.height = FIELD_HEIGHT;
    canvas.style.display = 'block';
    canvas.style.imageRendering = 'pixelated';

    container.replaceChildren(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is not available');
    }

    ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.ctx = ctx;
    this.host = container;
  }

  render(world: GameWorld): void {
    if (!this.canvas || !this.ctx) return;

    if (this.host && this.canvas.parentElement !== this.host) {
      this.host.replaceChildren(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;
    }

    const ctx = this.ctx;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const cell = world.grid[row]![col]!;
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        if (cell.id === TileId.brick && cell.brick) {
          const q = cell.brick;
          if (q.tl) spriteAtlas.drawBrickQuadrant(ctx, x, y, 0, 0, TILE_SIZE);
          if (q.tr) spriteAtlas.drawBrickQuadrant(ctx, x, y, 1, 0, TILE_SIZE);
          if (q.bl) spriteAtlas.drawBrickQuadrant(ctx, x, y, 0, 1, TILE_SIZE);
          if (q.br) spriteAtlas.drawBrickQuadrant(ctx, x, y, 1, 1, TILE_SIZE);
        } else if (
          cell.id === TileId.steel ||
          cell.id === TileId.water ||
          cell.id === TileId.ice
        ) {
          spriteAtlas.drawTile(ctx, cell.id, x, y, TILE_SIZE);
        }
      }
    }

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (world.overlayGrid[row]![col] === TileId.bush) {
          spriteAtlas.drawTile(ctx, TileId.bush, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE);
        }
      }
    }

    if (world.baseIntact) {
      const { col, row } = world.basePosition;
      spriteAtlas.drawBase(ctx, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE * BASE_SIZE_TILES, true);
    } else if (world.phase === GamePhase.gameOver) {
      const { col, row } = world.basePosition;
      spriteAtlas.drawBase(ctx, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE * BASE_SIZE_TILES, false);
    }

    for (const player of world.players) {
      if (player.spawnAnimRemaining > 0 && Math.floor(world.tick / BLINK_SLOW_DIVISOR) % 2 === 0) continue;
      const variant = tankVariantFor(player.team);
      spriteAtlas.drawTank(
        ctx,
        variant,
        player.direction,
        Math.floor(world.tick / BLINK_SLOW_DIVISOR) % 2 as 0 | 1,
        player.position.x,
        player.position.y,
        TILE_SIZE,
        world.tick,
      );
      if (player.invincibleUntil > world.tick && Math.floor(world.tick / BLINK_FAST_DIVISOR) % 2 === 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.position.x, player.position.y, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const enemy of world.enemies) {
      if (enemy.spawnAnimRemaining > 0 && Math.floor(world.tick / BLINK_SLOW_DIVISOR) % 2 === 0) continue;
      spriteAtlas.drawTank(
        ctx,
        tankVariantFor(Team.enemy, enemy.enemyType),
        enemy.direction,
        Math.floor(world.tick / BLINK_SLOW_DIVISOR) % 2 as 0 | 1,
        enemy.position.x,
        enemy.position.y,
        TILE_SIZE,
        world.tick,
      );
      if (enemy.isFlashing && Math.floor(world.tick / BLINK_FAST_DIVISOR) % 2 === 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.position.x - 2, enemy.position.y - 2, TILE_SIZE + 4, TILE_SIZE + 4);
      }
    }

    for (const bullet of world.bullets) {
      spriteAtlas.drawBullet(ctx, bullet.position.x, bullet.position.y, BULLET_DRAW_SIZE);
    }

    for (const pu of world.powerUps) {
      if (!pu.active) continue;
      if (Math.floor(world.tick / BLINK_SLOW_DIVISOR) % 2 === 0) continue;
      spriteAtlas.drawPowerUp(ctx, pu.type, pu.position.x, pu.position.y, TILE_SIZE);
    }

    for (const exp of world.explosions) {
      const total = exp.large ? LARGE_EXPLOSION_FRAMES : SMALL_EXPLOSION_FRAMES;
      const progress = 1 - exp.remaining / total;
      const alpha = exp.remaining / total;
      spriteAtlas.drawExplosion(
        ctx,
        exp.position.x - (exp.large ? 8 : 0),
        exp.position.y - (exp.large ? 8 : 0),
        exp.large ? TILE_SIZE * 2 : TILE_SIZE,
        exp.large,
        progress,
        alpha,
      );
    }

    if (world.phase === GamePhase.countdown) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText('GET READY', FIELD_WIDTH / 2 - 40, FIELD_HEIGHT / 2);
    }

    if (world.phase === GamePhase.paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText('PAUSED', FIELD_WIDTH / 2 - 30, FIELD_HEIGHT / 2);
    }
  }

  destroy(): void {
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
    this.host = null;
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }
}
