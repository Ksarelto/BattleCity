import type { Difficulty, GameWorld } from '@/models';
import { Difficulty as Diff, GamePhase, Team } from '@/enums';
import { createGameWorld, toHudSnapshot, resetIdCounter } from '@/services/engine/createWorld';
import { Rng } from '@/utils/rng';
import { InputService, consumePauseKey } from '@/services/input/InputService';
import { loadLevel } from '@/services/level/LevelService';
import { RenderService } from '@/services/render/RenderService';
import { updateBulletSystem } from '@/services/bullet/BulletService';
import { updateMovementSystem } from '@/services/movement/MovementService';
import { updatePowerUpSystem, updateTimerEffect } from '@/services/powerUp/PowerUpService';
import { updateSpawnSystem } from '@/services/spawn/SpawnService';
import { AudioService } from '@/services/audio/AudioService';
import { drainSfxQueue, queueSfx } from '@/services/audio/sfxQueue';
import {
  DEFAULT_SFX_VOLUME,
  FIXED_DT,
  HUD_EMIT_INTERVAL_TICKS,
  MAX_FRAME_DELTA,
  RNG_STAGE_SEED_SCALE,
  STAGE_COUNT,
} from '@/utils/constants';

export interface GameEngineOptions {
  container: HTMLElement;
  stageNumber?: number;
  twoPlayer?: boolean;
  difficulty?: Difficulty;
  sfxVolume?: number;
  muted?: boolean;
  customLevel?: ReturnType<typeof loadLevel>;
  onHudUpdate?: (snapshot: ReturnType<typeof toHudSnapshot>) => void;
  onStageClear?: (world: GameWorld) => void;
  onGameOver?: (world: GameWorld) => void;
}

export class GameEngine {
  private world: GameWorld;
  private renderer: RenderService;
  private input: InputService;
  private audio: AudioService;
  private container: HTMLElement;
  private running = false;
  private rafId = 0;
  private accumulator = 0;
  private hudTimer = 0;
  private options: GameEngineOptions;
  private destroyed = false;
  private lastPhase: GameWorld['phase'] | null = null;
  private gameOverNotified = false;

  constructor(options: GameEngineOptions) {
    this.options = options;
    this.container = options.container;
    resetIdCounter();
    const level = options.customLevel ?? loadLevel(options.stageNumber ?? 1);
    this.world = createGameWorld(level, {
      stageNumber: options.stageNumber ?? 1,
      twoPlayer: options.twoPlayer ?? false,
      difficulty: options.difficulty ?? Diff.normal,
      rng: new Rng(level.id * RNG_STAGE_SEED_SCALE),
    });
    if (!options.twoPlayer) {
      this.world.players = [this.world.players[0]!];
    }
    this.renderer = new RenderService();
    this.input = new InputService();
    this.input.setTwoPlayer(options.twoPlayer ?? false);
    this.audio = new AudioService();
    this.applyAudioSettings(options.sfxVolume ?? DEFAULT_SFX_VOLUME, options.muted ?? false);
  }

  async start(): Promise<void> {
    await this.renderer.init(this.container);
    this.lastPhase = this.world.phase;
    queueSfx('stageStart');
    this.flushSfx();
    this.emitHud();
    this.renderer.render(this.world);
    this.running = true;
    this.loop(performance.now());
  }

  private loop = (now: number): void => {
    if (!this.running || this.destroyed) return;

    if (!this.lastTime) this.lastTime = now;
    const delta = Math.min((now - this.lastTime) / 1000, MAX_FRAME_DELTA);
    this.lastTime = now;
    this.accumulator += delta;

    while (this.accumulator >= FIXED_DT) {
      this.tick();
      this.accumulator -= FIXED_DT;
    }

    this.renderer.render(this.world);
    this.rafId = requestAnimationFrame(this.loop);
  };

  private lastTime = 0;

  private tick(): void {
    const world = this.world;
    world.tick += 1;

    if (this.lastPhase !== world.phase) {
      if (world.phase === GamePhase.countdown) {
        queueSfx('stageStart');
      }
      this.lastPhase = world.phase;
    }

    if (consumePauseKey()) {
      if (world.phase === GamePhase.playing) world.phase = GamePhase.paused;
      else if (world.phase === GamePhase.paused) world.phase = GamePhase.playing;
    }

    if (world.phase === GamePhase.countdown) {
      world.countdownTimer -= 1;
      if (world.countdownTimer <= 0) world.phase = GamePhase.playing;
      this.audio.setEngineActive(false);
      this.flushSfx();
      this.emitHud();
      return;
    }

    if (world.phase === GamePhase.stageClear) {
      world.stageClearTimer -= 1;
      if (world.stageClearTimer <= 0) {
        this.options.onStageClear?.(world);
      }
      this.audio.setEngineActive(false);
      this.flushSfx();
      this.emitHud();
      return;
    }

    if (world.phase === GamePhase.gameOver) {
      if (!this.gameOverNotified) {
        this.gameOverNotified = true;
        this.options.onGameOver?.(world);
      }
      this.audio.setEngineActive(false);
      this.flushSfx();
      this.emitHud();
      return;
    }

    if (world.phase === GamePhase.paused) {
      this.audio.setEngineActive(false);
      this.flushSfx();
      this.emitHud();
      return;
    }

    const playerInputs = world.players.map((p) => {
      const playerNum = p.team === Team.player1 ? 1 : 2;
      const inp = this.input.getPlayerInput(playerNum as 1 | 2);
      return {
        playerId: p.id,
        direction: inp.direction,
        fire: inp.fire,
      };
    });

    updateMovementSystem(
      world,
      playerInputs.map(({ playerId, direction }) => ({ playerId, direction })),
    );
    updateSpawnSystem(world);
    updateBulletSystem(
      world,
      playerInputs.map(({ playerId, fire }) => ({ playerId, fire })),
    );
    updatePowerUpSystem(world);
    updateTimerEffect(world);

    world.explosions = world.explosions
      .map((e) => ({ ...e, remaining: e.remaining - 1 }))
      .filter((e) => e.remaining > 0);

    const engineOn = world.players.some((p) => p.moving);
    this.audio.setEngineActive(engineOn);
    this.flushSfx();

    this.hudTimer += 1;
    if (this.hudTimer >= HUD_EMIT_INTERVAL_TICKS) {
      this.emitHud();
      this.hudTimer = 0;
    }
  }

  private flushSfx(): void {
    for (const id of drainSfxQueue()) {
      this.audio.play(id);
    }
  }

  private emitHud(): void {
    const snapshot = toHudSnapshot(this.world);
    this.options.onHudUpdate?.(snapshot);
  }

  applyAudioSettings(sfxVolume: number, muted: boolean): void {
    this.audio.setVolume(sfxVolume);
    this.audio.setMuted(muted);
  }

  pause(): void {
    if (this.world.phase === GamePhase.playing) this.world.phase = GamePhase.paused;
  }

  resume(): void {
    if (this.world.phase === GamePhase.paused) this.world.phase = GamePhase.playing;
  }

  getWorld(): GameWorld {
    return this.world;
  }

  getInput(): InputService {
    return this.input;
  }

  loadStage(stageNumber: number, carryOver?: { score: number; lives: number; extraLifeAwarded: boolean }): void {
    resetIdCounter();
    const loopCount = stageNumber > STAGE_COUNT ? Math.floor((stageNumber - 1) / STAGE_COUNT) : 0;
    const level = loadLevel(((stageNumber - 1) % STAGE_COUNT) + 1, loopCount);
    this.world = createGameWorld(level, {
      stageNumber,
      loopCount,
      score: carryOver?.score ?? this.world.score,
      lives: carryOver?.lives ?? this.world.lives,
      extraLifeAwarded: carryOver?.extraLifeAwarded ?? this.world.extraLifeAwarded,
      twoPlayer: this.options.twoPlayer ?? false,
      difficulty: this.options.difficulty ?? Diff.normal,
      rng: new Rng(stageNumber * RNG_STAGE_SEED_SCALE),
    });
    if (!this.options.twoPlayer) {
      this.world.players = [this.world.players[0]!];
    }
    this.world.playerKills = [0, 0];
    this.gameOverNotified = false;
    this.lastPhase = this.world.phase;
    queueSfx('stageStart');
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.input.destroy();
    this.renderer.destroy();
    this.audio.destroy();
  }
}
