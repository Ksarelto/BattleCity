import type { GameWorld } from '@/types/game';
import {
  FIELD_SIZE,
  POWER_UP_COLORS,
  TANK_COLORS,
  TILE_COLORS,
  TILE_SIZE,
} from '@/game/core/constants';

function hex(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

export class GameRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private host: HTMLElement | null = null;

  async init(container: HTMLElement): Promise<void> {
    this.destroy();

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
          ctx.fillStyle = hex(TILE_COLORS.brick);
          if (q.tl) ctx.fillRect(x, y, 8, 8);
          if (q.tr) ctx.fillRect(x + 8, y, 8, 8);
          if (q.bl) ctx.fillRect(x, y + 8, 8, 8);
          if (q.br) ctx.fillRect(x + 8, y + 8, 8, 8);
        } else if (cell.id !== 'empty') {
          ctx.fillStyle = hex(TILE_COLORS[cell.id]);
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        if (world.overlayGrid[row]![col] === 'bush') {
          ctx.fillStyle = hex(TILE_COLORS.bush);
          ctx.globalAlpha = 0.7;
          ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          ctx.globalAlpha = 1;
        }
      }
    }

    if (world.baseIntact) {
      const { col, row } = world.basePosition;
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE * 2, TILE_SIZE * 2);
    }

    for (const player of world.players) {
      if (player.spawnAnimRemaining > 0 && Math.floor(world.tick / 8) % 2 === 0) continue;
      const color = player.team === 'player1' ? TANK_COLORS.player1 : TANK_COLORS.player2;
      this.drawTank(ctx, player.position.x, player.position.y, color, player.direction);
      if (player.invincibleUntil > world.tick && Math.floor(world.tick / 4) % 2 === 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.position.x, player.position.y, TILE_SIZE, TILE_SIZE);
      }
    }

    for (const enemy of world.enemies) {
      if (enemy.spawnAnimRemaining > 0 && Math.floor(world.tick / 8) % 2 === 0) continue;
      const color = enemy.enemyType === 'armor'
        ? TANK_COLORS.armor[Math.min(3, enemy.hp - 1)]!
        : TANK_COLORS[enemy.enemyType ?? 'basic'];
      this.drawTank(ctx, enemy.position.x, enemy.position.y, color, enemy.direction);
      if (enemy.isFlashing && Math.floor(world.tick / 4) % 2 === 0) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(enemy.position.x - 2, enemy.position.y - 2, TILE_SIZE + 4, TILE_SIZE + 4);
      }
    }

    for (const bullet of world.bullets) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bullet.position.x, bullet.position.y, 4, 4);
    }

    for (const pu of world.powerUps) {
      if (!pu.active) continue;
      ctx.fillStyle = hex(POWER_UP_COLORS[pu.type]);
      ctx.fillRect(pu.position.x + 2, pu.position.y + 2, 12, 12);
    }

    for (const exp of world.explosions) {
      const alpha = exp.remaining / (exp.large ? 60 : 30);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(exp.position.x + 8, exp.position.y + 8, exp.large ? 16 : 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
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

  private drawTank(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: number,
    direction: string,
  ): void {
    ctx.fillStyle = hex(color);
    ctx.fillRect(x + 2, y + 2, 12, 12);
    const cx = x + 8;
    const cy = y + 8;
    if (direction === 'up') ctx.fillRect(cx - 2, y, 4, 6);
    if (direction === 'down') ctx.fillRect(cx - 2, y + 10, 4, 6);
    if (direction === 'left') ctx.fillRect(x, cy - 2, 6, 4);
    if (direction === 'right') ctx.fillRect(x + 10, cy - 2, 6, 4);
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
