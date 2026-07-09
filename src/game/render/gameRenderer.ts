import { Application, Container, Graphics, Text } from 'pixi.js';
import type { GameWorld } from '@/types/game';
import {
  FIELD_SIZE,
  POWER_UP_COLORS,
  TANK_COLORS,
  TILE_COLORS,
  TILE_SIZE,
} from '@/game/core/constants';
import { brickIntact } from '@/game/core/gameWorld';

export class GameRenderer {
  private app: Application | null = null;
  private worldContainer: Container | null = null;
  private initialized = false;

  async init(container: HTMLElement): Promise<void> {
    if (this.initialized) return;

    this.app = new Application();
    await this.app.init({
      width: FIELD_SIZE,
      height: FIELD_SIZE,
      backgroundColor: 0x000000,
      antialias: false,
      resolution: 1,
    });

    container.innerHTML = '';
    container.appendChild(this.app.canvas);
    this.worldContainer = new Container();
    this.app.stage.addChild(this.worldContainer);
    this.initialized = true;
  }

  render(world: GameWorld): void {
    if (!this.app || !this.worldContainer) return;

    this.worldContainer.removeChildren();

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        const cell = world.grid[row]![col]!;
        if (cell.id === 'empty') continue;

        const g = new Graphics();
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        if (cell.id === 'brick' && cell.brick) {
          const q = cell.brick;
          const c = TILE_COLORS.brick;
          if (q.tl) g.rect(x, y, 8, 8).fill(c);
          if (q.tr) g.rect(x + 8, y, 8, 8).fill(c);
          if (q.bl) g.rect(x, y + 8, 8, 8).fill(c);
          if (q.br) g.rect(x + 8, y + 8, 8, 8).fill(c);
        } else {
          g.rect(x, y, TILE_SIZE, TILE_SIZE).fill(TILE_COLORS[cell.id]);
        }
        this.worldContainer.addChild(g);
      }
    }

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        if (world.overlayGrid[row]![col] === 'bush') {
          const g = new Graphics();
          g.rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE)
            .fill({ color: TILE_COLORS.bush, alpha: 0.7 });
          this.worldContainer.addChild(g);
        }
      }
    }

    if (world.baseIntact) {
      const g = new Graphics();
      const { col, row } = world.basePosition;
      g.rect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE * 2, TILE_SIZE * 2).fill(0xffaa00);
      this.worldContainer.addChild(g);
    }

    for (let i = 0; i < world.players.length; i++) {
      const player = world.players[i]!;
      if (player.spawnAnimRemaining > 0 && Math.floor(world.tick / 8) % 2 === 0) continue;
      const color = player.team === 'player1' ? TANK_COLORS.player1 : TANK_COLORS.player2;
      this.drawTank(player.position.x, player.position.y, color, player.direction);
      if (player.invincibleUntil > world.tick && Math.floor(world.tick / 4) % 2 === 0) {
        const shield = new Graphics();
        shield.rect(player.position.x, player.position.y, TILE_SIZE, TILE_SIZE)
          .stroke({ color: 0xffffff, width: 2 });
        this.worldContainer.addChild(shield);
      }
    }

    for (const enemy of world.enemies) {
      if (enemy.spawnAnimRemaining > 0 && Math.floor(world.tick / 8) % 2 === 0) continue;
      const colors = enemy.enemyType === 'armor'
        ? TANK_COLORS.armor[Math.min(3, enemy.hp - 1)]
        : TANK_COLORS[enemy.enemyType ?? 'basic'];
      this.drawTank(enemy.position.x, enemy.position.y, colors, enemy.direction);
      if (enemy.isFlashing && Math.floor(world.tick / 4) % 2 === 0) {
        const flash = new Graphics();
        flash.rect(enemy.position.x - 2, enemy.position.y - 2, TILE_SIZE + 4, TILE_SIZE + 4)
          .stroke({ color: 0xff0000, width: 2 });
        this.worldContainer.addChild(flash);
      }
    }

    for (const bullet of world.bullets) {
      const g = new Graphics();
      g.rect(bullet.position.x, bullet.position.y, 4, 4).fill(0xffffff);
      this.worldContainer.addChild(g);
    }

    for (const pu of world.powerUps) {
      if (!pu.active) continue;
      const g = new Graphics();
      g.rect(pu.position.x + 2, pu.position.y + 2, 12, 12).fill(POWER_UP_COLORS[pu.type]);
      this.worldContainer.addChild(g);
    }

    for (const exp of world.explosions) {
      const alpha = exp.remaining / (exp.large ? 60 : 30);
      const g = new Graphics();
      g.circle(exp.position.x + 8, exp.position.y + 8, exp.large ? 16 : 8)
        .fill({ color: 0xff6600, alpha });
      this.worldContainer.addChild(g);
    }

    if (world.phase === 'paused') {
      const overlay = new Graphics();
      overlay.rect(0, 0, FIELD_SIZE, FIELD_SIZE).fill({ color: 0x000000, alpha: 0.5 });
      const text = new Text({ text: 'PAUSED', style: { fill: 0xffffff, fontSize: 16 } });
      text.x = FIELD_SIZE / 2 - 30;
      text.y = FIELD_SIZE / 2 - 8;
      this.worldContainer.addChild(overlay, text);
    }
  }

  private drawTank(x: number, y: number, color: number, direction: string): void {
    const g = new Graphics();
    g.rect(x + 2, y + 2, 12, 12).fill(color);
    const cx = x + 8;
    const cy = y + 8;
    if (direction === 'up') g.rect(cx - 2, y, 4, 6).fill(color);
    if (direction === 'down') g.rect(cx - 2, y + 10, 4, 6).fill(color);
    if (direction === 'left') g.rect(x, cy - 2, 6, 4).fill(color);
    if (direction === 'right') g.rect(x + 10, cy - 2, 6, 4).fill(color);
    this.worldContainer!.addChild(g);
  }

  destroy(): void {
    this.app?.destroy(true, { children: true });
    this.app = null;
    this.worldContainer = null;
    this.initialized = false;
  }
}

export function isBrickCellIntact(cell: { id: string; brick?: { tl: boolean; tr: boolean; bl: boolean; br: boolean } }): boolean {
  if (cell.id !== 'brick' || !cell.brick) return cell.id === 'brick';
  return brickIntact(cell.brick);
}
