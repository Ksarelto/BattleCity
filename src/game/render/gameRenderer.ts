import type { GameWorld } from '@/types/game';
import { FIELD_SIZE, TILE_SIZE } from '@/game/core/constants';
import { spriteAtlas, tankVariantFor } from '@/game/render/spriteAtlas';

export class GameRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private host: HTMLElement | null = null;

  async init(container: HTMLElement): Promise<void> {
    this.destroy();
    await spriteAtlas.load();

    const canvas = document.createElement('canvas');
    canvas.width = FIELD_SIZE;
    canvas.height = FIELD_SIZE;
    canvas.style.display = 'block';
    canvas.style.imageRendering = 'pixelated';

    container.replaceChildren(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context is not available');
    }

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
    ctx.fillRect(0, 0, FIELD_SIZE, FIELD_SIZE);

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        const cell = world.grid[row]![col]!;
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        if (cell.id === 'brick' && cell.brick) {
          const q = cell.brick;
          if (q.tl) spriteAtlas.drawBrickQuadrant(ctx, x, y, 0, 0, TILE_SIZE);
          if (q.tr) spriteAtlas.drawBrickQuadrant(ctx, x, y, 1, 0, TILE_SIZE);
          if (q.bl) spriteAtlas.drawBrickQuadrant(ctx, x, y, 0, 1, TILE_SIZE);
          if (q.br) spriteAtlas.drawBrickQuadrant(ctx, x, y, 1, 1, TILE_SIZE);
        } else if (cell.id === 'steel' || cell.id === 'water' || cell.id === 'ice') {
          spriteAtlas.drawTile(ctx, cell.id, x, y, TILE_SIZE);
        }
      }
    }

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        if (world.overlayGrid[row]![col] === 'bush') {
          spriteAtlas.drawTile(ctx, 'bush', col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE);
        }
      }
    }

    if (world.baseIntact) {
      const { col, row } = world.basePosition;
      spriteAtlas.drawBase(ctx, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE * 2, true);
    } else if (world.phase === 'gameOver') {
      const { col, row } = world.basePosition;
      spriteAtlas.drawBase(ctx, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE * 2, false);
    }

    for (const player of world.players) {
      if (player.spawnAnimRemaining > 0 && Math.floor(world.tick / 8) % 2 === 0) continue;
      const variant = tankVariantFor(player.team);
      spriteAtlas.drawTank(
        ctx,
        variant,
        player.direction,
        Math.floor(world.tick / 8) % 2 as 0 | 1,
        player.position.x,
        player.position.y,
        TILE_SIZE,
        world.tick,
      );
      if (player.invincibleUntil > world.tick && Math.floor(world.tick / 4) % 2 === 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.position.x, player.position.y, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const enemy of world.enemies) {
      if (enemy.spawnAnimRemaining > 0 && Math.floor(world.tick / 8) % 2 === 0) continue;
      spriteAtlas.drawTank(
        ctx,
        tankVariantFor('enemy', enemy.enemyType),
        enemy.direction,
        Math.floor(world.tick / 8) % 2 as 0 | 1,
        enemy.position.x,
        enemy.position.y,
        TILE_SIZE,
        world.tick,
      );
      if (enemy.isFlashing && Math.floor(world.tick / 4) % 2 === 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.position.x - 2, enemy.position.y - 2, TILE_SIZE + 4, TILE_SIZE + 4);
      }
    }

    for (const bullet of world.bullets) {
      spriteAtlas.drawBullet(ctx, bullet.position.x, bullet.position.y, 6);
    }

    for (const pu of world.powerUps) {
      if (!pu.active) continue;
      if (Math.floor(world.tick / 8) % 2 === 0) continue;
      spriteAtlas.drawPowerUp(ctx, pu.type, pu.position.x, pu.position.y, TILE_SIZE);
    }

    for (const exp of world.explosions) {
      const total = exp.large ? 60 : 30;
      const progress = 1 - exp.remaining / total;
      const alpha = exp.remaining / total;
      spriteAtlas.drawExplosion(
        ctx,
        exp.position.x - (exp.large ? 8 : 0),
        exp.position.y - (exp.large ? 8 : 0),
        exp.large ? 32 : 16,
        exp.large,
        progress,
        alpha,
      );
    }

    if (world.phase === 'countdown') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, 0, FIELD_SIZE, FIELD_SIZE);
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px monospace';
      ctx.fillText('GET READY', FIELD_SIZE / 2 - 40, FIELD_SIZE / 2);
    }

    if (world.phase === 'paused') {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, FIELD_SIZE, FIELD_SIZE);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText('PAUSED', FIELD_SIZE / 2 - 30, FIELD_SIZE / 2);
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
