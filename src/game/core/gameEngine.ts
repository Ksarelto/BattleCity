import type { GameWorld } from '@/types/game';
import { gameEvents } from '@/game/core/eventBus';
import { createGameWorld, toHudSnapshot, resetIdCounter } from '@/game/core/gameWorld';
import { Rng } from '@/game/core/rng';
import { InputManager, consumePauseKey } from '@/game/input/inputManager';
import { loadLevel } from '@/game/levels/levelLoader';
import { GameRenderer } from '@/game/render/gameRenderer';
import { updateBulletSystem } from '@/game/systems/bulletSystem';
import { clearSlideState, updateMovementSystem } from '@/game/systems/movementSystem';
import { updatePowerUpSystem, updateTimerEffect } from '@/game/systems/powerUpSystem';
import { updateSpawnSystem } from '@/game/systems/spawnSystem';
import { AudioManager } from '@/game/audio/audioManager';

export interface GameEngineOptions {
  container: HTMLElement;
  stageNumber?: number;
  twoPlayer?: boolean;
  difficulty?: 'easy' | 'normal';
  customLevel?: ReturnType<typeof loadLevel>;
  onHudUpdate?: (snapshot: ReturnType<typeof toHudSnapshot>) => void;
  onStageClear?: (world: GameWorld) => void;
  onGameOver?: (world: GameWorld) => void;
}

export class GameEngine {
  private world: GameWorld;
  private renderer: GameRenderer;
  private input: InputManager;
  private audio: AudioManager;
  private container: HTMLElement;
  private running = false;
  private rafId = 0;
  private accumulator = 0;
  private hudTimer = 0;
  private options: GameEngineOptions;
  private destroyed = false;

  constructor(options: GameEngineOptions) {
    this.options = options;
    this.container = options.container;
    resetIdCounter();
    const level = options.customLevel ?? loadLevel(options.stageNumber ?? 1);
    this.world = createGameWorld(level, {
      stageNumber: options.stageNumber ?? 1,
      twoPlayer: options.twoPlayer ?? false,
      difficulty: options.difficulty ?? 'normal',
      rng: new Rng(level.id * 1000),
    });
    if (!options.twoPlayer) {
      this.world.players = [this.world.players[0]!];
    }
    this.renderer = new GameRenderer();
    this.input = new InputManager();
    this.audio = new AudioManager();
  }

  async start(): Promise<void> {
    await this.renderer.init(this.container);
    this.emitHud();
    this.renderer.render(this.world);
    this.running = true;
    this.loop(performance.now());
  }

  private loop = (now: number): void => {
    if (!this.running || this.destroyed) return;

    if (!this.lastTime) this.lastTime = now;
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.accumulator += delta;

    while (this.accumulator >= 1 / 60) {
      this.tick();
      this.accumulator -= 1 / 60;
    }

    this.renderer.render(this.world);
    this.rafId = requestAnimationFrame(this.loop);
  };

  private lastTime = 0;

  private tick(): void {
    const world = this.world;
    world.tick += 1;

    if (consumePauseKey()) {
      if (world.phase === 'playing') world.phase = 'paused';
      else if (world.phase === 'paused') world.phase = 'playing';
    }

    if (world.phase === 'countdown') {
      world.countdownTimer -= 1;
      if (world.countdownTimer <= 0) world.phase = 'playing';
      this.emitHud();
      return;
    }

    if (world.phase === 'stageClear') {
      world.stageClearTimer -= 1;
      if (world.stageClearTimer <= 0) {
        this.options.onStageClear?.(world);
      }
      this.emitHud();
      return;
    }

    if (world.phase === 'gameOver') {
      this.options.onGameOver?.(world);
      this.emitHud();
      return;
    }

    if (world.phase === 'paused') {
      this.emitHud();
      return;
    }

    const moveInputs = world.players.map((p) => {
      const playerNum = p.team === 'player1' ? 1 : 2;
      const inp = this.input.getPlayerInput(playerNum as 1 | 2);
      return { playerId: p.id, direction: inp.direction };
    });

    const fireInputs = world.players.map((p) => {
      const playerNum = p.team === 'player1' ? 1 : 2;
      const inp = this.input.getPlayerInput(playerNum as 1 | 2);
      if (inp.fire) this.audio.play('shoot');
      return { playerId: p.id, fire: inp.fire };
    });

    updateMovementSystem(world, moveInputs);
    updateSpawnSystem(world);
    updateBulletSystem(world, fireInputs);
    updatePowerUpSystem(world);
    updateTimerEffect(world);

    world.explosions = world.explosions
      .map((e) => ({ ...e, remaining: e.remaining - 1 }))
      .filter((e) => e.remaining > 0);

    this.hudTimer += 1;
    if (this.hudTimer >= 6) {
      this.emitHud();
      this.hudTimer = 0;
    }
  }

  private emitHud(): void {
    const snapshot = toHudSnapshot(this.world);
    this.options.onHudUpdate?.(snapshot);
    gameEvents.emit('hud:update', snapshot);
  }

  pause(): void {
    if (this.world.phase === 'playing') this.world.phase = 'paused';
  }

  resume(): void {
    if (this.world.phase === 'paused') this.world.phase = 'playing';
  }

  getWorld(): GameWorld {
    return this.world;
  }

  getInput(): InputManager {
    return this.input;
  }

  loadStage(stageNumber: number, carryOver?: { score: number; lives: number; extraLifeAwarded: boolean }): void {
    resetIdCounter();
    clearSlideState();
    const loopCount = stageNumber > 35 ? Math.floor((stageNumber - 1) / 35) : 0;
    const level = loadLevel(((stageNumber - 1) % 35) + 1, loopCount);
    this.world = createGameWorld(level, {
      stageNumber,
      loopCount,
      score: carryOver?.score ?? this.world.score,
      lives: carryOver?.lives ?? this.world.lives,
      extraLifeAwarded: carryOver?.extraLifeAwarded ?? this.world.extraLifeAwarded,
      twoPlayer: this.options.twoPlayer ?? false,
      difficulty: this.options.difficulty ?? 'normal',
      rng: new Rng(stageNumber * 1000),
    });
    if (!this.options.twoPlayer) {
      this.world.players = [this.world.players[0]!];
    }
    this.world.playerKills = [0, 0];
  }

  destroy(): void {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.input.destroy();
    this.renderer.destroy();
    this.audio.destroy();
    clearSlideState();
  }
}
